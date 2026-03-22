/**
 * UI Review Screenshot Capture
 *
 * 全画面のスクリーンショットを撮影し、UIレビューの材料を生成する。
 *
 * 使い方:
 *   npm run build && npx playwright test e2e/ui-review.spec.js
 *
 * スクリーンショットは e2e/screenshots/ に保存される。
 */
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'e2e/screenshots';

/** ヘルパー: スクリーンショットを連番付きで保存 */
let screenshotIndex = 0;
function shot(page, name) {
  screenshotIndex++;
  const num = String(screenshotIndex).padStart(2, '0');
  return page.screenshot({
    path: `${SCREENSHOT_DIR}/${num}_${name}.png`,
    fullPage: false,
  });
}

/** FABボタン(+)をクリック */
async function clickFAB(page) {
  // FABはpointer-events-noneラッパー内にあるのでforceクリック
  const fab = page.locator('button.rounded-full:has-text("+")').first();
  await fab.click({ force: true });
  await page.waitForTimeout(300);
}

test.describe('UI Review Screenshots', () => {
  test.beforeAll(() => {
    screenshotIndex = 0;
    // 既存スクリーンショットを削除
    const dir = path.resolve(SCREENSHOT_DIR);
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        if (file.endsWith('.png')) fs.unlinkSync(path.join(dir, file));
      }
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  test('capture all screens for review', async ({ page }) => {
    // confirmダイアログを自動承認
    page.on('dialog', dialog => dialog.accept());

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // --- ミッション画面 (空状態) ---
    await shot(page, 'mission_empty');

    // --- ミッション追加モーダル ---
    await clickFAB(page);
    await shot(page, 'add_mission_modal_empty');

    // カテゴリを追加
    await page.fill('input[placeholder*="腕立て"]', '運動');
    await shot(page, 'add_mission_modal_filled');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    // サブカテゴリを追加
    await clickFAB(page);
    await page.fill('input[placeholder*="腕立て"]', '筋トレ');
    const parentSelect = page.locator('select');
    if (await parentSelect.isVisible()) {
      await parentSelect.selectOption({ index: 1 });
    }
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    // リーフタスクを追加
    await clickFAB(page);
    await page.fill('input[placeholder*="腕立て"]', '腕立て10回');
    const parentSelect2 = page.locator('select');
    if (await parentSelect2.isVisible()) {
      const options = await parentSelect2.locator('option').all();
      await parentSelect2.selectOption({ index: Math.min(2, options.length - 1) });
    }
    await shot(page, 'add_mission_modal_leaf');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    // --- ミッション画面 (データあり) ---
    await shot(page, 'mission_with_data');

    // --- タスク完了 ---
    const checkbox = page.locator('button.rounded-full.border-2').first();
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(500);
      await shot(page, 'mission_completed');
    }

    // --- メニュー表示 ---
    const menuBtn = page.locator('button:has-text("⋯")').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(200);
      await shot(page, 'mission_menu_open');
      // メニューを閉じる (画面外クリック)
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }

    // --- カレンダー画面 ---
    const calendarTab = page.locator('nav button').nth(1);
    await calendarTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'calendar');

    // 日付をタップ
    const dayCell = page.locator('button.rounded-full.bg-blue-600').first();
    if (await dayCell.isVisible()) {
      await dayCell.click();
      await page.waitForTimeout(200);
      await shot(page, 'calendar_date_selected');
    }

    // --- ご褒美画面 ---
    const rewardsTab = page.locator('nav button').nth(2);
    await rewardsTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'rewards_empty');

    // ご褒美追加
    await clickFAB(page);
    await shot(page, 'add_reward_modal');

    await page.fill('input[placeholder*="ケーキ"]', 'ケーキを買う');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    await shot(page, 'rewards_with_data');

    // --- 設定画面 ---
    const settingsTab = page.locator('nav button').nth(3);
    await settingsTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'settings');
  });
});
