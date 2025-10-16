import fs from 'fs'
import path from 'path'

export interface EcosystemMetrics {
  lastUpdated: string
  timeframes: {
    [key: string]: {
      date: string
      summary: {
        totalFollowers: number
        totalViews: number
        totalEngagement: number
        totalClicks: number
      }
      platforms: {
        [key: string]: {
          name: string
          followers?: number
          subscribers?: number
          members?: number
          engagementRate?: number
          likes?: number
          views?: number
          metricsCount: number
          color: string
        }
      }
    }
  }
  performanceTrends: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      borderWidth: number
      fill: boolean
      tension: number
      pointBackgroundColor: string
      pointBorderColor: string
      pointRadius: number
    }>
  }
}

export async function getEcosystemMetrics(): Promise<EcosystemMetrics> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ecosystem-metrics.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents) as EcosystemMetrics
  } catch (error) {
    console.error('Error reading ecosystem metrics:', error)
    throw new Error('Failed to load ecosystem metrics')
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function calculateChange(current: number, previous: number): string {
  if (previous === 0) return '+0%'
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

