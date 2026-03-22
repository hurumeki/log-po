/**
 * UI Review Screenshot Capture
 *
 * Captures screenshots of all screens for UI review.
 *
 * Usage:
 *   npm run build && npx playwright test e2e/ui-review.spec.js
 *
 * Screenshots are saved to e2e/screenshots/.
 */
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'e2e/screenshots';

/** Helper: save screenshot with sequential numbering */
let screenshotIndex = 0;
function shot(page, name) {
  screenshotIndex++;
  const num = String(screenshotIndex).padStart(2, '0');
  return page.screenshot({
    path: `${SCREENSHOT_DIR}/${num}_${name}.png`,
    fullPage: false,
  });
}

/** Click FAB (+) button */
async function clickFAB(page) {
  const fab = page.locator('button.rounded-full:has-text("+")').first();
  await fab.click({ force: true });
  await page.waitForTimeout(300);
}

/**
 * Add a mission via the modal UI.
 * @param {Object} opts
 * @param {string} opts.task - Task name (required)
 * @param {string} [opts.category] - Category name
 * @param {string} [opts.subcategory] - Subcategory name
 * @param {string} [opts.interval] - 'daily' | 'weekly' | 'monthly'
 * @param {number} [opts.weekday] - 0-6 for weekly interval
 * @param {number} [opts.points] - Point value
 */
async function addMission(page, { task, category, subcategory, interval, weekday, points }) {
  await clickFAB(page);

  // Fill category
  if (category) {
    const categoryInput = page.locator('input[placeholder*="運動・健康"]');
    await categoryInput.fill(category);
    // Dismiss dropdown: blur input and wait for 200ms timeout
    await categoryInput.press('Tab');
    await page.waitForTimeout(300);
  }

  // Fill subcategory (field appears when category is filled)
  if (subcategory) {
    const subcategoryInput = page.locator('input[placeholder*="新しい習慣"]');
    await subcategoryInput.fill(subcategory);
    await subcategoryInput.press('Tab');
    await page.waitForTimeout(300);
  }

  // Fill task name
  await page.locator('input[placeholder*="腕立て"]').fill(task);

  // Set interval
  if (interval) {
    await page.locator('select').selectOption(interval);
    await page.waitForTimeout(100);
  }

  // Set weekday for weekly interval
  if (interval === 'weekly' && weekday != null) {
    const weekdayButtons = page.locator('.flex.gap-1 button');
    await weekdayButtons.nth(weekday).click();
  }

  // Set points
  if (points != null) {
    const pointsInput = page.locator('input[type="number"]');
    await pointsInput.fill(String(points));
  }

  // Submit
  await page.click('button[type="submit"]');
  await page.waitForTimeout(400);
}

test.describe('UI Review Screenshots', () => {
  test.beforeAll(() => {
    screenshotIndex = 0;
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
    page.on('dialog', dialog => dialog.accept());

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // --- Mission screen (empty) ---
    await shot(page, 'mission_empty');

    // --- Add mission modal (empty form) ---
    await clickFAB(page);
    await shot(page, 'add_mission_modal_empty');

    // Show filled modal: category + subcategory + task
    const categoryInput = page.locator('input[placeholder*="運動・健康"]');
    await categoryInput.fill('💪 運動・健康');
    await categoryInput.press('Tab');
    await page.waitForTimeout(300);
    const subcategoryInput = page.locator('input[placeholder*="新しい習慣"]');
    await subcategoryInput.fill('筋トレ');
    await subcategoryInput.press('Tab');
    await page.waitForTimeout(300);
    await page.locator('input[placeholder*="腕立て"]').fill('腕立て10回');
    await shot(page, 'add_mission_modal_filled');

    // Submit first mission
    await page.click('button[type="submit"]');
    await page.waitForTimeout(400);

    // --- Build hierarchy with multiple missions ---

    // Category 1 > Subcategory > Leaf 2
    await addMission(page, {
      task: 'スクワット20回', category: '💪 運動・健康', subcategory: '筋トレ',
      interval: 'daily', points: 15,
    });

    // Category 1 > Direct leaf (no subcategory)
    await addMission(page, {
      task: 'ストレッチ5分', category: '💪 運動・健康',
      interval: 'daily', points: 5,
    });

    // Category 2 > Leaf (weekly)
    await addMission(page, {
      task: '読書30分', category: '📚 学習',
      interval: 'weekly', weekday: 1, points: 20,
    });

    // Category 2 > Leaf (daily)
    await addMission(page, {
      task: '英単語10個', category: '📚 学習',
      interval: 'daily', points: 10,
    });

    // --- Mission screen with full hierarchy ---
    // Patterns visible:
    //   Category header (depth 0) with expand/collapse
    //   Subcategory header (depth 1) with blue left border
    //   Leaf task (depth 2) under subcategory
    //   Leaf task (depth 1) directly under category
    //   Multiple categories
    //   Different interval labels (daily, weekly)
    await shot(page, 'mission_hierarchy');

    // --- Complete a task ---
    const checkbox = page.locator('button.rounded-full.border-2').first();
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(500);
      await shot(page, 'mission_completed');
    }

    // --- Collapse a category ---
    const categoryHeader = page.locator('[role="button"]:has-text("運動・健康")');
    if (await categoryHeader.isVisible()) {
      await categoryHeader.click();
      await page.waitForTimeout(300);
      await shot(page, 'mission_collapsed');

      // Expand again for later screenshots
      await categoryHeader.click();
      await page.waitForTimeout(300);
    }

    // --- Context menu on a task ---
    const menuBtn = page.locator('button:has-text("⋯")').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(200);
      await shot(page, 'mission_menu_open');
      // Close menu by clicking backdrop
      await page.locator('.fixed.inset-0').first().click({ force: true });
      await page.waitForTimeout(200);
    }

    // --- Calendar screen ---
    const calendarTab = page.locator('nav button').nth(1);
    await calendarTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'calendar');

    // Tap a day with activity
    const dayCell = page.locator('button.rounded-full.bg-blue-600').first();
    if (await dayCell.isVisible()) {
      await dayCell.click();
      await page.waitForTimeout(200);
      await shot(page, 'calendar_date_selected');
    }

    // --- Rewards screen (empty) ---
    const rewardsTab = page.locator('nav button').nth(2);
    await rewardsTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'rewards_empty');

    // Add reward
    await clickFAB(page);
    await shot(page, 'add_reward_modal');

    await page.fill('input[placeholder*="ケーキ"]', 'ケーキを買う');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    await shot(page, 'rewards_with_data');

    // --- Settings screen ---
    const settingsTab = page.locator('nav button').nth(3);
    await settingsTab.click();
    await page.waitForTimeout(500);
    await shot(page, 'settings');
  });
});
