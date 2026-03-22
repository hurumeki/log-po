# 1. Project Overview

| Item | Details |
|------|---------|
| Service Name | Log-Po |
| Name Origin | Log (record) + Point |
| Concept | A positive task management app that "records only successes (points), never failures" |
| Platform | PWA (primary target: Android Chrome) |
| Hosting | Netlify (static file delivery) |
| Authentication | None (serverless, no login required) |

### Three Core Pillars
1. **Eliminate stress from "things not done"** — failures and incomplete tasks are never recorded
2. **Quest-like game feel** — enjoy daily tasks as if completing game quests
3. **Reward unlocking** — accumulate points to unlock self-rewards

---

# 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | v19 |
| Build Tool | Vite | v8 |
| Styling | Tailwind CSS | v4 |
| Database | Dexie.js (IndexedDB) | v4 |
| Effects | canvas-confetti | — |
| PWA | vite-plugin-pwa | — |
| Deploy | Netlify | — |

### Build Configuration (vite.config.js)
- Base path: `/log-po/` (configurable via `VITE_BASE_PATH` environment variable)
- PWA: Standalone mode, theme color `#1E293B`
- Icons: 192x192 / 512x512 PNG
