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
type YouTubeStatVisibility = { subscribers: boolean }
type TikTokStatVisibility = { followers: boolean; likes: boolean; videoViews: boolean; profileViews: boolean }

function UnifiedEcosystemChart({ selectedTimeframe, visiblePlatforms, xStatVisibility, linkedinStatVisibility, tiktokStatVisibility, youtubeStatVisibility }: { 
  selectedTimeframe: string
  visiblePlatforms: { [key: string]: boolean }
  xStatVisibility: { followers: boolean; impressions: boolean; engagements: boolean; likes: boolean }
  linkedinStatVisibility: { followers: boolean }
  tiktokStatVisibility: { followers: boolean; likes: boolean; videoViews: boolean; profileViews: boolean }
  youtubeStatVisibility: { subscribers: boolean }
}) {
  const [youtubeData, setYoutubeData] = useState<any>(null)
  const [xData, setXData] = useState<any>(null)
  const [linkedinData, setLinkedinData] = useState<any>(null)
  const [tiktokData, setTikTokData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to filter data based on timeframe
  const filterDataByTimeframe = useCallback((data: any, timeframe: string, anchorMostRecent?: Date) => {
    if (!data || !data.labels || !data.datasets) return null

    // Filter relative to a shared most-recent date across all platforms when provided
    const availableDates = data.labels.map((label: string) => new Date(label))
    const datasetMostRecent = new Date(Math.max(...availableDates.map((d: Date) => d.getTime())))
    const mostRecentDate = anchorMostRecent ?? datasetMostRecent
    
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
        const [youtubeRes, xRes, linkedinRes, tiktokRes] = await Promise.allSettled([
          fetch(origin ? `${origin}/api/youtube/history` : '/api/youtube/history', { cache: 'no-store' }),
          fetch(origin ? `${origin}/api/x/history` : '/api/x/history', { cache: 'no-store' }),
          fetch(origin ? `${origin}/api/linkedin/history` : '/api/linkedin/history', { cache: 'no-store' }),
          fetch(origin ? `${origin}/api/tiktok/history` : '/api/tiktok/history', { cache: 'no-store' })
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
        if (tiktokRes.status === 'fulfilled' && tiktokRes.value.ok) {
          setTikTokData(await tiktokRes.value.json())
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

  // Determine a shared most-recent date across all platforms to align the window
  const mostRecentCandidates: Date[] = []
  ;[youtubeData, xData, linkedinData, tiktokData].forEach((d: any) => {
    if (d?.labels?.length) {
      const dates = d.labels.map((label: string) => new Date(label))
      const mr = new Date(Math.max(...dates.map((dt: Date) => dt.getTime())))
      if (!Number.isNaN(mr.getTime())) mostRecentCandidates.push(mr)
    }
  })
  const sharedMostRecent = mostRecentCandidates.length
    ? new Date(Math.max(...mostRecentCandidates.map((d: Date) => d.getTime())))
    : undefined

  // Filter data based on selected timeframe (using shared anchor date)
  const filteredYoutubeData = filterDataByTimeframe(youtubeData, selectedTimeframe, sharedMostRecent)
  const filteredXData = filterDataByTimeframe(xData, selectedTimeframe, sharedMostRecent)
  const filteredLinkedinData = filterDataByTimeframe(linkedinData, selectedTimeframe, sharedMostRecent)
  const filteredTikTokData = filterDataByTimeframe(tiktokData, selectedTimeframe, sharedMostRecent)

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
  if (filteredTikTokData?.labels) {
    filteredTikTokData.labels.forEach((date: string) => allDates.add(date))
  }
  
  // Sort dates chronologically
  labels = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Map each platform's data to the unified timeline (single primary metric only)
  if (filteredYoutubeData?.labels?.length > 0 && visiblePlatforms.youtube) {
    const dataset = filteredYoutubeData.datasets.find((d: any) => d.label === 'YouTube Subscribers')
    if (dataset) {
      const alignedData = labels.map((label: string) => {
        const youtubeIndex = filteredYoutubeData.labels.indexOf(label)
        return youtubeIndex >= 0 ? dataset.data[youtubeIndex] : null
      })
      let lastKnown: number | null = null
      for (let i = 0; i < alignedData.length; i++) {
        const v = alignedData[i]
        if (v == null && lastKnown != null) alignedData[i] = lastKnown
        else if (typeof v === 'number') lastKnown = v
      }
      let firstNonNull: number | null = null
      for (let i = 0; i < alignedData.length; i++) {
        if (typeof alignedData[i] === 'number') { firstNonNull = alignedData[i] as number; break }
      }
      if (firstNonNull != null) {
        for (let i = 0; i < alignedData.length && alignedData[i] == null; i++) alignedData[i] = firstNonNull
      }
      datasets.push({
        ...dataset,
        data: alignedData,
        fill: true,
        hidden: !visiblePlatforms.youtube,
      })
    }
  }

  if (filteredXData?.labels?.length > 0 && visiblePlatforms.x) {
    const dataset = filteredXData.datasets.find((d: any) => d.label === 'X Followers')
    if (dataset) {
      const alignedData = labels.map((label: string) => {
        const xIndex = filteredXData.labels.indexOf(label)
        return xIndex >= 0 ? dataset.data[xIndex] : null
      })
      let lastKnown: number | null = null
      for (let i = 0; i < alignedData.length; i++) {
        const v = alignedData[i]
        if (v == null && lastKnown != null) alignedData[i] = lastKnown
        else if (typeof v === 'number') lastKnown = v
      }
      let firstNonNull: number | null = null
      for (let i = 0; i < alignedData.length; i++) {
        if (typeof alignedData[i] === 'number') { firstNonNull = alignedData[i] as number; break }
      }
      if (firstNonNull != null) {
        for (let i = 0; i < alignedData.length && alignedData[i] == null; i++) alignedData[i] = firstNonNull
      }
      datasets.push({
        ...dataset,
        data: alignedData,
        hidden: !visiblePlatforms.x,
      })
    }
  }

  if (filteredLinkedinData?.labels?.length > 0 && visiblePlatforms.linkedin) {
    const dataset = filteredLinkedinData.datasets.find((d: any) => d.label === 'LinkedIn Followers')
    if (dataset) {
      const alignedData = labels.map((label: string) => {
        const linkedinIndex = filteredLinkedinData.labels.indexOf(label)
        return linkedinIndex >= 0 ? dataset.data[linkedinIndex] : null
      })
      {
        let last: number | null = null
        for (let i = 0; i < alignedData.length; i++) {
          const v = alignedData[i]
          if (v == null && last != null) alignedData[i] = last
          else if (typeof v === 'number') last = v
        }
        let first: number | null = null
        for (let i = 0; i < alignedData.length; i++) if (typeof alignedData[i] === 'number') { first = alignedData[i] as number; break }
        if (first != null) for (let i = 0; i < alignedData.length && alignedData[i] == null; i++) alignedData[i] = first
      }
      datasets.push({
        ...dataset,
        data: alignedData,
        hidden: !visiblePlatforms.linkedin,
      })
    }
  }

  if (filteredTikTokData?.labels?.length > 0 && visiblePlatforms.tiktok) {
    const dataset = filteredTikTokData.datasets.find((d: any) => d.label === 'TikTok Followers')
    if (dataset) {
      const alignedData = labels.map((label: string) => {
        const idx = filteredTikTokData.labels.indexOf(label)
        return idx >= 0 ? dataset.data[idx] : null
      })
      {
        let last: number | null = null
        for (let i = 0; i < alignedData.length; i++) {
          const v = alignedData[i]
          if (v == null && last != null) alignedData[i] = last
          else if (typeof v === 'number') last = v
        }
        let first: number | null = null
        for (let i = 0; i < alignedData.length; i++) if (typeof alignedData[i] === 'number') { first = alignedData[i] as number; break }
        if (first != null) for (let i = 0; i < alignedData.length && alignedData[i] == null; i++) alignedData[i] = first
      }
      datasets.push({
        ...dataset,
        fill: true,
        data: alignedData,
        hidden: !visiblePlatforms.tiktok,
      })
    }
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
      spanGaps: true,
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
    if (typeof window === 'undefined') return "1m"
    const tf = localStorage.getItem('ecos-timeframe')
    return tf || "1m"
  })
  const [metrics, setMetrics] = useState<EcosystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [xLatestFollowers, setXLatestFollowers] = useState<number | null>(null)
  const [xLatestImpressions, setXLatestImpressions] = useState<number | null>(null)
  const [xLatestEngagements, setXLatestEngagements] = useState<number | null>(null)
  const [xLatestLikes, setXLatestLikes] = useState<number | null>(null)
  const [linkedinLatestFollowers, setLinkedinLatestFollowers] = useState<number | null>(null)
  const [youtubeLatestSubscribers, setYoutubeLatestSubscribers] = useState<number | null>(null)
  const [youtubeStatVisibility, setYoutubeStatVisibility] = useState<YouTubeStatVisibility>(() => {
    if (typeof window === 'undefined') return { subscribers: true }
    try {
      const saved = localStorage.getItem('ecos-youtube-visibility')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { subscribers: true }
  })
  const [tiktokStatVisibility, setTiktokStatVisibility] = useState<TikTokStatVisibility>(() => {
    if (typeof window === 'undefined') return { followers: true, likes: false, videoViews: false, profileViews: false }
    try {
      const saved = localStorage.getItem('ecos-tiktok-visibility')
      if (saved) return JSON.parse(saved)
    } catch {}
    return { followers: true, likes: false, videoViews: false, profileViews: false }
  })
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
      tiktok: true,
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

  // Carousel window index for top platform cards
  const [startIndex, setStartIndex] = useState<number>(0) // start at 0 so first is YouTube
  const shiftWindow = (delta: number) => {
    const total = platformData.length
    setStartIndex((prev) => (prev + delta + total) % total)
  }

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
      const savedTiktok = localStorage.getItem('ecos-tiktok-visibility')
      const savedYoutube = localStorage.getItem('ecos-youtube-visibility')
      if (savedLinkedin) {
        const parsed = JSON.parse(savedLinkedin)
        setLinkedinStatVisibility((prev) => ({
          followers: typeof parsed.followers === 'boolean' ? parsed.followers : prev.followers,
        }))
      }
      if (savedYoutube) {
        const parsed = JSON.parse(savedYoutube)
        setYoutubeStatVisibility((prev) => ({
          subscribers: typeof parsed.subscribers === 'boolean' ? parsed.subscribers : prev.subscribers,
        }))
      }
      if (savedTiktok) {
        const parsed = JSON.parse(savedTiktok)
        // Migration: ensure only followers is selected by default
        setTiktokStatVisibility({
          followers: typeof parsed.followers === 'boolean' ? parsed.followers : true,
          likes: false,
          videoViews: false,
          profileViews: false,
        })
      }
      if (savedPlatforms) {
        const parsed = JSON.parse(savedPlatforms)
        // Migration: ensure TikTok is visible by default even if an older pref had it off
        if (parsed && typeof parsed === 'object') {
          parsed.tiktok = true
        }
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
    try { localStorage.setItem('ecos-youtube-visibility', JSON.stringify(youtubeStatVisibility)) } catch {}
  }, [youtubeStatVisibility])

  useEffect(() => {
    try { localStorage.setItem('ecos-tiktok-visibility', JSON.stringify(tiktokStatVisibility)) } catch {}
  }, [tiktokStatVisibility])


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

  // Fetch latest YouTube stats from history API
  useEffect(() => {
    async function fetchYouTubeSubscribers() {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const url = origin ? `${origin}/api/youtube/history` : '/api/youtube/history'
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const chart = await res.json()
        const subscribersDataset = chart?.datasets?.find((d: any) => d.label === 'YouTube Subscribers')
        if (subscribersDataset && Array.isArray(subscribersDataset.data) && subscribersDataset.data.length > 0) {
          // find last numeric value
          for (let i = subscribersDataset.data.length - 1; i >= 0; i--) {
            const v = subscribersDataset.data[i]
            if (typeof v === 'number' && !Number.isNaN(v)) { setYoutubeLatestSubscribers(v); break }
          }
        }
      } catch (e) {
        console.error('Failed to fetch YouTube subscribers history', e)
      }
    }
    fetchYouTubeSubscribers()
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
      primaryMetric: formatNumber(youtubeLatestSubscribers ?? 0),
      primaryLabel: "Subscribers",
      secondaryMetric: "N/A",
      secondaryLabel: "Videos",
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
      <div className="flex flex-col gap-3">
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

            {/* Platform Toggle Buttons (single row carousel with 4 cards) */}
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => shiftWindow(-1)}
                className="shrink-0 h-14 w-7 flex items-center justify-center rounded-md bg-[#1F2021]/60 border border-[#454545] text-white/70 hover:text-white"
                aria-label="Previous platforms"
              >
                ‹
              </button>
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-nowrap gap-2 w-full">
              {Array.from({ length: 4 }).map((_, i) => {
                const platform = platformData[(startIndex + i) % platformData.length]
                // Only platforms with historical graph data should be clickable
                const hasGraphData = ['youtube', 'x', 'linkedin', 'tiktok'].includes(platform.key)
                const isActive = visiblePlatforms[platform.key as keyof typeof visiblePlatforms]

                return (
                  <button
                    key={platform.key}
                    onClick={() => hasGraphData ? handlePlatformToggle(platform.key) : null}
                    disabled={!hasGraphData}
                    className={`relative p-2 rounded-md transition-all text-left flex flex-col h-14 basis-1/4 shrink-0 ${
                      !hasGraphData
                        ? 'bg-[#1F2021]/30 border border-[#454545] opacity-40 cursor-not-allowed'
                        : isActive
                          ? `bg-[#1F2021]/60 border ${platform.borderColor}`
                          : 'bg-[#1F2021]/50 border border-[#454545] opacity-60 hover:bg-[#1F2021]/70'
                    }`}
                  >
                    {/* corner link triangle */}
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 size-8 rounded-tr-md overflow-hidden"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
                      }}
                      aria-label={`${platform.name} link`}
                    >
                      <span className="absolute right-1 top-0.5 text-[10px] text-white/85">↗</span>
                    </a>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-[10px] text-white/70 leading-none">{platform.name}</div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <div className="text-lg font-semibold text-white leading-none">
                          {platform.key === 'youtube' ? formatNumber(youtubeLatestSubscribers ?? 0)
                            : platform.key === 'x' ? formatNumber(xLatestFollowers ?? 0)
                            : platform.key === 'linkedin' ? formatNumber(linkedinLatestFollowers ?? 0)
                            : platform.primaryMetric}
                        </div>
                        <div className="text-[10px] text-white/60 leading-none">
                          {platform.key === 'youtube' ? 'Subscribers' : 'Followers'}
                        </div>
                      </div>
                    </div>
              </button>
            )
          })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => shiftWindow(1)}
                className="shrink-0 h-14 w-7 flex items-center justify-center rounded-md bg-[#1F2021]/60 border border-[#454545] text-white/70 hover:text-white"
                aria-label="Next platforms"
              >
                ›
              </button>
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
          tiktokStatVisibility={tiktokStatVisibility}
          youtubeStatVisibility={youtubeStatVisibility}
        />
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown (responsive grid, calculated for selected timeframe) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-3 items-stretch mb-8">
        {platformData.map((p) => {
          const curr = currentData?.platforms?.[p.key] as any
          const prev = previousData?.platforms?.[p.key] as any
          if (!curr) {
            // Fallback to static metrics provided in platformData
            return (
              <div key={`breakdown-${p.key}`} className="relative bg-[#1F2021]/50 border border-[#454545] rounded-md p-3 h-28 flex flex-col">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-0 top-0 size-8 rounded-tr-md overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)', clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                  aria-label={`${p.name} link`}
                >
                  <span className="absolute right-1 top-0.5 text-[10px] text-white/85">↗</span>
                </a>
                <div className="flex items-center justify-between mb-2 pr-7">
                  <div className="text-sm text-white/80">{p.name}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <div className="text-white text-sm font-medium">{p.primaryMetric}</div>
                      <div className="text-[11px] text-white/60">{p.primaryLabel}</div>
                    </div>
                    <div className="text-xs text-white/40">N/A</div>
                  </div>
                  {p.secondaryMetric !== 'N/A' && (
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <div className="text-white text-sm font-medium">{p.secondaryMetric}</div>
                        <div className="text-[11px] text-white/60">{p.secondaryLabel}</div>
                      </div>
                      <div className="text-xs text-white/40">N/A</div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          const metricsToShow: Array<{ label: string; key: 'subscribers' | 'followers' | 'members' | 'likes' | 'views'; value: number | undefined; prev: number | undefined }>
            = []
          const pushIf = (label: string, key: any) => {
            if (typeof curr?.[key] === 'number') metricsToShow.push({ label, key, value: curr[key], prev: typeof prev?.[key] === 'number' ? prev[key] : undefined })
          }
          if (p.key === 'youtube') {
            pushIf('Subscribers', 'subscribers')
            pushIf('Views', 'views')
          } else if (p.key === 'x' || p.key === 'linkedin' || p.key === 'farcaster' || p.key === 'medium' || p.key === 'github' || p.key === 'instagram' || p.key === 'tiktok') {
            pushIf('Followers', 'followers')
            pushIf('Likes', 'likes')
            pushIf('Views', 'views')
          } else if (p.key === 'discord' || p.key === 'telegram') {
            pushIf('Members', 'members')
          }

          const formatChange = (val?: number, prevVal?: number) => {
            if (typeof val !== 'number' || typeof prevVal !== 'number') return 'N/A'
            const prevNonZero = prevVal === 0 ? 1 : prevVal
            const deltaPct = ((val - prevNonZero) / prevNonZero) * 100
            const pct = Math.abs(deltaPct).toFixed(1) + '%'
            const up = deltaPct >= 0
            return `${up ? '↗' : '↘'} ${pct}`
          }

          return (
              <div key={`breakdown-${p.key}`} className="relative bg-[#1F2021]/50 border border-[#454545] rounded-md p-3 h-28 flex flex-col">
              {/* Corner link triangle */}
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-0 top-0 size-8 rounded-tr-md overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                aria-label={`${p.name} link`}
              >
                <span className="absolute right-1 top-0.5 text-[10px] text-white/85">↗</span>
              </a>
              <div className="flex items-center justify-between mb-2 pr-7">
                <div className="text-base font-semibold text-white/90">{p.name}</div>
              </div>
              <div className="space-y-2">
                {metricsToShow.slice(0, 3).map((m) => (
                  <div key={`${p.key}-${m.key}`} className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <div className="text-white text-sm font-medium">{formatNumber(m.value ?? 0)}</div>
                      <div className="text-[11px] text-white/60">{m.label}</div>
                    </div>
                    <div className={`text-xs ${typeof m.prev === 'number' && typeof m.value === 'number' && (m.value - (m.prev === 0 ? 1 : m.prev)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatChange(m.value, m.prev)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
