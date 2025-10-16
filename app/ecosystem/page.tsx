"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { 
  Users, 
  Eye, 
  Heart, 
  TrendingUp,
  Calendar,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EcosystemMetrics, formatNumber, calculateChange } from "@/lib/data/ecosystem-client"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type VisiblePlatforms = {
  youtube: boolean
  x: boolean
  linkedin: boolean
  instagram: boolean
  tiktok: boolean
  discord: boolean
  telegram: boolean
  farcaster: boolean
  medium: boolean
  github: boolean
}

type XStatVisibility = {
  followers: boolean
  impressions: boolean
  engagements: boolean
  likes: boolean
}

type LinkedinStatVisibility = { followers: boolean }

function UnifiedEcosystemChart({ selectedTimeframe, visiblePlatforms, xStatVisibility, linkedinStatVisibility }: { 
  selectedTimeframe: string
  visiblePlatforms: { [key: string]: boolean }
  xStatVisibility: { followers: boolean; impressions: boolean; engagements: boolean; likes: boolean }
  linkedinStatVisibility: { followers: boolean; impressions: boolean; engagements: boolean }
}) {
  const [youtubeData, setYoutubeData] = useState<any>(null)
  const [xData, setXData] = useState<any>(null)
  const [linkedinData, setLinkedinData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to filter data based on timeframe
  const filterDataByTimeframe = useCallback((data: any, timeframe: string) => {
    if (!data || !data.labels || !data.datasets) return null

    // Instead of filtering from today, filter from the most recent available data
    const availableDates = data.labels.map((label: string) => new Date(label))
    const mostRecentDate = new Date(Math.max(...availableDates.map((d: Date) => d.getTime())))
    
    let daysBack = 0
    switch (timeframe) {
      case "24h":
        daysBack = 1
        break
      case "7d":
        daysBack = 7
        break
      case "1m":
        daysBack = 30
        break
      case "3m":
        daysBack = 90
        break
      case "1y":
        daysBack = 365
        break
      default:
        return data
    }

    // Calculate cutoff from the most recent available date
    const cutoffDate = new Date(mostRecentDate)
    cutoffDate.setDate(mostRecentDate.getDate() - daysBack)

    const filteredLabels: string[] = []
    const filteredDatasets = data.datasets.map((dataset: any) => ({
      ...dataset,
      data: []
    }))

    data.labels.forEach((label: string, index: number) => {
      const labelDate = new Date(label)
      if (labelDate >= cutoffDate) {
        filteredLabels.push(label)
        data.datasets.forEach((dataset: any, dsIndex: number) => {
          filteredDatasets[dsIndex].data.push(dataset.data[index])
        })
      }
    })

    return {
      labels: filteredLabels,
      datasets: filteredDatasets
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const [youtubeRes, xRes, linkedinRes] = await Promise.allSettled([
          fetch(origin ? `${origin}/api/youtube/history` : '/api/youtube/history', { cache: 'no-store' }),
          fetch(origin ? `${origin}/api/x/history` : '/api/x/history', { cache: 'no-store' }),
          fetch(origin ? `${origin}/api/linkedin/history` : '/api/linkedin/history', { cache: 'no-store' })
        ])

        if (youtubeRes.status === 'fulfilled' && youtubeRes.value.ok) {
          setYoutubeData(await youtubeRes.value.json())
        }
        
        if (xRes.status === 'fulfilled' && xRes.value.ok) {
          setXData(await xRes.value.json())
        }
        
        if (linkedinRes.status === 'fulfilled' && linkedinRes.value.ok) {
          setLinkedinData(await linkedinRes.value.json())
        }
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) return <div className="text-white/60">Loading ecosystem data…</div>
  if (error) return <div className="text-red-400">Error: {error}</div>

  // Filter data based on selected timeframe
  const filteredYoutubeData = filterDataByTimeframe(youtubeData, selectedTimeframe)
  const filteredXData = filterDataByTimeframe(xData, selectedTimeframe)
  const filteredLinkedinData = filterDataByTimeframe(linkedinData, selectedTimeframe)

  const datasets: any[] = []
  let labels: string[] = []

  // Create a unified timeline by combining all available dates
  const allDates = new Set<string>()
  
  if (filteredYoutubeData?.labels) {
    filteredYoutubeData.labels.forEach((date: string) => allDates.add(date))
  }
  if (filteredXData?.labels) {
    filteredXData.labels.forEach((date: string) => allDates.add(date))
  }
  if (filteredLinkedinData?.labels) {
    filteredLinkedinData.labels.forEach((date: string) => allDates.add(date))
  }
  
  // Sort dates chronologically
  labels = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Map each platform's data to the unified timeline
  if (filteredYoutubeData?.labels?.length > 0 && visiblePlatforms.youtube) {
    filteredYoutubeData.datasets.forEach((dataset: any) => {
      const alignedData = labels.map((label: string) => {
        const youtubeIndex = filteredYoutubeData.labels.indexOf(label)
        return youtubeIndex >= 0 ? dataset.data[youtubeIndex] : null
      })
      
      datasets.push({
        ...dataset,
        label: 'YouTube Subscribers',
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        data: alignedData,
        hidden: !visiblePlatforms.youtube,
      })
    })
  }

  if (filteredXData?.labels?.length > 0 && visiblePlatforms.x) {
    filteredXData.datasets.forEach((dataset: any) => {
      const alignedData = labels.map((label: string) => {
        const xIndex = filteredXData.labels.indexOf(label)
        return xIndex >= 0 ? dataset.data[xIndex] : null
      })
      
      datasets.push({
        ...dataset,
        data: alignedData,
        hidden: !visiblePlatforms.x || (
          (dataset.label === 'X Followers' ? !xStatVisibility.followers : false) ||
          (dataset.label === 'X Impressions' ? !xStatVisibility.impressions : false) ||
          (dataset.label === 'X Engagements' ? !xStatVisibility.engagements : false) ||
          (dataset.label === 'X Likes' ? !xStatVisibility.likes : false)
        ),
      })
    })
  }

  if (filteredLinkedinData?.labels?.length > 0 && visiblePlatforms.linkedin) {
    filteredLinkedinData.datasets.forEach((dataset: any) => {
      const alignedData = labels.map((label: string) => {
        const linkedinIndex = filteredLinkedinData.labels.indexOf(label)
        return linkedinIndex >= 0 ? dataset.data[linkedinIndex] : null
      })
      
      datasets.push({
        ...dataset,
        data: alignedData,
        hidden: !visiblePlatforms.linkedin || (
          (dataset.label === 'LinkedIn Followers' ? !linkedinStatVisibility.followers : false)
        ),
      })
    })
  }

  const chartData = {
    labels,
    datasets
  }

  // Dynamically scale Y axis based on VISIBLE datasets only (and numeric values)
  const visibleValues: number[] = datasets
    .filter(d => !d.hidden)
    .flatMap(d => (Array.isArray(d.data) ? d.data : []))
    .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v))
  const maxVal = visibleValues.length ? Math.max(...visibleValues) : 0
  const minVal = visibleValues.length ? Math.min(...visibleValues) : 0

  const dynamicOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        suggestedMin: Math.max(0, Math.floor(minVal * 0.95)),
        suggestedMax: Math.ceil(maxVal * 1.05) || undefined,
      },
    },
    plugins: {
      ...chartOptions.plugins,
    }
  } as const

  return <Line data={chartData} options={dynamicOptions as any} />
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  elements: {
    line: {
      spanGaps: false, // Don't connect points across gaps (missing data)
    },
    point: {
      radius: 2,
      hoverRadius: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6A6A6A",
        font: {
          size: 12,
        },
        maxRotation: 45,
        minRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(106, 106, 106, 0.1)",
      },
      ticks: {
        color: "#6A6A6A",
        callback: function (value: any) {
          // Avoid K-abbreviation for smaller ranges so subtle changes are visible
          return value >= 10000 ? `${(value / 1000).toFixed(0)}K` : value
        },
        font: {
          size: 12,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false, // Hide legend since we're using platform boxes
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            const value = context.parsed.y
            // Avoid K-abbreviation under 10k so week-scale changes are readable
            label += value >= 10000 ? `${(value / 1000).toFixed(1)}K` : value
            return label
          }
        }
    },
  },
}

