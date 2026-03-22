# 6. Core Processing Flows

## 6.1 Mission Completion Flow

```
User taps an uncompleted task
  → Build hierarchy path (walk up parentId chain)
  → Add snapshot to History (title, points, hierarchy array, interval)
  → Update completedAt to current datetime
  → Add points to totalPoints
  → Search unlocked Rewards where requiredPoints <= totalPoints
  → If found → set unlockedAt → confetti animation + celebration modal
  → Display +X pt!! popup in UI
  → Smart cancel: if all daily leaf missions are completed and notifications
    are enabled, cancel the scheduled notification
```

## 6.2 Mission Uncomplete (Undo) Flow

```
User taps a completed task
  → Clear completedAt to null
  → Subtract points from totalPoints
  → Delete the most recent history entry for this mission
  → If notifications are enabled, reschedule notification
    (since there are now incomplete tasks)
```

## 6.3 Reset Check Flow

```
On app startup (App mount)
  → Execute runResetCheck()
  → Fetch all missions
  → Compare each mission's completedAt with interval
    → daily: completedAt date < today → reset
    → weekly: completedAt week start < this week start → reset
    → monthly: completedAt month < this month → reset
  → Clear completedAt to null for matching missions
```

## 6.4 Data Backup/Restore Flow

```
Export:
  Compile all store data into a JSON object
  → Blob → download (logpo-backup-YYYY-MM-DD.json)

Import:
  File selection → JSON parse
  → Validate data structure (each table must be an array)
  → Clear all stores → bulk insert data
  → Show success toast message (no page reload)
```

## 6.5 Mission Delete Flow

```
User deletes a mission (via context menu ⋯ → Delete)
  → Show confirmation dialog
    → Leaf task: simple confirm
    → Category/Subcategory: show descendant task count in confirm message
  → Recursively delete all descendant missions
  → History entries are NOT deleted (preserved for calendar records)
```

## 6.6 Notification Scheduling Flow

```
On app startup (after reset check)
  → If Notification API supported and enabled and permission granted
    → Schedule notification at configured time

At scheduled time:
  → Count incomplete daily leaf missions
  → If any incomplete → show notification via Service Worker
    (body includes up to 2 mission names + count)

Smart cancel (on mission completion):
  → After completing a task, check if all daily leaf missions are done
  → If yes and notifications enabled → cancel scheduled notification

On uncomplete (undo):
  → Reschedule notification (since tasks are now incomplete again)
```
