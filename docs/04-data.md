# 5. Data Structures (IndexedDB)

4 stores using Dexie.js.

## 5.1 Missions Store

```
Key: ++id (auto-increment)
Indexes: parentId, depth, interval, weekday
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

## 5.2 History Store

```
Key: ++id (auto-increment)
Indexes: missionId, achievedAt
```

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-increment |
| missionId | number | Source mission ID |
| title | string | Mission name at time of achievement (snapshot) |
| points | number | Points at time of achievement (snapshot) |
| hierarchy | string | Hierarchy breadcrumb (e.g., `"Exercise › Workout › 10 Push-ups"`) |
| achievedAt | string | Achievement datetime |

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
