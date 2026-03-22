# Environment

- Running on **Claude Code on the web**
- All work must be completed in the cloud
- No local environment (user's PC) operations or guidance needed

# Language Rules

- **Specifications (`docs/`), code comments, and commit messages must be written in English**
- UI-facing strings (user-visible text in the app) remain in Japanese

# Specifications

- Specs are stored in the `docs/` folder, split into multiple files
- **Before implementing or modifying features, read `docs/INDEX.md` (index) first and refer only to the relevant files**
  - Do not load all files at once (to save context)
- Implement according to the specs
- **If specs change or are added due to implementation, update the relevant spec files at the same time**
  - Include spec updates in the same commit as the implementation changes

# UI Review

- Command: `npm run test:ui`
- Screenshots are saved to `e2e/screenshots/`
- See `e2e/UI_REVIEW_PROMPT.md` for detailed steps and review criteria

# Playwright Rules

- **Do not check versions or reinstall** (automatically handled by SessionStart hook)
- Always use **`npx playwright test`** (global execution is prohibited)
- Use **Chromium only**
