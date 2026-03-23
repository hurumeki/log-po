const en = {
  // Bottom navigation
  nav: {
    mission: 'Missions',
    calendar: 'Calendar',
    rewards: 'Rewards',
    settings: 'Settings',
  },

  // Common
  common: {
    cancel: 'Cancel',
    update: 'Update',
    add: 'Add',
    close: 'Close',
    loading: 'Loading...',
    delete: 'Delete',
    edit: 'Edit',
  },

  // Points header
  points: {
    currentTotal: 'Total Points',
    nextGoal: (title, remaining) => `Next goal: "${title}" — ${remaining}pt to go`,
  },

  // Mission screen
  mission: {
    noMissions: 'No missions yet',
    noMissionsHint: 'Tap the + button to add one!',
    deleteConfirm: (title) => `Delete "${title}"?`,
    deleteGroupConfirm: (title, label, count) =>
      `Delete "${title}"?\n\nAll ${count} missions in this ${label} will also be deleted.`,
    category: 'category',
    subcategory: 'subcategory',
  },

  // Mission intervals
  interval: {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    dailyFull: 'Daily',
    weeklyFull: 'Weekly',
    monthlyFull: 'Monthly',
    weeklyDay: (day) => `Weekly: ${day}`,
    weeklyDayFull: (day) => `Weekly (${day})`,
  },

  // Weekdays
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  // Add mission modal
  addMission: {
    editCategory: 'Edit Category',
    editSubcategory: 'Edit Subcategory',
    editMission: 'Edit Mission',
    addMission: 'Add Mission',
    categoryName: 'Category Name',
    subcategoryName: 'Subcategory Name',
    categoryLabel: 'Category',
    categoryPlaceholder: 'e.g. Exercise & Health',
    subcategoryLabel: 'Subcategory',
    subcategoryPlaceholder: 'e.g. New Habits',
    taskName: 'Task Name *',
    taskPlaceholder: 'e.g. 10 push-ups',
    memoLabel: 'Notes',
    memoPlaceholder: 'e.g. Do it right after waking up',
    intervalLabel: 'Interval',
    intervalDaily: 'Daily',
    intervalWeekly: 'Weekly',
    intervalMonthly: 'Monthly',
    baseWeekday: 'Start Day',
    earnPoints: 'Points Earned',
  },

  // Preset categories
  presetCategories: [
    { emoji: '💪', name: 'Exercise & Health' },
    { emoji: '📚', name: 'Study & Learning' },
    { emoji: '🏠', name: 'Housework & Life' },
    { emoji: '💼', name: 'Work & Career' },
    { emoji: '🌟', name: 'Custom' },
  ],

  // Mission detail popup
  detail: {
    memoLabel: 'Notes',
    noMemo: 'No notes',
  },

  // Context menu
  contextMenu: {
    edit: '✏️ Edit',
    delete: '🗑 Delete',
  },

  // Calendar screen
  calendar: {
    title: 'Achievement Calendar',
    monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    yearMonth: (year, month) => `${month} ${year}`,
    recordOf: (date) => `Records for ${date}`,
    achievedCount: (count) => `${count} achieved 🌸`,
    noRecords: 'No records',
  },

  // Rewards screen
  rewards: {
    title: 'Rewards List',
    holding: 'Points',
    noRewards: 'No rewards yet',
    noRewardsHint: 'Tap the + button to add one!',
    required: 'Required',
    progress: (pct) => `Progress ${pct}%`,
    remaining: (pts) => `${pts} pt to go`,
    gotDate: (date) => `GET! 🎉 Unlocked on ${date}`,
    deleteConfirm: (title) => `Delete "${title}"?`,
  },

  // Add reward modal
  addReward: {
    editTitle: 'Edit Reward',
    addTitle: 'Add Reward',
    contentLabel: 'Reward *',
    contentPlaceholder: 'e.g. Buy a cake',
    pointsLabel: 'Required Points',
  },

  // Reward unlock modal
  rewardUnlock: {
    achieved: 'Goal Achieved!',
    unlocked: 'has been unlocked!',
    hooray: 'Hooray!',
  },

  // Settings screen
  settings: {
    title: 'Settings & Data',
    notificationSection: 'Notifications',
    reminderLabel: 'Incomplete Reminder',
    reminderDesc: 'Notify incomplete missions at a set time',
    notifTime: 'Notification Time',
    notifBlocked: 'Notifications are blocked. Please allow notifications in your browser settings.',
    notifPermRequired: 'Notification permission is required',
    notifOn: 'Notifications enabled',
    notifOff: 'Notifications disabled',
    dataSection: 'Data Management (Local)',
    exportBtn: 'Export All Data (JSON)',
    importBtn: 'Import Data',
    clearHistoryBtn: 'Clear History (Keep Points)',
    clearConfirmTitle: 'Clear history?',
    clearConfirmDesc: 'All achievement history will be deleted. Total points will be preserved.',
    clearConfirmBtn: 'Clear',
    exported: 'Saved',
    imported: 'Data restored',
    importError: 'Failed to read the file',
    historyCleared: 'History cleared',
    languageSection: 'Language',
    languageLabel: 'Display Language',
  },

  // Error boundary
  error: {
    title: 'An error occurred',
    description: 'Something went wrong while displaying the app.',
    reload: 'Reload',
  },
};

export default en;
