# cron-parser

Parses a cron expression and prints out exactly when it will run — one field per line, values space-separated.

```
$ npm run dev -- "*/15 0 1,15 * 1-5 /usr/bin/find"

minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```

---

## Getting started

```bash
npm install
npm run dev -- "*/15 0 1,15 * 1-5 /usr/bin/find"
```

That's it. No config needed.

---

## Running tests

```bash
npm test
```

Coverage report:

```bash
npm run test:coverage
```

---

## Building for production

```bash
npm run build
node dist/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

---

## What's supported

Standard 5-field cron — minute, hour, day of month, month, day of week — plus a command.

| syntax     | example   | what it does                |
| ---------- | --------- | --------------------------- |
| `*`        | `*`       | every value                 |
| exact      | `5`       | just that value             |
| range      | `1-5`     | 1 through 5                 |
| step       | `*/15`    | every 15th starting from 0  |
| range+step | `0-30/10` | every 10th between 0 and 30 |
| list       | `1,15`    | 1 and 15                    |
| mixed      | `1,5-7`   | 1, 5, 6, 7                  |

Field ranges:

| field        | range |
| ------------ | ----- |
| minute       | 0–59  |
| hour         | 0–23  |
| day of month | 1–31  |
| month        | 1–12  |
| day of week  | 0–6   |

Special strings like `@yearly` or `@reboot` are not supported.

---

## Requirements

- Node.js 18+
- npm 9+

---

## Project structure

```
src/
  index.ts              entry point, reads CLI arg and prints output
  CronParser.ts         splits the expression into fields + command
  CronFormatter.ts      formats the parsed result into the table
  types/
    FieldDefinition.ts  field names and their valid ranges
    FieldParser.ts      interface that every parser implements
  fields/
    CronFieldParser.ts  figures out which parser to use for a given token
    parsers/
      WildcardParser.ts
      StepParser.ts
      RangeParser.ts
      ListParser.ts
      ValueParser.ts
  utils/
    range.ts            simple inclusive range helper
```

Each parser handles exactly one syntax form and nothing else. `CronFieldParser` just asks each one `canHandle()` in order and delegates to the first one that says yes. `ListParser` is the only interesting one — it splits on commas and calls back into `CronFieldParser` for each segment, so mixed lists like `1,5-7,*/10` work automatically.
