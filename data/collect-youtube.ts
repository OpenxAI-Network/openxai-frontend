import fs from 'fs'
import path from 'path'

// YouTube Data API v3 - Free tier: 10,000 units/day
// channels endpoint costs 1 unit per request
interface YouTubeChannelStats {
  subscriberCount: string
  viewCount: string
  videoCount: string
}

interface YouTubeResponse {
  items: Array<{
    statistics: YouTubeChannelStats
  }>
}

interface EcosystemSnapshot {
  date: string
  timestamp: string
  platforms: {
    youtube: {
      subscribers: number
      views: number
      videos: number
    }
  }
}

async function fetchYouTubeStats(channelId: string, apiKey: string): Promise<YouTubeChannelStats | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
    const response = await fetch(url)
    
    if (!response.ok) {
      const body = await response.text()
      let detail = body
      try { detail = JSON.parse(body)?.error?.message || body } catch {}
      throw new Error(`YouTube API error: ${response.status} ${response.statusText} - ${detail}`)
    }
    
    const data: YouTubeResponse = await response.json()
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No channel data found')
    }
    
    return data.items[0].statistics
  } catch (error) {
    console.error('Error fetching YouTube stats:', error)
    return null
  }
}

function createSnapshot(youtubeStats: YouTubeChannelStats | null): EcosystemSnapshot {
  const now = new Date()
  const date = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timestamp = now.toISOString()
  
  return {
    date,
    timestamp,
    platforms: {
      youtube: {
        subscribers: youtubeStats ? parseInt(youtubeStats.subscriberCount) : 0,
        views: youtubeStats ? parseInt(youtubeStats.viewCount) : 0,
        videos: youtubeStats ? parseInt(youtubeStats.videoCount) : 0,
      }
    }
  }
}

function backupCurrentFile(): void {
  const dataDir = path.join(process.cwd(), 'data')
  const currentFile = path.join(dataDir, 'ecosystem-metrics.json')
  const backupDir = path.join(dataDir, 'backups')
  
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  // Create backup filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(backupDir, `ecosystem-metrics-${timestamp}.json`)
  
  try {
    if (fs.existsSync(currentFile)) {
      fs.copyFileSync(currentFile, backupFile)
      console.log(`✅ Backup created: ${backupFile}`)
    } else {
      console.log('⚠️  No current file to backup')
    }
  } catch (error) {
    console.error('❌ Error creating backup:', error)
  }
}

function updateEcosystemMetrics(snapshot: EcosystemSnapshot): void {
  const dataDir = path.join(process.cwd(), 'data')
  const currentFile = path.join(dataDir, 'ecosystem-metrics.json')
  const youtubeHistoryFile = path.join(dataDir, 'history', 'youtube.json')
  
  try {
    // Read current metrics
    let currentMetrics
    if (fs.existsSync(currentFile)) {
      const fileContent = fs.readFileSync(currentFile, 'utf8')
      currentMetrics = JSON.parse(fileContent)
    } else {
      // Create basic structure if file doesn't exist
      currentMetrics = {
        lastUpdated: snapshot.timestamp,
        timeframes: {
          "24h": { date: snapshot.date, summary: { totalFollowers: 0, totalViews: 0, totalEngagement: 0, totalClicks: 0 }, platforms: {} },
          "7d": { date: snapshot.date, summary: { totalFollowers: 0, totalViews: 0, totalEngagement: 0, totalClicks: 0 }, platforms: {} },
          "1m": { date: snapshot.date, summary: { totalFollowers: 0, totalViews: 0, totalEngagement: 0, totalClicks: 0 }, platforms: {} },
          "3m": { date: snapshot.date, summary: { totalFollowers: 0, totalViews: 0, totalEngagement: 0, totalClicks: 0 }, platforms: {} }
        },
        performanceTrends: { labels: [], datasets: [] }
      }
    }
    
    // Update with new YouTube data
    const youtubeData = snapshot.platforms.youtube
    
    // Update 24h timeframe with latest data
    currentMetrics.timeframes["24h"] = {
      date: snapshot.date,
      summary: {
        totalFollowers: youtubeData.subscribers,
        totalViews: youtubeData.views,
        totalEngagement: 0, // Keep existing or set to 0
        totalClicks: 0 // Keep existing or set to 0
      },
      platforms: {
        youtube: {
          name: "YouTube",
          subscribers: youtubeData.subscribers,
          views: youtubeData.views,
          metricsCount: 2,
          color: "bg-red-500"
        }
      }
    }
    
    // Update lastUpdated timestamp
    currentMetrics.lastUpdated = snapshot.timestamp
    
    // Write updated metrics
    fs.writeFileSync(currentFile, JSON.stringify(currentMetrics, null, 2))
    console.log(`✅ Updated ecosystem metrics: ${currentFile}`)
    
    // Also append to consolidated YouTube history file
    const historyDir = path.join(dataDir, 'history')
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true })
    }

    let historyArr: any[] = []
    if (fs.existsSync(youtubeHistoryFile)) {
      try {
        historyArr = JSON.parse(fs.readFileSync(youtubeHistoryFile, 'utf8'))
        if (!Array.isArray(historyArr)) historyArr = []
      } catch {
        historyArr = []
      }
    }

    const compact = {
      date: snapshot.date,
      subscribers: snapshot.platforms.youtube.subscribers,
      views: snapshot.platforms.youtube.views,
      videos: snapshot.platforms.youtube.videos,
    }
    const existingIndex = historyArr.findIndex((e) => e.date === compact.date)
    if (existingIndex >= 0) historyArr[existingIndex] = compact
    else historyArr.push(compact)

    historyArr.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    fs.writeFileSync(youtubeHistoryFile, JSON.stringify(historyArr, null, 2))
    console.log(`✅ Saved YouTube history: ${youtubeHistoryFile}`)
    
  } catch (error) {
    console.error('❌ Error updating ecosystem metrics:', error)
  }
}

