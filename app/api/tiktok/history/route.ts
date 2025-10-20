import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'history', 'tiktok.json')
    if (!fs.existsSync(historyPath)) {
      return NextResponse.json({ labels: [], datasets: [] }, { headers: { 'Cache-Control': 'no-store' } })
    }
    const raw = fs.readFileSync(historyPath, 'utf8')
    const json = JSON.parse(raw) as { data: Array<{ date: string; followers: number; likes: number; videoViews: number; profileViews: number }> }

    // Chronological order is expected; ensure dates normalized to YYYY-MM-DD
    const labels = json.data.map(d => d.date.includes('/') ? d.date.replace(/\//g, '-') : d.date)

    const chart = {
      labels,
      datasets: [
        {
          label: 'TikTok Followers',
          data: json.data.map(d => d.followers),
          borderColor: '#CCCCCC',
          backgroundColor: 'rgba(204, 204, 204, 0.15)',
          fill: true,
          tension: 0.2,
        },
        {
          label: 'TikTok Likes',
          data: json.data.map(d => d.likes),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.2,
        },
        {
          label: 'TikTok Video Views',
          data: json.data.map(d => d.videoViews),
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.1)',
          fill: true,
          tension: 0.2,
        },
        {
          label: 'TikTok Profile Views',
          data: json.data.map(d => d.profileViews),
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          fill: true,
          tension: 0.2,
        },
      ],
    }

    return NextResponse.json(chart, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('Error fetching TikTok history', err)
    return NextResponse.json({ error: 'Failed to fetch TikTok data' }, { status: 500 })
  }
}


