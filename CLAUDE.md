# 動作環境

- **Claude Code on the web** 上で動作している
- 原則、すべての作業はクラウド上で完結させること
- ローカル環境（ユーザーのPC）への操作や案内は不要

# UIレビュー手順

UIの見た目を確認・改善するには、以下の手順を実行する:

```bash
npm run build && npx playwright test e2e/ui-review.spec.js
```

1. `e2e/screenshots/` にスクリーンショットが保存される
2. 全画像を確認し、P0〜P3の優先度でUIの問題を洗い出す
3. P0（操作不能）〜P2（レイアウト崩れ）を修正する

詳細なプロンプトテンプレートは `e2e/UI_REVIEW_PROMPT.md` を参照。

### レビュー観点
- **P0**: ボタンが隠れる、操作不能（z-index、overflow）
- **P1**: タッチターゲット不足（44x44px未満）、コントラスト不足
- **P2**: 完了状態のフィードバック不足、レイアウト崩れ
- **P3**: スペーシング、フォント一貫性

## Playwright 利用ルール

- **ブラウザとPlaywrightのバージョン確認・再インストールは行わないこと**
  - SessionStart フックで `npx playwright install --with-deps chromium` が自動実行されるため、手動での確認・インストールは不要
- Playwright の実行は **必ずプロジェクトルートから `npx playwright test`** を使うこと（グローバルインストールや `playwright` コマンド直接実行は禁止）
- `npx playwright install` を手動で実行しないこと（SessionStart フックに任せる）
- ブラウザは **Chromium のみ** 使用する（Firefox・WebKit は不要）
