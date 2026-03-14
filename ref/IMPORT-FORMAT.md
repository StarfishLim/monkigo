# Importing monkeys from Excel

## 1. Prepare your Excel

Use one row per **monkey**. Each row must have a zone; zones are inferred from the data (first occurrence of a zone sets its name and description).

### Required columns (header row)

| Column            | Description |
|-------------------|-------------|
| `zone_id`         | Unique zone id (e.g. `exit-4`, `platform`). Use lowercase, hyphens, no spaces. |
| `zone_name`       | Display name for the zone (e.g. Exit 4, Platform). |
| `monkey_number`   | Number of this monkey (integer). |
| `monkey_name`     | Display name for the monkey. |
| `artwork_filename`| Image file name only (e.g. `01-escalator-explorer.svg`). |
| `clue`            | Short clue shown on the monkey card. |
| `question`        | Question shown in the quiz. |
| `option_a`        | First answer option. |
| `option_b`        | Second answer option. |
| `option_c`        | Third answer option. |
| `correct_option`  | Which option is correct: **A**, **B**, or **C**. |

### Optional columns

| Column             | Description |
|--------------------|-------------|
| `zone_description` | Zone description (optional). |
| `zone_icon`        | Emoji for the zone (default 🚇). |
| `emoji_icon`       | Emoji for the monkey (default 🐵). |

## 2. Put images in the app

Place all artwork files under:

```text
public/artwork/
```

The `artwork_filename` in your CSV must match the file name exactly (e.g. `01-escalator-explorer.svg`).

## 3. Export Excel to CSV

- In Excel: **File → Save As** and choose **CSV (Comma delimited) (*.csv)**.
- Save the file as **`ref/monkeys.csv`** (or another path and pass it to the script).

## 4. Run the import

From the project root:

```bash
npm run import-monkeys
```

Or with a custom CSV path:

```bash
node scripts/import-monkeys-from-csv.js path/to/your/monkeys.csv
```

This overwrites **`lib/mockData.generated.ts`** with zones and monkeys from your CSV. The app uses this file for zone and monkey data.

## 5. Check the app

Run the app and open the zones page to confirm zones and monkeys match your Excel and that artwork images load correctly.

```bash
npm run dev
```

---

**Note:** The file **`ref/MonkeyHunt_FINAL copy.csv`** is a different layout (location/distribution). To use that data you would need a separate mapping or to add the required columns (monkey name, clue, question, option_a/b/c, correct_option, artwork_filename) to your Excel and export as above.
