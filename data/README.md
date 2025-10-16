# OpenxAI Ecosystem Data Collection

Scripts to collect and manage social media data for the ecosystem dashboard.

## Quick Start

### YouTube (Live Data)
```bash
# Setup environment
cp data/env-example.txt .env.local
# Edit .env.local with your YouTube API key and channel ID

# Collect data
npx tsx data/collect-youtube.ts
```

### Historical Data Import
```bash
# Import X (Twitter) data
npx tsx data/import-x-export.ts

# Import LinkedIn data  
npx tsx data/import-linkedin-export.ts
```

## Data Structure

### Committed Files
- `ecosystem-metrics.json` - Main metrics file
- `history/*.json` - Processed historical data
- `backups/*.json` - Timestamped backups

### Gitignored Files
- `export-*/` - Raw CSV exports from platforms
- `.env.local` - API keys and secrets

## Platforms

| Platform | Status | Data Source | Update Method |
|----------|--------|-------------|---------------|
| YouTube | ✅ Live | API | Daily script |
| X (Twitter) | ✅ Historical | CSV import | Manual |
| LinkedIn | 🔄 Mock | CSV import | Manual |
| Others | 📋 Placeholder | Static | Manual |

## File Structure
```
data/
├── ecosystem-metrics.json      # Main metrics
├── history/                   # Historical data
│   ├── youtube.json
│   ├── x.json
│   └── linkedin.json
├── backups/                   # Auto backups
├── collect-youtube.ts         # Live collection
├── import-*-export.ts         # CSV importers
└── export-*/                  # Raw CSVs (gitignored)
```

## Git Workflow
- ✅ **Commit**: Processed JSON files, scripts, docs
- ❌ **Ignore**: Raw CSVs, API keys, temp files

## Troubleshooting
- **YouTube API**: Verify API key and channel ID in `.env.local`
- **Import errors**: Check CSV format matches expected structure
- **Chart issues**: Verify JSON data structure in `history/` files