import fs from 'fs'
import path from 'path'

// Simple CSV parser for two-column or multi-column CSV where first column is Date
function parseCSV(filePath: string): Array<Record<string, string>> {
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => (row[h.trim()] = (cells[i] ?? '').trim()))
    return row
  })
}

function ensureHistoryFile(file: string): any[] {
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true })
  if (!fs.existsSync(file)) return []
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function main() {
  const root = process.cwd()
  const subsCSV = path.join(root, 'data', 'export-youtube', 'Audience size and growth 2025-02-15_2025-10-14', 'Subscribers.csv')
  if (!fs.existsSync(subsCSV)) {
    console.error('Subscribers.csv not found at:', subsCSV)
    process.exit(1)
  }

  const rows = parseCSV(subsCSV)
  // Expect columns: Date,Subscribers
  const historyPath = path.join(root, 'data', 'history', 'youtube.json')
  const history = ensureHistoryFile(historyPath)
  const byDate: Record<string, any> = Object.fromEntries(history.map((h) => [h.date, h]))

  for (const row of rows) {
    const date = row['Date']
    const subs = row['Subscribers']
    if (!date || !subs) continue
    const subscribers = Number(subs)
    if (!Number.isFinite(subscribers)) continue
    if (!byDate[date]) byDate[date] = { date, subscribers }
    else byDate[date].subscribers = subscribers
  }

  const merged = Object.values(byDate).sort((a: any, b: any) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  fs.writeFileSync(historyPath, JSON.stringify(merged, null, 2))
  console.log(`✅ Wrote ${merged.length} entries to ${historyPath}`)
}

if (require.main === module) {
  main()
}



