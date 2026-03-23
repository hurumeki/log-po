# 3. Design & Branding

### Design Specification

| Item | Value | Notes |
|------|-------|-------|
| Primary Color | `#4F46E5` → `#A855F7` (Indigo-600 → Purple-500 gradient) | Warm, game-like feel |
| Accent Color | `#F59E0B` (Amber-500) | Gold = points and treasure metaphor |
| Success Color | `#10B981` (Emerald-500) | Green checkmarks for completion |
| Font | Noto Sans JP (400/500/700) | Loaded from Google Fonts CDN |
| Background | `#FFFBF5` (warm off-white) | Warm, welcoming base |
| Text Color | `#1E293B` (slate-800) | — |
| Card Style | White with warm shadow (`shadow-md shadow-slate-200/50`) | No borders, softer feel |
| Interval Badges | Sky (daily), Violet (weekly), Amber (monthly) | Color-coded for quick recognition |
| Favicon / PWA Icon | Checkmark + gold sparkles on `#EEE8FF` lavender bg | 3-stop gradient: `#4338CA` → `#7C3AED` → `#C084FC`, sparkles `#FCD34D` |

### Current Implementation Status

| Item | Status | Notes |
|------|--------|-------|
| Primary Color | **Implemented** | Indigo-to-purple gradient used in header, FAB, nav active state |
| Accent Color | **Implemented** | Amber/gold used for points badges, progress bars, reward cards |
| Success Color | **Implemented** | Emerald-500 used for completion checkmarks and completed card tint |
| Font | **Implemented** | Noto Sans JP + fallbacks (Hiragino, Meiryo, etc.) |
| Card Style | **Implemented** | Shadow-based cards without borders across all screens |
| Interval Badges | **Implemented** | Sky/violet/amber color coding for daily/weekly/monthly |
