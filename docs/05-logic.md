# 6. 主要な処理フロー

## 6.1 ミッション達成フロー

```
ユーザーがタスクをタップ
  → completedAt を現在日時に更新
  → History にスナップショットを追加
  → totalPoints にポイントを加算
  → 未解禁の Reward の中で requiredPoints <= totalPoints のものを検索
  → 該当あり → unlockedAt を設定 → 紙吹雪演出 + 祝福モーダル表示
  → UI に +X pt!! ポップアップ表示
```

## 6.2 リセットチェックフロー

```
アプリ起動時 (App mount)
  → runResetCheck() 実行
  → 全ミッションを取得
  → 各ミッションの completedAt と interval を比較
    → daily: completedAt の日 < 今日 → リセット
    → weekly: completedAt の週起算日 < 今週起算日 → リセット
    → monthly: completedAt の月 < 今月 → リセット
  → 該当ミッションの completedAt を null にクリア
```

## 6.3 データバックアップ/復元フロー

```
エクスポート:
  全ストアのデータを JSON オブジェクトにまとめ
  → Blob → ダウンロード (logpo-backup-YYYY-MM-DD.json)

インポート:
  ファイル選択 → JSON パース
  → 全ストアをクリア → データ挿入
  → ページリロードで反映
```