export default function EcosystemPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(() => {
    if (typeof window === 'undefined') return "7d"
    const tf = localStorage.getItem('ecos-timeframe')
    return tf || "7d"
  })
  const [metrics, setMetrics] = useState<EcosystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [xLatestFollowers, setXLatestFollowers] = useState<number | null>(null)
  const [xLatestImpressions, setXLatestImpressions] = useState<number | null>(null)
  const [xLatestEngagements, setXLatestEngagements] = useState<number | null>(null)
  const [xLatestLikes, setXLatestLikes] = useState<number | null>(null)
  const [linkedinLatestFollowers, setLinkedinLatestFollowers] = useState<number | null>(null)
  const [xStatVisibility, setXStatVisibility] = useState<XStatVisibility>(() => {
    if (typeof window === 'undefined') return { followers: true, impressions: false, engagements: false, likes: false }
    try {
      const saved = localStorage.getItem('ecos-x-visibility')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { followers: true, impressions: false, engagements: false, likes: false }
  })
  const [linkedinStatVisibility, setLinkedinStatVisibility] = useState<LinkedinStatVisibility>(() => {
    if (typeof window === 'undefined') return { followers: true }
    try {
      const saved = localStorage.getItem('ecos-linkedin-visibility')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { followers: true }
  })
  const [visiblePlatforms, setVisiblePlatforms] = useState<VisiblePlatforms>(() => {
    const defaults = {
      youtube: true,
      x: true,
      linkedin: true,
      instagram: true,
      tiktok: false,
      discord: true,
      telegram: true,
      farcaster: true,
      medium: true,
      github: true,
    }
    if (typeof window === 'undefined') return defaults
    try {
      const saved = localStorage.getItem('ecos-platform-visibility')
      if (saved) return { ...defaults, ...JSON.parse(saved) }
    } catch {}
    return defaults
  })

  const handlePlatformToggle = (platform: string) => {
    setVisiblePlatforms((prev: VisiblePlatforms) => ({
      ...prev,
      [platform]: !prev[platform as keyof VisiblePlatforms]
    }))
  }

  useEffect(() => {
    // Load saved preferences
    try {
      const saved = localStorage.getItem('ecos-x-visibility')
      if (saved) {
        const parsed = JSON.parse(saved)
        setXStatVisibility((prev: XStatVisibility) => ({
          followers: typeof parsed.followers === 'boolean' ? parsed.followers : prev.followers,
          impressions: typeof parsed.impressions === 'boolean' ? parsed.impressions : prev.impressions,
          engagements: typeof parsed.engagements === 'boolean' ? parsed.engagements : prev.engagements,
          likes: typeof parsed.likes === 'boolean' ? parsed.likes : prev.likes,
        }))
      }
      const savedPlatforms = localStorage.getItem('ecos-platform-visibility')
      const savedLinkedin = localStorage.getItem('ecos-linkedin-visibility')
      if (savedLinkedin) {
        const parsed = JSON.parse(savedLinkedin)
        setLinkedinStatVisibility((prev) => ({
          followers: typeof parsed.followers === 'boolean' ? parsed.followers : prev.followers,
        }))
      }
      if (savedPlatforms) {
        const parsed = JSON.parse(savedPlatforms)
        setVisiblePlatforms((prev) => ({ ...prev, ...parsed }))
      }
      const savedTf = localStorage.getItem('ecos-timeframe')
      if (savedTf && typeof savedTf === 'string') {
        setSelectedTimeframe(savedTf)
      }
    } catch {}

    async function fetchMetrics() {
      try {
        const response = await fetch('/api/ecosystem')
        if (!response.ok) {
          throw new Error('Failed to fetch metrics')
        }
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  // Persist preferences
  useEffect(() => {
    try { localStorage.setItem('ecos-x-visibility', JSON.stringify(xStatVisibility)) } catch {}
  }, [xStatVisibility])

  useEffect(() => {
    try { localStorage.setItem('ecos-linkedin-visibility', JSON.stringify(linkedinStatVisibility)) } catch {}
  }, [linkedinStatVisibility])

  useEffect(() => {
    try { localStorage.setItem('ecos-platform-visibility', JSON.stringify(visiblePlatforms)) } catch {}
  }, [visiblePlatforms])

  useEffect(() => {
    try { localStorage.setItem('ecos-timeframe', selectedTimeframe) } catch {}
  }, [selectedTimeframe])

  // Fetch latest X stats from history API (computed series)
  useEffect(() => {
    async function fetchXFollowers() {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const url = origin ? `${origin}/api/x/history` : '/api/x/history'
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const chart = await res.json()
        const followersDataset = chart?.datasets?.find((d: any) => d.label === 'X Followers')
        const impressionsDataset = chart?.datasets?.find((d: any) => d.label === 'X Impressions')
        const engagementsDataset = chart?.datasets?.find((d: any) => d.label === 'X Engagements')
        const likesDataset = chart?.datasets?.find((d: any) => d.label === 'X Likes')

        const getNewestNumber = (arr: any[]) => {
          if (!Array.isArray(arr)) return null
          for (let i = 0; i < arr.length; i++) {
            const v = arr[i]
            if (typeof v === 'number' && !Number.isNaN(v)) return v
          }
          return null
        }

        if (followersDataset) setXLatestFollowers(getNewestNumber(followersDataset.data))
        if (impressionsDataset) setXLatestImpressions(getNewestNumber(impressionsDataset.data))
        if (engagementsDataset) setXLatestEngagements(getNewestNumber(engagementsDataset.data))
        if (likesDataset) setXLatestLikes(getNewestNumber(likesDataset.data))
      } catch (e) {
        console.error('Failed to fetch X followers history', e)
      }
    }
    fetchXFollowers()
  }, [])

  // Fetch latest LinkedIn followers from history API
  useEffect(() => {
    async function fetchLinkedinFollowers() {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const url = origin ? `${origin}/api/linkedin/history` : '/api/linkedin/history'
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const chart = await res.json()
        const followersDataset = chart?.datasets?.find((d: any) => d.label === 'LinkedIn Followers')
        if (followersDataset && Array.isArray(followersDataset.data) && followersDataset.data.length > 0) {
          // find last numeric
          for (let i = followersDataset.data.length - 1; i >= 0; i--) {
            const v = followersDataset.data[i]
            if (typeof v === 'number' && !Number.isNaN(v)) { setLinkedinLatestFollowers(v); break }
          }
        }
      } catch (e) {
        console.error('Failed to fetch LinkedIn followers history', e)
      }
    }
    fetchLinkedinFollowers()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-white">Ecosystem</h1>
          <p className="text-white/60">Performance metrics across our OpenxAI ecosystem</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-white/60">Loading metrics...</div>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-white">Ecosystem</h1>
          <p className="text-white/60">Performance metrics across our OpenxAI ecosystem</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">Error loading metrics: {error}</div>
        </div>
      </div>
    )
  }

  const currentData = metrics.timeframes[selectedTimeframe]
  const latestTf = metrics.timeframes["24h"] ?? currentData
  const previousData = selectedTimeframe === "24h" ? metrics.timeframes["7d"] : 
                     selectedTimeframe === "7d" ? metrics.timeframes["1m"] :
                     selectedTimeframe === "1m" ? metrics.timeframes["3m"] : null

  // Only show YouTube and X for now
  const YOUTUBE_URL = "https://www.youtube.com/channel/UCygoksweDXVIEo8rsp_hiZg"
  const X_URL = "https://x.com/OpenxAINetwork"

  const youtubeSubscribers = latestTf?.platforms?.youtube?.subscribers ?? 0
  const youtubeViews = latestTf?.platforms?.youtube?.views ?? 0

  const platformData = [
    {
      key: "youtube",
      name: "YouTube",
      color: "bg-red-500",
      borderColor: "border-red-500",
      url: YOUTUBE_URL,
      primaryMetric: formatNumber(youtubeSubscribers),
      primaryLabel: "Subscribers",
      secondaryMetric: formatNumber(youtubeViews),
      secondaryLabel: "Views",
    },
    {
      key: "x",
      name: "X (Twitter)",
      color: "bg-black",
      borderColor: "border-gray-600",
      url: X_URL,
      primaryMetric: formatNumber(xLatestFollowers ?? 26083),
      primaryLabel: "Followers",
      secondaryMetric: formatNumber(151958),
      secondaryLabel: "Impressions",
    },
    {
      key: "linkedin",
      name: "LinkedIn",
      color: "bg-blue-600",
      borderColor: "border-blue-600",
      url: "https://www.linkedin.com/company/openxainetwork/posts/?feedView=all",
      primaryMetric: formatNumber(linkedinLatestFollowers ?? 1176),
      primaryLabel: "Followers",
      secondaryMetric: formatNumber(60500),
      secondaryLabel: "Impressions",
    },
    {
      key: "instagram",
      name: "Instagram",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      url: "https://www.instagram.com/openxainetwork/",
      primaryMetric: formatNumber(16),
      primaryLabel: "Followers",
      secondaryMetric: "N/A",
      secondaryLabel: "Posts",
    },
        {
          key: "tiktok",
          name: "TikTok",
          color: "bg-gradient-to-r from-red-500 to-purple-500",
          borderColor: "border-red-500",
          url: "https://www.tiktok.com/@openxai",
          primaryMetric: formatNumber(25),
          primaryLabel: "Followers",
          secondaryMetric: formatNumber(91),
          secondaryLabel: "Likes",
        },
    {
      key: "discord",
      name: "Discord",
      color: "bg-indigo-600",
      borderColor: "border-indigo-600",
      url: "https://discord.gg/pBw389cbtq",
      primaryMetric: formatNumber(4912),
      primaryLabel: "Members",
      secondaryMetric: "N/A",
      secondaryLabel: "Online",
    },
    {
      key: "telegram",
      name: "Telegram",
      color: "bg-blue-500",
      borderColor: "border-blue-500",
      url: "https://t.me/OpenxAINetwork",
      primaryMetric: formatNumber(19283),
      primaryLabel: "Members",
      secondaryMetric: "N/A",
      secondaryLabel: "Messages",
    },
    {
      key: "farcaster",
      name: "Farcaster",
      color: "bg-purple-600",
      borderColor: "border-purple-600",
      url: "https://farcaster.xyz/~/channel/openxai",
      primaryMetric: formatNumber(13),
      primaryLabel: "Followers",
      secondaryMetric: "N/A",
      secondaryLabel: "Casts",
    },
    {
      key: "medium",
      name: "Medium",
      color: "bg-gray-800",
      borderColor: "border-gray-800",
      url: "https://medium.com/openxai",
      primaryMetric: formatNumber(488),
      primaryLabel: "Followers",
      secondaryMetric: "N/A",
      secondaryLabel: "Articles",
    },
    {
      key: "github",
      name: "GitHub",
      color: "bg-gray-900",
      borderColor: "border-gray-900",
      url: "https://github.com/OpenxAI-Network",
      primaryMetric: formatNumber(25),
      primaryLabel: "Stars",
      secondaryMetric: "N/A",
      secondaryLabel: "Forks",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Ecosystem</h1>
        <p className="text-white/60">Performance metrics across our OpenxAI ecosystem</p>
      </div>

      {/* Platform Controls Section */}
      <div className="flex flex-col gap-4">
        {/* Timeframe Selector Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-white/60" />
          <div className="flex gap-2">
            {[
              { value: "24h", label: "24h" },
              { value: "7d", label: "7d" },
              { value: "1m", label: "1m" },
              { value: "3m", label: "3m" },
              { value: "1y", label: "1y" },
            ].map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1F2021]/50 text-white/60 hover:bg-[#1F2021]/70 hover:text-white/80'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

            {/* Platform Toggle Buttons */}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12" style={{ gridAutoRows: '1fr' }}>
              {platformData.map((platform) => {
                // Only platforms with historical graph data should be clickable
                const hasGraphData = ['youtube', 'x', 'linkedin'].includes(platform.key)
                const isActive = visiblePlatforms[platform.key as keyof typeof visiblePlatforms]

                return (
                  <button
                    key={platform.key}
                    onClick={() => hasGraphData ? handlePlatformToggle(platform.key) : null}
                    disabled={!hasGraphData}
                    className={`col-span-2 relative p-2 rounded-md transition-all text-left h-full flex flex-col ${
                      !hasGraphData
                        ? 'bg-[#1F2021]/30 border border-[#454545] opacity-40 cursor-not-allowed'
                        : isActive
                          ? `${platform.color} bg-opacity-20 border ${platform.borderColor}`
                          : 'bg-[#1F2021]/50 border border-[#454545] opacity-60 hover:bg-[#1F2021]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 -m-2 px-2 py-2 rounded-t-md bg-[#141516]/70">
                      <label className={`flex items-center gap-2 ${hasGraphData ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => hasGraphData ? handlePlatformToggle(platform.key) : null}
                          onClick={(e) => e.stopPropagation()}
                          disabled={!hasGraphData}
                        />
                        <span className={`text-xs font-semibold ${hasGraphData ? 'text-white' : 'text-white/40'}`}>{platform.name}</span>
                      </label>
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs transition-colors ${
                          hasGraphData
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        ↗
                      </a>
      </div>

                    <div className="space-y-1 mt-1">
                      {platform.key === 'x' && (
                        <>
                          <label className="flex items-center justify-between gap-2 text-xs text-white/80" onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center gap-2">
                              <input type="checkbox" checked={xStatVisibility.followers} onChange={(e) => setXStatVisibility(prev => ({...prev, followers: e.target.checked}))} onClick={(e) => e.stopPropagation()} />
                              <span className="flex items-center gap-2">Followers<div className="w-2 h-2 rounded-full bg-black" /></span>
                            </span>
                            <span className="font-semibold text-white">{formatNumber(xLatestFollowers ?? 0)}</span>
                          </label>
                          <label className="flex items-center justify-between gap-2 text-xs text-white/80" onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center gap-2">
                              <input type="checkbox" checked={xStatVisibility.impressions} onChange={(e) => setXStatVisibility(prev => ({...prev, impressions: e.target.checked}))} onClick={(e) => e.stopPropagation()} />
                              <span className="flex items-center gap-2">Impressions<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(29, 155, 240)' }} /></span>
                            </span>
                            <span className="font-medium text-white/90">{formatNumber(xLatestImpressions ?? 0)}</span>
                          </label>
                          <label className="flex items-center justify-between gap-2 text-xs text-white/80" onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center gap-2">
                              <input type="checkbox" checked={xStatVisibility.engagements} onChange={(e) => setXStatVisibility(prev => ({...prev, engagements: e.target.checked}))} onClick={(e) => e.stopPropagation()} />
                              <span className="flex items-center gap-2">Engagements<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(255, 99, 132)' }} /></span>
                            </span>
                            <span className="font-medium text-white/90">{formatNumber(xLatestEngagements ?? 0)}</span>
                          </label>
                          <label className="flex items-center justify-between gap-2 text-xs text-white/80" onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center gap-2">
                              <input type="checkbox" checked={xStatVisibility.likes} onChange={(e) => setXStatVisibility(prev => ({...prev, likes: e.target.checked}))} onClick={(e) => e.stopPropagation()} />
                              <span className="flex items-center gap-2">Likes<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(75, 192, 192)' }} /></span>
                            </span>
                            <span className="font-medium text-white/90">{formatNumber(xLatestLikes ?? 0)}</span>
                          </label>
                        </>
                      )}
                      {platform.key !== 'x' && platform.key !== 'linkedin' && (
                        <>
              <div className="flex items-center justify-between">
                            <span className={`text-xs ${hasGraphData ? 'text-white/60' : 'text-white/30'}`}>{platform.primaryLabel}</span>
                            <span className={`text-xs font-semibold ${hasGraphData ? 'text-white' : 'text-white/40'}`}>{platform.primaryMetric}</span>
                  </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${hasGraphData ? 'text-white/60' : 'text-white/30'}`}>{platform.secondaryLabel}</span>
                            <span className={`text-xs font-medium ${hasGraphData ? 'text-white/80' : 'text-white/40'}`}>{platform.secondaryMetric}</span>
                  </div>
                        </>
                      )}
                      {platform.key === 'linkedin' && (
                        <>
                          <label className="flex items-center justify-between gap-2 text-xs text-white/80" onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center gap-2">
                              <input type="checkbox" checked={linkedinStatVisibility.followers} onChange={(e) => setLinkedinStatVisibility(prev => ({...prev, followers: e.target.checked}))} onClick={(e) => e.stopPropagation()} />
                              <span className="flex items-center gap-2">Followers<div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(34, 197, 94)' }} /></span>
                            </span>
                            <span className="font-semibold text-white">{formatNumber(linkedinLatestFollowers ?? 0)}</span>
                          </label>
                        </>
                      )}

                      {platform.key === 'x' && null}
                </div>
              </button>
            )
          })}
              </div>
      </div>

      {/* Unified Ecosystem Performance Chart */}
      <Card className="bg-[#1F2021]/50 border-[#454545]">
        <CardHeader>
          <CardTitle className="text-white">Ecosystem Performance Trends</CardTitle>
          <p className="text-sm text-white/60">Click platform boxes above to toggle data visibility. Y-axis scales dynamically based on visible data.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <UnifiedEcosystemChart 
              selectedTimeframe={selectedTimeframe} 
              visiblePlatforms={visiblePlatforms}
              xStatVisibility={xStatVisibility}
              linkedinStatVisibility={linkedinStatVisibility}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
