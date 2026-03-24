const ja = {
  // Bottom navigation
  nav: {
    mission: 'ミッション',
    calendar: 'カレンダー',
    rewards: 'ご褒美',
    settings: '設定',
  },

  // Common
  common: {
    cancel: 'キャンセル',
    update: '更新',
    add: '追加',
    close: '閉じる',
    loading: '読み込み中...',
    delete: '削除',
    edit: '編集',
  },

  // Points header
  points: {
    currentTotal: '現在の累計ポイント',
    nextGoal: (title, remaining) => `次の目標: 「${title}」まであと${remaining}pt`,
  },

  // Mission screen
  mission: {
    noMissions: 'ミッションがまだありません',
    noMissionsHint: '右下の＋ボタンで追加しましょう！',
    deleteConfirm: (title) => `「${title}」を削除しますか？`,
    deleteGroupConfirm: (title, label, count) =>
      `「${title}」を削除しますか？\n\nこの${label}内の${count}件のミッションもすべて削除されます。`,
    category: 'カテゴリ',
    subcategory: 'サブカテゴリ',
  },

  // Mission intervals
  interval: {
    daily: '日次',
    weekly: '週次',
    monthly: '月次',
    dailyFull: '日次 (毎日)',
    weeklyFull: '週次 (毎週)',
    monthlyFull: '月次 (毎月)',
    weeklyDay: (day) => `週次:${day}曜`,
    weeklyDayFull: (day) => `週次 (毎週) (${day}曜)`,
  },

  // Weekdays
  weekdays: ['日', '月', '火', '水', '木', '金', '土'],

  // Add mission modal
  addMission: {
    editCategory: 'カテゴリを編集',
    editSubcategory: 'サブカテゴリを編集',
    editMission: 'ミッションを編集',
    addMission: 'ミッションを追加',
    categoryName: 'カテゴリ名',
    subcategoryName: 'サブカテゴリ名',
    categoryLabel: 'カテゴリ (大項目)',
    categoryPlaceholder: '例: 運動・健康',
    subcategoryLabel: 'サブカテゴリ (中項目)',
    subcategoryPlaceholder: '例: 新しい習慣',
    taskName: 'タスク名 (ミッションの内容) *',
    taskPlaceholder: '例: 腕立て10回',
    memoLabel: '詳細メモ',
    memoPlaceholder: '例: 毎朝起きたらすぐやる',
    intervalLabel: '間隔 (周期)',
    intervalDaily: '日次 (毎日)',
    intervalWeekly: '週次 (毎週)',
    intervalMonthly: '月次 (毎月)',
    baseWeekday: '基準曜日',
    earnPoints: '獲得ポイント',
    saveError: '保存に失敗しました。もう一度お試しください。',
  },

  // Preset categories
  presetCategories: [
    { emoji: '💪', name: '運動・健康' },
    { emoji: '📚', name: '学習・勉強' },
    { emoji: '🏠', name: '家事・生活' },
    { emoji: '💼', name: '仕事・キャリア' },
    { emoji: '🌟', name: 'カスタム' },
  ],

  // Mission detail popup
  detail: {
    memoLabel: '詳細メモ',
    noMemo: '詳細メモはありません',
  },

  // Context menu
  contextMenu: {
    edit: '✏️ 編集',
    delete: '🗑 削除',
    moveUp: '⬆ 上へ移動',
    moveDown: '⬇ 下へ移動',
  },

  // Calendar screen
  calendar: {
    title: '達成カレンダー',
    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    yearMonth: (year, month) => `${year}年${month}`,
    recordOf: (date) => `${date} の記録`,
    achievedCount: (count) => `${count}件達成 🌸`,
    noRecords: '達成記録はありません',
  },

  // Rewards screen
  rewards: {
    title: 'ご褒美リスト',
    holding: '所持',
    noRewards: 'ご褒美がまだありません',
    noRewardsHint: '右下の＋ボタンで追加しましょう！',
    required: '必要',
    progress: (pct) => `進行度 ${pct}%`,
    remaining: (pts) => `あと ${pts} pt`,
    gotDate: (date) => `GET! 🎉 ${date} 獲得`,
    deleteConfirm: (title) => `「${title}」を削除しますか？`,
  },

  // Add reward modal
  addReward: {
    editTitle: '報酬編集',
    addTitle: '報酬追加',
    contentLabel: '報酬内容 *',
    contentPlaceholder: '例：ケーキを買う',
    pointsLabel: '必要ポイント',
    saveError: '保存に失敗しました。もう一度お試しください。',
  },

  // Reward unlock modal
  rewardUnlock: {
    achieved: '目標達成！',
    unlocked: 'が解禁されました！',
    hooray: 'やった！',
  },

  // Settings screen
  settings: {
    title: '設定・データ管理',
    notificationSection: '通知設定',
    reminderLabel: '未完了リマインダー',
    reminderDesc: '指定時刻に未完了ミッションを通知',
    notifTime: '通知時刻',
    notifBlocked: '通知がブロックされています。ブラウザの設定から通知を許可してください。',
    notifPermRequired: '通知の許可が必要です',
    notifOn: '通知をオンにしました',
    notifOff: '通知をオフにしました',
    dataSection: 'データ管理 (ローカル)',
    exportBtn: '全データをエクスポート (JSON)',
    importBtn: 'データをインポート',
    clearHistoryBtn: '履歴の消去 (ポイント維持)',
    clearConfirmTitle: '履歴を消去しますか？',
    clearConfirmDesc: '過去の達成履歴がすべて削除されます。累計ポイントは維持されます。',
    clearConfirmBtn: '消去する',
    exported: '保存済み',
    imported: 'データを復元しました',
    importError: 'ファイルの読み込みに失敗しました',
    historyCleared: '履歴を消去しました',
    languageSection: '言語設定',
    languageLabel: '表示言語',
  },

  // Error boundary
  error: {
    title: 'エラーが発生しました',
    description: 'アプリの表示中に問題が起きました。',
    reload: '再読み込み',
  },
};

export default ja;
