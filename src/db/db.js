import Dexie from 'dexie';

export const db = new Dexie('LogPoDB');

db.version(1).stores({
  missions: '++id, parentId, depth, interval, weekday',
  history: '++id, missionId, achievedAt',
  rewards: '++id, requiredPoints',
  userData: 'key',
});

db.version(2).stores({
  missions: '++id, parentId, depth, interval, weekday, sortOrder',
  history: '++id, missionId, achievedAt',
  rewards: '++id, requiredPoints',
  userData: 'key',
}).upgrade(tx => {
  return tx.table('missions').toCollection().modify((mission) => {
    mission.sortOrder = mission.id;
  });
});

// -------- UserData helpers --------
export async function getUserData(key, defaultValue = null) {
  const row = await db.userData.get(key);
  return row ? row.value : defaultValue;
}

export async function setUserData(key, value) {
  await db.userData.put({ key, value });
}

// -------- Total Points --------
export async function getTotalPoints() {
  return getUserData('totalPoints', 0);
}

export async function addPoints(pts) {
  return db.transaction('rw', db.userData, async () => {
    const current = await getTotalPoints();
    const newTotal = Math.max(0, current + pts);
    await setUserData('totalPoints', newTotal);
    return newTotal;
  });
}

// -------- Reset Logic --------
function getWeekStart(date, weekday) {
  // Returns Monday of the ISO week containing `date` adjusted to `weekday`
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day - weekday + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export async function runResetCheck() {
  const now = new Date();
  const lastRunStr = await getUserData('lastResetCheck', null);
  const lastRun = lastRunStr ? new Date(lastRunStr) : null;

  if (!lastRun) {
    await setUserData('lastResetCheck', now.toISOString());
    return;
  }

  await db.transaction('rw', db.missions, db.userData, async () => {
    const missions = await db.missions.toArray();

    for (const m of missions) {
      if (!m.completedAt) continue;
      const completed = new Date(m.completedAt);

      let shouldReset = false;
      if (m.interval === 'daily') {
        const today = new Date(now); today.setHours(0,0,0,0);
        const completedDay = new Date(completed); completedDay.setHours(0,0,0,0);
        shouldReset = today > completedDay;
      } else if (m.interval === 'weekly') {
        const currentWeekStart = getWeekStart(now, m.weekday ?? 1);
        const completedWeekStart = getWeekStart(completed, m.weekday ?? 1);
        shouldReset = currentWeekStart > completedWeekStart;
      } else if (m.interval === 'monthly') {
        const currentMonth = getMonthStart(now);
        const completedMonth = getMonthStart(completed);
        shouldReset = currentMonth > completedMonth;
      }

      if (shouldReset) {
        await db.missions.update(m.id, { completedAt: null });
      }
    }

    await setUserData('lastResetCheck', now.toISOString());
  });
}

// -------- Reward unlock check --------
export async function checkRewardUnlocks(totalPoints) {
  const rewards = await db.rewards.toArray();
  const newlyUnlocked = [];
  for (const r of rewards) {
    if (!r.unlockedAt && totalPoints >= r.requiredPoints) {
      await db.rewards.update(r.id, { unlockedAt: new Date().toISOString() });
      newlyUnlocked.push({ ...r, unlockedAt: new Date().toISOString() });
    }
  }
  return newlyUnlocked;
}

// -------- Notification Settings --------
export async function getNotificationSettings() {
  const enabled = await getUserData('notificationEnabled', false);
  const time = await getUserData('notificationTime', '21:00');
  return { enabled, time };
}

export async function setNotificationEnabled(enabled) {
  await setUserData('notificationEnabled', enabled);
}

export async function setNotificationTime(time) {
  await setUserData('notificationTime', time);
}

// -------- Export / Import --------
export async function exportAllData() {
  const [missions, history, rewards, userData] = await Promise.all([
    db.missions.toArray(),
    db.history.toArray(),
    db.rewards.toArray(),
    db.userData.toArray(),
  ]);
  return { missions, history, rewards, userData, exportedAt: new Date().toISOString() };
}

export async function importAllData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid import data: expected an object');
  }

  const tables = ['missions', 'history', 'rewards', 'userData'];
  for (const table of tables) {
    if (data[table] !== undefined && !Array.isArray(data[table])) {
      throw new Error(`Invalid import data: "${table}" must be an array`);
    }
  }

  await db.transaction('rw', db.missions, db.history, db.rewards, db.userData, async () => {
    await db.missions.clear();
    await db.history.clear();
    await db.rewards.clear();
    await db.userData.clear();
    if (data.missions) await db.missions.bulkAdd(data.missions);
    if (data.history) await db.history.bulkAdd(data.history);
    if (data.rewards) await db.rewards.bulkAdd(data.rewards);
    if (data.userData) await db.userData.bulkAdd(data.userData);
  });
}

export async function clearHistory() {
  await db.history.clear();
}

// -------- Mission Reorder --------
export async function swapMissionOrder(missionId1, missionId2) {
  await db.transaction('rw', db.missions, async () => {
    const m1 = await db.missions.get(missionId1);
    const m2 = await db.missions.get(missionId2);
    if (!m1 || !m2) return;
    await db.missions.update(missionId1, { sortOrder: m2.sortOrder });
    await db.missions.update(missionId2, { sortOrder: m1.sortOrder });
  });
}

export async function getNextSortOrder(parentId) {
  let siblings;
  if (parentId == null) {
    siblings = await db.missions.filter(m => m.parentId == null).toArray();
  } else {
    siblings = await db.missions.where('parentId').equals(parentId).toArray();
  }
  if (siblings.length === 0) return 1;
  return Math.max(...siblings.map(s => s.sortOrder ?? 0)) + 1;
}
