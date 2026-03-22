let scheduledTimerId = null;

export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export async function requestPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  const result = await Notification.requestPermission();
  return result; // 'granted' | 'denied' | 'default'
}

export function getPermissionStatus() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'granted' | 'denied' | 'default'
}

export function cancelScheduledNotification() {
  if (scheduledTimerId != null) {
    clearTimeout(scheduledTimerId);
    scheduledTimerId = null;
  }
}

export function scheduleNotification(getMissions, notifyTime) {
  cancelScheduledNotification();

  if (Notification.permission !== 'granted') return;

  const [hours, minutes] = notifyTime.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // If time already passed today, don't schedule (will reschedule on next app open)
  if (target <= now) return;

  const delay = target.getTime() - now.getTime();

  scheduledTimerId = setTimeout(async () => {
    scheduledTimerId = null;
    const missions = await getMissions();
    showNotificationIfNeeded(missions);
  }, delay);
}

async function showNotificationIfNeeded(missions) {
  // Count incomplete leaf (depth 2 or standalone leaf) daily missions
  const incompleteDailyLeaves = missions.filter(m => {
    const isLeaf = !missions.some(c => c.parentId === m.id);
    return isLeaf && m.interval === 'daily' && !m.completedAt;
  });

  if (incompleteDailyLeaves.length === 0) return;

  const count = incompleteDailyLeaves.length;
  const examples = incompleteDailyLeaves.slice(0, 2).map(m => m.title).join('、');
  const body = count <= 2
    ? `「${examples}」が未完了です`
    : `「${examples}」など${count}件が未完了です`;

  const iconPath = `${import.meta.env.BASE_URL}icons/icon-192.png`;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification('ログポ: 未完了ミッション', {
      body,
      icon: iconPath,
      badge: iconPath,
      tag: 'logpo-daily-reminder',
      renotify: true,
    });
  } catch {
    // Fallback to basic Notification API
    new Notification('ログポ: 未完了ミッション', {
      body,
      icon: iconPath,
      tag: 'logpo-daily-reminder',
    });
  }
}
