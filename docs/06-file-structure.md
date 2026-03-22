# 7. ファイル構成

```
log-po/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── MissionScreen/
│   │   │   ├── MissionScreen.jsx    # メイン画面（ヘッダー + リスト + FAB）
│   │   │   ├── MissionList.jsx      # ミッション一覧（ルート取得 + 空状態）
│   │   │   ├── MissionItem.jsx      # 個別ミッション（再帰的ツリー描画）
│   │   │   ├── AddMissionModal.jsx  # ミッション追加/編集モーダル
│   │   │   └── PointsHeader.jsx     # 累計ポイントヘッダー
│   │   ├── CalendarScreen/
│   │   │   └── CalendarScreen.jsx   # カレンダー + 達成ログ表示
│   │   ├── RewardsScreen/
│   │   │   ├── RewardsScreen.jsx    # ご褒美リスト画面
│   │   │   └── AddRewardModal.jsx   # ご褒美追加モーダル
│   │   ├── SettingsScreen/
│   │   │   └── SettingsScreen.jsx   # 設定・データ管理画面
│   │   ├── BottomNav.jsx            # ボトムナビゲーション
│   │   └── RewardUnlockModal.jsx    # ご褒美解禁祝福モーダル
│   ├── db/
│   │   └── db.js                    # Dexie DB 定義 + ビジネスロジック
│   ├── utils/
│   │   └── confetti.js              # 紙吹雪エフェクト関数
│   ├── App.jsx                      # ルートコンポーネント
│   ├── main.jsx                     # エントリポイント
│   └── index.css                    # グローバルスタイル + アニメーション
├── index.html
├── vite.config.js
├── package.json
├── netlify.toml
├── CLAUDE.md
└── docs/
    ├── INDEX.md                     # 仕様書目次
    ├── 01-overview.md               # プロジェクト概要・技術スタック
    ├── 02-design.md                 # デザイン・ブランディング
    ├── 03-screens.md                # 画面構成
    ├── 04-data.md                   # データ構造
    ├── 05-logic.md                  # 処理フロー
    ├── 06-file-structure.md         # ファイル構成（本ファイル）
    └── 07-backlog.md                # 未実装機能・課題・更新履歴
```
