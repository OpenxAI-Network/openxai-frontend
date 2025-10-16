import fs from 'fs'
import path from 'path'

interface LinkedinRow {
  date: string
  sponsored: number
  organic: number
  autoInvited: number
  total: number
}

function parseCsv(content: string): LinkedinRow[] {
  const lines = content.trim().split(/\r?\n/)
  // Expect header: Date,Sponsored followers,Organic followers,Auto-invited followers,Total followers
  return lines.slice(1).map((line) => {
    const parts = line.split(',')
    const [date, sponsored, organic, autoInvited, total] = parts
    return {
      date: date.trim(),
      sponsored: parseInt(sponsored || '0', 10) || 0,
      organic: parseInt(organic || '0', 10) || 0,
      autoInvited: parseInt(autoInvited || '0', 10) || 0,
      total: parseInt(total || '0', 10) || 0,
    }
  })
}

function formatDateMMDDYYYYToISO(dateStr: string): string {
  // Input e.g. 02/26/2025 → 2025-02-26
  const [mm, dd, yyyy] = dateStr.split('/')
  const iso = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`).toISOString().split('T')[0]
  return iso
}

async function run() {
  try {
    console.log('📦 Importing LinkedIn followers CSV...')

    const csvPath = path.join(process.cwd(), 'data', 'export-linkedin', 'New followers-Table 1.csv')
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV not found at ${csvPath}`)
    }

    const csv = fs.readFileSync(csvPath, 'utf-8')
    const rows = parseCsv(csv)

    // CSV appears to be oldest → newest already; keep order
    const chronological = [...rows]

    // Trim leading all-zero rows; first non-zero 'Total followers' marks start (e.g., 2025-02-24)
    const firstActiveIdx = chronological.findIndex((r) => (r.total || 0) !== 0)
    const active = firstActiveIdx > 0 ? chronological.slice(firstActiveIdx) : chronological

    // Build cumulative followers from daily new followers starting at 0
    let running = 0
    const series: Array<{ date: string; followers: number; impressions: number; engagements: number }> = []
    if (active.length > 0) {
      // Start at zero on the first active date
      series.push({
        date: formatDateMMDDYYYYToISO(active[0].date),
        followers: 0,
        impressions: 0,
        engagements: 0,
      })
      for (const r of active) {
        running += r.total || 0
        series.push({
          date: formatDateMMDDYYYYToISO(r.date),
          followers: Math.max(0, running),
          impressions: 0,
          engagements: 0,
        })
      }
    }

    // Ensure history directory
    const historyDir = path.join(process.cwd(), 'data', 'history')
    if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true })

    // Save
    const out = {
      platform: 'linkedin',
      data: series,
    }
    const outPath = path.join(historyDir, 'linkedin.json')
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
    console.log(`✅ Wrote LinkedIn history to ${outPath}`)

  } catch (e) {
    console.error('❌ LinkedIn import failed:', e)
    process.exit(1)
  }
}

run()

import fs from 'fs'
import path from 'path'

interface LinkedInDataPoint {
  date: string
  followers: number
  impressions: number
  engagements: number
  clicks: number
  shares: number
  comments: number
}

interface LinkedInHistoryData {
  platform: 'linkedin'
  data: LinkedInDataPoint[]
}

// Placeholder function - will need to be updated once we can read the Excel file
function parseLinkedInExcel(): LinkedInDataPoint[] {
  console.log('⚠️  LinkedIn Excel parsing not yet implemented')
  console.log('📋 Please manually convert the Excel file to CSV or provide the data structure')
  
  // Return empty array for now
  return []
}

async function importLinkedInData() {
  try {
    console.log('📊 Importing LinkedIn data...')
    
    const excelPath = path.join(__dirname, 'export-linkedin', 'openxainetwork_content_1760541221800.xls')
    
    if (!fs.existsSync(excelPath)) {
      throw new Error(`LinkedIn Excel file not found at ${excelPath}`)
    }
    
    console.log(`📁 Found LinkedIn Excel file: ${excelPath}`)
    
    const rawData = parseLinkedInExcel()
    
    if (rawData.length === 0) {
      console.log('⚠️  No LinkedIn data to import yet')
      console.log('💡 To complete this import:')
      console.log('   1. Convert the Excel file to CSV manually')
      console.log('   2. Or install pandas: pip install pandas openpyxl')
      console.log('   3. Or provide the data structure you want to import')
      return
    }
    
    const historyData: LinkedInHistoryData = {
      platform: 'linkedin',
      data: rawData
    }
    
    // Create history directory if it doesn't exist
    const historyDir = path.join(__dirname, 'history')
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true })
    }
    
    // Save to history file
    const historyPath = path.join(historyDir, 'linkedin.json')
    fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2))
    
    console.log(`✅ LinkedIn data saved to ${historyPath}`)
    
  } catch (error) {
    console.error('❌ Error importing LinkedIn data:', error)
    process.exit(1)
  }
}

// Run the import
importLinkedInData()
