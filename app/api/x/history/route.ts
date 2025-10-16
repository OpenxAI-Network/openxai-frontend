import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'history', 'x.json')
    
    if (!fs.existsSync(historyPath)) {
      return NextResponse.json({ error: 'X data not found' }, { status: 404 })
    }
    
    const data = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
    
    // Convert X dates to proper format and reverse order (newest first)
    const formattedData = data.data.reverse().map((item: any) => {
      // Convert "Wed, Oct 15, 2025" to "2025-10-15"
      const dateStr = item.date
      const date = new Date(dateStr)
      const formattedDate = date.toISOString().split('T')[0]
      
      return {
        date: formattedDate,
        followers: item.followers,
        impressions: item.impressions,
        engagements: item.engagements,
        likes: item.likes,
        shares: item.shares,
        replies: item.replies,
      }
    })
    
    // Format data for Chart.js with proper timeline
    const chartData = {
      labels: formattedData.map((item: any) => item.date),
      datasets: [
        {
          label: 'X Followers',
          data: formattedData.map((item: any) => item.followers),
          borderColor: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          tension: 0.1,
        },
        {
          label: 'X Impressions',
          data: formattedData.map((item: any) => item.impressions),
          borderColor: 'rgb(29, 155, 240)',
          backgroundColor: 'rgba(29, 155, 240, 0.1)',
          tension: 0.1,
        },
        {
          label: 'X Engagements',
          data: formattedData.map((item: any) => item.engagements),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.1,
        },
        {
          label: 'X Likes',
          data: formattedData.map((item: any) => item.likes),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1,
        },
      ],
    }
    
    return NextResponse.json(chartData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error('Error fetching X history:', error)
    return NextResponse.json({ error: 'Failed to fetch X data' }, { status: 500 })
  }
}
