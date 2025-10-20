import fs from 'fs'
import path from 'path'

type TikTokRow = {
  date: string
  videoViews: number
  reachedAudience: number | null
  profileViews: number
  likes: number
  shares: number
  comments: number
  phoneClicks: number
  leads: number
  netGrowth: number
  newFollowers: number
  lostFollowers: number
}

type TikTokHistory = {
  platform: 'tiktok'
  data: Array<{
    date: string
    followers: number
    likes: number
    videoViews: number
    profileViews: number
  }>
}

function parseCsv(content: string): TikTokRow[] {
  const lines = content.trim().split(/\r?\n/)
  if (lines.length <= 1) return []
  const rows: TikTokRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    // Simple CSV split (no embedded quotes observed in sample)
    const cols = line.split(',')
    const getNum = (v: string) => {
      if (v === undefined) return 0
      const t = v.trim()
      if (t.toUpperCase() === 'NAN' || t === '') return 0
      const n = Number(t)
      return Number.isFinite(n) ? n : 0
    }

    rows.push({
      date: cols[0]?.replaceAll('/', '-') ?? '',
      videoViews: getNum(cols[1] ?? '0'),
      reachedAudience: (cols[2]?.trim().toUpperCase() === 'NAN' ? null : getNum(cols[2] ?? '0')),
      profileViews: getNum(cols[3] ?? '0'),
      likes: getNum(cols[4] ?? '0'),
      shares: getNum(cols[5] ?? '0'),
      comments: getNum(cols[6] ?? '0'),
      phoneClicks: getNum(cols[7] ?? '0'),
      leads: getNum(cols[8] ?? '0'),
      netGrowth: getNum(cols[9] ?? '0'),
      newFollowers: getNum(cols[10] ?? '0'),
      lostFollowers: getNum(cols[11] ?? '0'),
    })
  }
  return rows
}

function toHistory(rows: TikTokRow[]): TikTokHistory {
  // Include all dates, but start followers count from first activity
  let firstActivityIndex = -1
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const active = (r.videoViews || r.profileViews || r.likes || r.shares || r.comments || r.newFollowers || r.lostFollowers)
    if (active) {
      firstActivityIndex = i
      break
    }
  }

  // Build followers cumulative from netGrowth with non-negative floor
  const history: TikTokHistory['data'] = []
  let followers = 0
  
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    
    // Only start counting followers from first activity
    if (i >= firstActivityIndex) {
      followers += (r.newFollowers - r.lostFollowers)
      if (followers < 0) followers = 0
    }
    
    history.push({
      date: r.date.replace(/\//g, '-'),
      followers: i >= firstActivityIndex ? followers : 0,
      likes: r.likes,
      videoViews: r.videoViews,
      profileViews: r.profileViews,
    })
  }

  return { platform: 'tiktok', data: history }
}

async function run() {
  try {
    console.log('📥 Importing TikTok CSV...')
    const csvPath = path.join(__dirname, 'export-tiktok', 'Overview(2024_10_01-2025_09_30).csv')
    if (!fs.existsSync(csvPath)) {
      throw new Error(`TikTok CSV not found at ${csvPath}`)
    }
    const csv = fs.readFileSync(csvPath, 'utf8')
    const rows = parseCsv(csv)
    console.log(`Found ${rows.length} TikTok rows`)

    const history = toHistory(rows)

    const historyDir = path.join(__dirname, 'history')
    if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true })
    const outPath = path.join(historyDir, 'tiktok.json')
    fs.writeFileSync(outPath, JSON.stringify(history, null, 2))
    console.log(`✅ Wrote ${outPath}`)
  } catch (err) {
    console.error('❌ TikTok import failed:', err)
    process.exit(1)
  }
}

run()



