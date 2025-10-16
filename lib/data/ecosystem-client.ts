// Browser-safe types and helpers for Ecosystem metrics

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
      pointBackgroundColor?: string
      pointBorderColor?: string
      pointRadius?: number
    }>
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return `${num}`
}

export function calculateChange(current: number, previous: number): string {
  if (!Number.isFinite(previous) || previous === 0) return '+0%'
  const delta = ((current - previous) / previous) * 100
  const sign = delta >= 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
}



