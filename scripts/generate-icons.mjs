import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICON_DIR = path.join(ROOT, 'public', 'icons');

const svgFile = process.argv[2] || path.join(ROOT, 'public', 'favicon.svg');
const outputPrefix = process.argv[3] || 'icon';
const bgColor = process.argv[4] || '#1E293B';

const svgContent = fs.readFileSync(svgFile, 'utf-8');

const SIZES = [192, 512];

async function generateIcons() {
  const browser = await chromium.launch();

  for (const size of SIZES) {
    for (const [suffix, iconScale] of [['', 0.65], ['-maskable', 0.50]]) {
      const page = await browser.newPage();
      const iconSize = Math.round(size * iconScale);

      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: ${size}px; height: ${size}px;
            background: ${bgColor};
            display: flex; align-items: center; justify-content: center;
          }
          .icon { width: ${iconSize}px; height: ${iconSize}px; }
          .icon svg { width: 100%; height: 100%; }
        </style></head>
        <body>
          <div class="icon">${svgContent}</div>
        </body>
        </html>
      `);

      const outputPath = path.join(ICON_DIR, `${outputPrefix}${suffix}-${size}.png`);
      await page.screenshot({ path: outputPath, omitBackground: false });
      console.log(`Generated: ${outputPath}`);
      await page.close();
    }
  }

  await browser.close();
}

generateIcons().catch(console.error);
