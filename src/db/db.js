import Dexie from 'dexie';

export const db = new Dexie('LogPoDB');

db.version(1).stores({
  missions: '++id, parentId, depth, interval, weekday',
  history: '++id, missionId, achievedAt',
  rewards: '++id, requiredPoints',
  userData: 'key',
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
  const current = await getTotalPoints();
  await setUserData('totalPoints', current + pts);
  return current + pts;
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
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function runResetCheck() {
  const now = new Date();
  const lastRunStr = await getUserData('lastResetCheck', null);
  const lastRun = lastRunStr ? new Date(lastRunStr) : null;

  if (!lastRun) {
    await setUserData('lastResetCheck', now.toISOString());
    return;
  }

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
