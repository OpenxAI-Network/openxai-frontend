const fs = require('fs')
const path = require('path')

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/)
  if (lines.length <= 1) return []
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    const getNum = (v) => {
      if (v === undefined) return 0
      const t = String(v).trim()
      if (t.toUpperCase() === 'NAN' || t === '') return 0
      const n = Number(t)
      return Number.isFinite(n) ? n : 0
    }
    rows.push({
      date: (cols[0] || '').replaceAll('/', '-'),
      videoViews: getNum(cols[1]),
      reachedAudience: ((cols[2] || '').trim().toUpperCase() === 'NAN' ? null : getNum(cols[2])),
      profileViews: getNum(cols[3]),
      likes: getNum(cols[4]),
      shares: getNum(cols[5]),
      comments: getNum(cols[6]),
      phoneClicks: getNum(cols[7]),
      leads: getNum(cols[8]),
      netGrowth: getNum(cols[9]),
      newFollowers: getNum(cols[10]),
      lostFollowers: getNum(cols[11]),
    })
  }
  return rows
}

function toHistory(rows) {
  let start = 0
  for (; start < rows.length; start++) {
    const r = rows[start]
    const active = (r.videoViews || r.profileViews || r.likes || r.shares || r.comments || r.newFollowers || r.lostFollowers)
    if (active) break
  }
  const trimmed = rows.slice(start)
  const history = []
  let followers = 0
  for (const r of trimmed) {
    followers += (r.newFollowers - r.lostFollowers)
    if (followers < 0) followers = 0
    history.push({
      date: r.date.replace(/\//g, '-'),
      followers,
      likes: r.likes,
      videoViews: r.videoViews,
      profileViews: r.profileViews,
    })
  }
  return { platform: 'tiktok', data: history }
}

function run() {
  const csvPath = path.join(__dirname, 'export-tiktok', 'Overview(2024_10_01-2025_09_30).csv')
  if (!fs.existsSync(csvPath)) {
    console.error('TikTok CSV not found at', csvPath)
    process.exit(1)
  }
  const csv = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCsv(csv)
  const history = toHistory(rows)
  const historyDir = path.join(__dirname, 'history')
  if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true })
  const outPath = path.join(historyDir, 'tiktok.json')
  fs.writeFileSync(outPath, JSON.stringify(history, null, 2))
  console.log('Wrote', outPath, 'with', history.data.length, 'rows')
}

run()


