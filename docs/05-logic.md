# 6. Core Processing Flows

## 6.1 Mission Completion Flow

```
User taps a task
  → Update completedAt to current datetime
  → Add snapshot to History
  → Add points to totalPoints
  → Search unlocked Rewards where requiredPoints <= totalPoints
  → If found → set unlockedAt → confetti animation + celebration modal
  → Display +X pt!! popup in UI
```

## 6.2 Reset Check Flow

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

## 6.3 Data Backup/Restore Flow

```
Export:
  Compile all store data into a JSON object
  → Blob → download (logpo-backup-YYYY-MM-DD.json)

Import:
  File selection → JSON parse
  → Clear all stores → insert data
  → Page reload to apply
```
