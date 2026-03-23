# 5. Data Structures (IndexedDB)

4 stores using Dexie.js.

## 5.1 Missions Store

```
Key: ++id (auto-increment)
Indexes: parentId, depth, interval, weekday, sortOrder
```

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-increment |
| parentId | number \| null | Parent mission ID |
| depth | number | Hierarchy depth (0=category, 1=subcategory, 2=task) |
| title | string | Mission name |
| memo | string | Detail memo |
| interval | string | `'daily'` / `'weekly'` / `'monthly'` |
| weekday | number \| null | Weekly reference day (0=Sunday ~ 6=Saturday) |
| points | number | Points earned |
| completedAt | string \| null | Completion datetime (ISO 8601) |
| createdAt | string | Creation datetime |
| sortOrder | number | Sort order within siblings (lower = higher position) |

## 5.2 History Store

```
Key: ++id (auto-increment)
Indexes: missionId, achievedAt
```

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-increment |
| missionId | number | Source mission ID |
| snapshot | object | Snapshot of mission data at time of achievement (see below) |
| achievedAt | string | Achievement datetime |

**snapshot object:**

| Field | Type | Description |
|-------|------|-------------|
| title | string | Mission name at time of achievement |
| points | number | Points at time of achievement |
| hierarchy | string[] | Hierarchy breadcrumb as array (e.g., `["Exercise", "Workout", "10 Push-ups"]`). Displayed joined with ` › ` |
| interval | string | Mission interval at time of achievement (`'daily'` / `'weekly'` / `'monthly'`) |

> **Note:** History entries are preserved even when the source mission is deleted. This ensures calendar records remain intact.

## 5.3 Rewards Store

```
Key: ++id (auto-increment)
Indexes: requiredPoints
```

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-increment |
| title | string | Reward name |
| requiredPoints | number | Required points |
| unlockedAt | string \| null | Unlock datetime (null if not yet unlocked) |

## 5.4 UserData Store

```
Key: key (string key)
```

| Key | Value Type | Description |
|-----|-----------|-------------|
| `totalPoints` | number | Cumulative points (never consumed) |
| `lastResetCheck` | string | Last reset check datetime |
| `notificationEnabled` | boolean | Whether daily reminder notification is enabled (default: `false`) |
| `notificationTime` | string | Notification time in `HH:MM` format (default: `'21:00'`) |
