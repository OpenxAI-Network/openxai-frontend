# OpenxAI Ecosystem Data – Zero‑Friction Workflow

This folder contains tiny one‑shot importers and a live collector. The intent is: drop CSVs in, run one command, refresh the app. No manual JSON editing.

## TL;DR – What you do each time
1) Drop new exports into `data/export-<platform>/` (CSV only; stays gitignored)
2) Run the importer(s):
```bash
# LinkedIn (CSV: New followers-Table 1.csv)
npx tsx data/import-linkedin-export.ts

# X / Twitter (CSV: account_overview_analytics*.csv)
npx tsx data/import-x-export.ts

# YouTube (optional daily live refresh)
npx tsx data/collect-youtube.ts
```
3) Reload `/ecosystem` – the chart and boxes update automatically from `data/history/*.json` and `data/ecosystem-metrics.json`.

## What gets committed vs ignored
- Committed: `data/history/*.json`, `data/ecosystem-metrics.json`, import/collect scripts, this README
- Ignored: any raw exports in `data/export-*/`, `.env.local` (keys), temp files

## Folder map
```
data/
├─ ecosystem-metrics.json      # Aggregated snapshots used by cards (e.g., YouTube 24h)
├─ history/                    # Canonical, processed, commit‑safe time series (what charts read)
│  ├─ youtube.json
│  ├─ x.json
│  └─ linkedin.json
├─ collect-youtube.ts          # Live YouTube stats (idempotent; skips duplicates)
├─ import-x-export.ts          # Turns X CSV → history/x.json (followers+stats)
├─ import-linkedin-export.ts   # Turns LinkedIn CSV → history/linkedin.json (followers only)
└─ export-*/                   # Raw CSVs you drop in (gitignored)
```

## Platform specifics (concise)
- YouTube
  - Requires `.env.local` (see `data/env-example.txt`).
  - `collect-youtube.ts` writes/updates `history/youtube.json` and `ecosystem-metrics.json`.

- X (Twitter)
  - Provide either `data/export-x/account_overview_analytics-x-yearly-new-followers.csv` or the default `account_overview_analytics.csv`.
  - `import-x-export.ts` builds a chronological series, baselines followers at 0 on first active day, then scales to the latest known total. Output: `history/x.json`.

- LinkedIn
  - Provide `data/export-linkedin/New followers-Table 1.csv` with columns: Date, Sponsored followers, Organic followers, Auto-invited followers, Total followers.
  - `import-linkedin-export.ts` accumulates daily “Total followers”, starts at 0 on the first non‑zero day, outputs `history/linkedin.json`.

## Adding another CSV platform later
1) Create `data/import-<platform>-export.ts`
2) Parse CSV → chronological array
3) Produce `{ platform: '<platform>', data: [{ date: 'YYYY-MM-DD', <metrics...> }] }`
4) Save to `data/history/<platform>.json`
5) Surface via an API route `app/api/<platform>/history/route.ts`
6) Map the dataset in `app/ecosystem/page.tsx` and add a card entry

## CI safety (local)
Before you commit/push, verify the app still builds and lints:
```bash
npm run build
npm run lint
```
If you only changed data (JSON), no code changes are needed; Vercel will render directly from the committed JSON.

## Common pitfalls
- CSV schema mismatch → ensure headers exactly match noted formats.
- Stale browser cache → importers set `no-store` in API routes; hard refresh if needed.
- Data looks flat → ensure importer ran successfully and `history/*.json` updated.

That’s it. Drop CSV → run importer → reload.