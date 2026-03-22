# 8. Unimplemented Features

Features described in the spec but not yet implemented.

| Feature | Priority | Notes |
|---------|----------|-------|
| Batch notification scheduling | Medium | Schedule several days' worth of notifications at app startup (Notification Triggers API) |
| Mission header progress bar | Low | Visual bar showing progress to next reward |
| Sound effects (SE) | Low | "Pocharin!" sound on task completion |
| Fanfare sound | Low | Sound effect on reward unlock |
| Calendar daily point totals | Low | Display point totals alongside stamps |
| Weekly reference day change as separate mission | Low | To prevent history inconsistency |
| Detail memo UI | Low | Memo field exists in DB schema but has no input in AddMissionModal |

---

# 9. Known UI Issues

## 9.1 Desktop Display
- Due to `max-w-md` (448px) constraint, large screens have significant left/right margins

## 9.2 Fonts
- Noto Sans JP is loaded from Google Fonts CDN, so it falls back to system fonts when offline
- Self-hosting fonts would be preferable for a PWA

## 9.3 Settings Screen
- Notification settings are conditionally shown only when the browser supports Notification API + Service Worker

---

# 10. Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-22 | v1.0.3 | Fixed modal z-index, enlarged touch targets, greyed-out completed badges, added delete confirmation dialog |
| 2026-03-22 | v1.0.2 | Safe Area support (header/BottomNav), unified max-width, added BottomNav tap feedback |
| 2026-03-22 | v1.0.1 | UI review fixes: FAB button desktop placement, Settings screen button style improvements |
| 2026-03-22 | v1.0.0 | Initial version. Integrated spec and implementation documentation |
