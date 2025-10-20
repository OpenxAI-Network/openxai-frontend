import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'history', 'youtube.json')
    if (!fs.existsSync(historyPath)) {
      return NextResponse.json({ labels: [], datasets: [] })
    }
    const content = fs.readFileSync(historyPath, 'utf8')
    const rows = JSON.parse(content) as Array<{ date: string; subscribers?: number; views?: number; videos?: number }>

    // Build chart dataset for YouTube subscribers only
    const labels = rows.map((r) => r.date)
    const subscribersData = rows.map((r) => Number(r.subscribers ?? 0))

    return NextResponse.json({
      labels,
      datasets: [
        {
          label: 'YouTube Subscribers',
          data: subscribersData,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    })
  } catch (error) {
    console.error('YouTube history API error:', error)
    return NextResponse.json({ error: 'Failed to read YouTube history' }, { status: 500 })
  }
}



