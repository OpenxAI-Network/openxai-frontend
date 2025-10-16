import fs from 'fs'
import path from 'path'

interface XDataPoint {
  date: string
  impressions: number
  likes: number
  engagements: number
  bookmarks: number
  shares: number
  newFollows: number
  unfollows: number
  replies: number
  reposts: number
  profileVisits: number
  createPost: number
  videoViews: number
  mediaViews: number
}

interface XHistoryData {
  platform: 'x'
  data: Array<{
    date: string
    followers: number
    impressions: number
    engagements: number
    likes: number
    shares: number
    replies: number
  }>
}

function parseXCSV(csvContent: string): XDataPoint[] {
  const lines = csvContent.trim().split('\n')
  
  return lines.slice(1).map(line => {
    // Handle CSV parsing with quoted values
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    return {
      date: values[0].replace(/"/g, ''),
      impressions: parseInt(values[1]) || 0,
      likes: parseInt(values[2]) || 0,
      engagements: parseInt(values[3]) || 0,
      bookmarks: parseInt(values[4]) || 0,
      shares: parseInt(values[5]) || 0,
      newFollows: parseInt(values[6]) || 0,
      unfollows: parseInt(values[7]) || 0,
      replies: parseInt(values[8]) || 0,
      reposts: parseInt(values[9]) || 0,
      profileVisits: parseInt(values[10]) || 0,
      createPost: parseInt(values[11]) || 0,
      videoViews: parseInt(values[12]) || 0,
      mediaViews: parseInt(values[13]) || 0,
    }
  })
}

function calculateFollowers(data: XDataPoint[]): number {
  // Start with current follower count (26,083 as mentioned by user)
  // and work backwards using newFollows and unfollows
  let followers = 26083
  
  // Reverse the data to calculate historical followers
  const reversedData = [...data].reverse()
  
  for (const point of reversedData) {
    followers -= point.newFollows
    followers += point.unfollows
  }
  
  return followers
}

function convertToHistoryFormat(data: XDataPoint[]): XHistoryData {
  // Use static follower count as mentioned by user
  const staticFollowers = 26083
  
  const historyData = data.map((point) => {
    return {
      date: point.date,
      followers: staticFollowers, // Keep static as requested
      impressions: point.impressions,
      engagements: point.engagements,
      likes: point.likes,
      shares: point.shares,
      replies: point.replies,
    }
  })
  
  return {
    platform: 'x',
    data: historyData
  }
}

async function importXData() {
  try {
    console.log('📊 Importing X (Twitter) data...')
    
    const csvPath = path.join(__dirname, 'export-x', 'account_overview_analytics.csv')
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`X CSV file not found at ${csvPath}`)
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const rawData = parseXCSV(csvContent)
    
    console.log(`📈 Found ${rawData.length} days of X data`)
    console.log(`📅 Date range: ${rawData[rawData.length - 1].date} to ${rawData[0].date}`)
    
    const historyData = convertToHistoryFormat(rawData)
    
    // Create history directory if it doesn't exist
    const historyDir = path.join(__dirname, 'history')
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true })
    }
    
    // Save to history file
    const historyPath = path.join(historyDir, 'x.json')
    fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2))
    
    console.log(`✅ X data saved to ${historyPath}`)
    console.log(`📊 Latest follower count: ${historyData.data[0].followers.toLocaleString()}`)
    console.log(`📊 Latest impressions: ${historyData.data[0].impressions.toLocaleString()}`)
    console.log(`📊 Latest engagements: ${historyData.data[0].engagements.toLocaleString()}`)
    
  } catch (error) {
    console.error('❌ Error importing X data:', error)
    process.exit(1)
  }
}

// Run the import
importXData()
