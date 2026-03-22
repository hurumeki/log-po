# 5. データ構造（IndexedDB）

Dexie.js を使用した4つのストア構成。

## 5.1 Missions ストア

```
キー: ++id (自動採番)
インデックス: parentId, depth, interval, weekday
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | number | 自動採番 |
| parentId | number \| null | 親ミッションの ID |
| depth | number | 階層の深さ (0=カテゴリ, 1=サブカテゴリ, 2=タスク) |
| title | string | ミッション名 |
| memo | string | 詳細メモ |
| interval | string | `'daily'` / `'weekly'` / `'monthly'` |
| weekday | number \| null | 週次の基準曜日 (0=日曜〜6=土曜) |
| points | number | 獲得ポイント |
| completedAt | string \| null | 完了日時 (ISO 8601) |
| createdAt | string | 作成日時 |

## 5.2 History ストア

```
キー: ++id (自動採番)
インデックス: missionId, achievedAt
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | number | 自動採番 |
| missionId | number | 元ミッション ID |
| title | string | 達成時のミッション名（スナップショット） |
| points | number | 達成時のポイント（スナップショット） |
| hierarchy | string | 階層パンくず（例: `"運動 › 筋トレ › 腕立て10回"`） |
| achievedAt | string | 達成日時 |

## 5.3 Rewards ストア

```
キー: ++id (自動採番)
インデックス: requiredPoints
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | number | 自動採番 |
| title | string | 報酬名 |
| requiredPoints | number | 必要ポイント |
| unlockedAt | string \| null | 解禁日時（未解禁は null） |

## 5.4 UserData ストア

```
キー: key (文字列キー)
```

| キー | 値の型 | 説明 |
|------|--------|------|
| `totalPoints` | number | 累計ポイント（消費されない） |
| `lastResetCheck` | string | 最終リセットチェック日時 |
