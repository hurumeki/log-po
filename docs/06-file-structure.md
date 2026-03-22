# 7. File Structure

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
│   │   │   ├── MissionScreen.jsx    # Main screen (header + list + FAB)
│   │   │   ├── MissionList.jsx      # Mission list (root fetch + empty state)
│   │   │   ├── MissionItem.jsx      # Individual mission (recursive tree rendering)
│   │   │   ├── AddMissionModal.jsx  # Mission add/edit modal
│   │   │   ├── ContextMenu.jsx     # Per-item context menu (edit/delete)
│   │   │   └── PointsHeader.jsx     # Total points header
│   │   ├── CalendarScreen/
│   │   │   └── CalendarScreen.jsx   # Calendar + achievement log display
│   │   ├── RewardsScreen/
│   │   │   ├── RewardsScreen.jsx    # Rewards list screen
│   │   │   └── AddRewardModal.jsx   # Reward add modal
│   │   ├── SettingsScreen/
│   │   │   └── SettingsScreen.jsx   # Settings & data management screen
│   │   ├── BottomNav.jsx            # Bottom navigation
│   │   ├── ErrorBoundary.jsx        # Error boundary with reload button
│   │   └── RewardUnlockModal.jsx    # Reward unlock celebration modal
│   ├── db/
│   │   └── db.js                    # Dexie DB definition + business logic
│   ├── utils/
│   │   ├── confetti.js              # Confetti effect function
│   │   └── notification.js          # Notification scheduling & permission helpers
│   ├── constants.js                 # Shared constants (DEPTH enum)
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles + animations
├── index.html
├── vite.config.js
├── package.json
├── netlify.toml
├── CLAUDE.md
└── docs/
    ├── INDEX.md                     # Specification index
    ├── 01-overview.md               # Project overview & tech stack
    ├── 02-design.md                 # Design & branding
    ├── 03-screens.md                # Screen layout
    ├── 04-data.md                   # Data structures
    ├── 05-logic.md                  # Processing flows
    ├── 06-file-structure.md         # File structure (this file)
    └── 07-backlog.md                # Unimplemented features, issues, changelog
```