async function main() {
  console.log('🚀 Starting YouTube data collection...')

  // Load .env.local manually (no dependency on dotenv)
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const text = fs.readFileSync(envPath, 'utf8')
      text
        .split(/\r?\n/)
        .filter((l) => l.trim() && !l.trim().startsWith('#'))
        .forEach((line) => {
          const eq = line.indexOf('=')
          if (eq > 0) {
            const key = line.slice(0, eq).trim()
            let value = line.slice(eq + 1).trim()
            value = value.replace(/^['"]|['"]$/g, '')
            if (!process.env[key]) process.env[key] = value
          }
        })
    }
  } catch (e) {
    console.warn('Warning: failed to read .env.local', e)
  }
  
  // Skip if we already collected today (avoid unnecessary API usage)
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const today = new Date().toISOString().split('T')[0]
    // Check consolidated YouTube history file
    const youtubeHistoryFile = path.join(dataDir, 'history', 'youtube.json')
    if (fs.existsSync(youtubeHistoryFile)) {
      const arr = JSON.parse(fs.readFileSync(youtubeHistoryFile, 'utf8')) as Array<{date:string}>
      if (Array.isArray(arr) && arr.some((e) => e.date === today)) {
        console.log(`⏭️  YouTube history already has an entry for ${today}. Skipping API call.`)
        return
      }
    }

    const currentFile = path.join(dataDir, 'ecosystem-metrics.json')
    if (fs.existsSync(currentFile)) {
      const current = JSON.parse(fs.readFileSync(currentFile, 'utf8'))
      const tf = current?.timeframes?.["24h"]
      const alreadyToday = tf?.date === today && tf?.platforms?.youtube?.subscribers
      if (alreadyToday) {
        console.log(`⏭️  24h timeframe is already updated for today. Skipping API call.`)
        return
      }
    }
  } catch (e) {
    console.warn('Warning: pre-check failed, proceeding to fetch.', e)
  }

  // Load environment variables
  const youtubeApiKey = process.env.YOUTUBE_API_KEY
  const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID
  
  if (!youtubeApiKey || !youtubeChannelId) {
    console.error('❌ Missing required environment variables:')
    console.error('   YOUTUBE_API_KEY - Get from https://console.developers.google.com/')
    console.error('   YOUTUBE_CHANNEL_ID - Your YouTube channel ID')
    console.error('')
    console.error('Create a .env.local file with these variables')
    process.exit(1)
  }
  
  console.log(`📺 Fetching YouTube stats for channel: ${youtubeChannelId}`)
  
  // Fetch YouTube stats
  const youtubeStats = await fetchYouTubeStats(youtubeChannelId, youtubeApiKey)
  
  if (!youtubeStats) {
    console.error('❌ Failed to fetch YouTube stats')
    process.exit(1)
  }
  
  console.log('📊 YouTube Stats:')
  console.log(`   Subscribers: ${parseInt(youtubeStats.subscriberCount).toLocaleString()}`)
  console.log(`   Views: ${parseInt(youtubeStats.viewCount).toLocaleString()}`)
  console.log(`   Videos: ${parseInt(youtubeStats.videoCount).toLocaleString()}`)
  
  // Create snapshot
  const snapshot = createSnapshot(youtubeStats)
  
  // Backup current file
  backupCurrentFile()
  
  // Update ecosystem metrics
  updateEcosystemMetrics(snapshot)
  
  console.log('✅ YouTube data collection complete!')
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { fetchYouTubeStats, createSnapshot, backupCurrentFile, updateEcosystemMetrics }
