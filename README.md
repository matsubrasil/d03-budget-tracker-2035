## Entity relationship

```

UserSettings
currency      string
userId        string PK

Category -----> @@unique([name, userId, type])
name          string
icon          string
type          string
userId        string FK
createdAt     timestamp

Transaction
id            string PK
amount        number
description   string
date          timestamp
userId        string FK ---> Persisted on Clerk - User { id string PK }
type          string
category      string
categoryIcon  string
createdAt     timestamp
updatedAt     timestamp

MonthHistory
userId        string FK
day           int
month         int
year          int
income        number
expense       number

YearHistory
userId         string FK
month          int
year           int
income         number
expense        number
```
