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
    
    // Return only Followers series for Chart.js
    const chartData = {
      labels: data.data.map((item: any) => item.date),
      datasets: [
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
