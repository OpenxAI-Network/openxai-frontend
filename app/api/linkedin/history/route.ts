import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'history', 'linkedin.json')
    
    if (!fs.existsSync(historyPath)) {
      return NextResponse.json({ error: 'LinkedIn data not found' }, { status: 404 })
    }
    
    const data = JSON.parse(fs.readFileSync(historyPath, 'utf-8'))
    
    // Format data for Chart.js with proper timeline
    const chartData = {
      labels: data.data.map((item: any) => item.date),
      datasets: [
        {
          label: 'LinkedIn Impressions',
          data: data.data.map((item: any) => item.impressions),
          borderColor: 'rgb(0, 119, 181)',
          backgroundColor: 'rgba(0, 119, 181, 0.1)',
          tension: 0.1,
        },
        {
          label: 'LinkedIn Engagements',
          data: data.data.map((item: any) => item.engagements),
          borderColor: 'rgb(255, 165, 0)',
          backgroundColor: 'rgba(255, 165, 0, 0.1)',
          tension: 0.1,
        },
        {
          label: 'LinkedIn Followers',
          data: data.data.map((item: any) => item.followers),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1,
        },
      ],
    }
    
    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching LinkedIn history:', error)
    return NextResponse.json({ error: 'Failed to fetch LinkedIn data' }, { status: 500 })
  }
}
