# 4. Screen Layout

Screens are switched via bottom navigation with 4 tabs (`max-w-md` = 448px, constrained to mobile width).

---

## 4.1 Mission Screen (Home)

**Specification:**
- Display total points prominently in the header
- Progress bar to next reward
- Category-based accordion with 3-level hierarchy
- Tap to check → point earning animation
- FAB (+) button for adding new missions

**Implementation Status:**

| Feature | Status | Details |
|---------|--------|---------|
| Total points display | **Implemented** | Shown as `🪙 X pt` in blue fixed header |
| Next reward progress | **Implemented** | Text display: "Next reward: X pt remaining" |
| Progress bar | **Not implemented** | Spec calls for a bar, only text is shown |
| 3-level accordion | **Implemented** | depth 0 = category / depth 1 = subcategory / depth 2 = task |
| Completion animation | **Implemented** | `+X pt!!` popup + check bounce animation |
| Sound effects (SE) | **Not implemented** | Spec mentions a "pocharin!" sound |
| FAB button | **Implemented** | Blue circular button at bottom-right |

### Mission Settings

| Item | Spec | Status |
|------|------|--------|
| Title | Required | **Implemented** |
| Detail memo | Optional | **Implemented** |
| Interval (daily/weekly/monthly) | Required | **Implemented** |
| Weekly reference day | Only when weekly is selected | **Implemented** |
| Points | Default 10pt | **Implemented** |
| Parent category | Only on creation | **Implemented** (selectable from existing missions with depth < 2) |

### Reset (Recycle) Rules

| Interval | Rule | Status |
|----------|------|--------|
| Daily | Reset at midnight every day | **Implemented** |
| Weekly | Reset based on specified weekday (ISO week calculation) | **Implemented** |
| Monthly | Reset on the 1st of every month | **Implemented** |

Reset is executed by `runResetCheck()` at app startup.

---

## 4.2 Calendar Screen (History)

**Specification:**
- Display achievement stamps on a monthly calendar
- Tap a date to show achievement log (snapshot) for that day
- "Failures" are never recorded — this is a positive space to see how much you've accomplished

**Implementation Status:**

| Feature | Status | Details |
|---------|--------|---------|
| Monthly calendar | **Implemented** | With prev/next month navigation |
| Weekday coloring | **Implemented** | Sunday = red, Saturday = blue |
| Today highlight | **Implemented** | Blue background + white text |
| Achievement stamp | **Implemented** | Displayed as 💮 emoji |
| Total points display | **Not implemented** | Spec also envisions showing daily point totals alongside stamps |
| Date tap → details | **Implemented** | Achievement list below calendar (hierarchy breadcrumb + points) |
| Snapshot storage | **Implemented** | Copies mission name, hierarchy, and points at time of achievement |

---

## 4.3 Rewards Screen

**Specification:**
- Display total points
- List reward cards sorted by required points
- Visual distinction between achieved (GET!) and locked (🔒)
- FAB for adding new rewards

**Implementation Status:**

| Feature | Status | Details |
|---------|--------|---------|
| Total points display | **Implemented** | Badge showing `Owned: X pt` in header right |
| Rewards list | **Implemented** | Sorted ascending by `requiredPoints` |
| Achieved display | **Implemented** | `GET! 🎉` + unlock date + yellow background |
| Locked display | **Implemented** | 🔒 + progress bar + percentage + remaining points |
| Add reward | **Implemented** | Yellow FAB button → modal |
| Delete reward | **Implemented** | × button on card top-right |
| Edit reward | **Not implemented** | Not in spec; only delete is supported |

---

## 4.4 Settings Screen

**Specification:**
- Notification settings
- Data backup / restore
- History clear

**Implementation Status:**

| Feature | Status | Details |
|---------|--------|---------|
| Data export (JSON) | **Implemented** | Downloads as `logpo-backup-YYYY-MM-DD.json`. Blue button + download icon |
| Data import | **Implemented** | Reads JSON file to restore. Gray button + upload icon |
| History clear | **Implemented** | With confirmation dialog. Total points are preserved. Red-outlined button + trash icon |
| Notification settings | **Not implemented** | Toggle switch and notification time settings are not supported |

---

## 4.5 Common Modals & Effects

| Feature | Status | Details |
|---------|--------|---------|
| Mission add/edit modal | **Implemented** | Bottom sheet style |
| Reward add modal | **Implemented** | Bottom sheet style |
| Completion point animation | **Implemented** | `+X pt!!` popup (CSS animation 0.9s) |
| Check bounce | **Implemented** | 0.4s bounce animation |
| Reward unlock animation | **Implemented** | Full-screen modal + canvas-confetti |
| Sound effects (SE) | **Not implemented** | Spec's "pocharin!" sound not supported |
| Fanfare animation | **Not implemented** | Spec's "fanfare" sound not supported |
