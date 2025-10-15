"use client"

import React, { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Mock data for social media metrics
const SOCIAL_METRICS = [
  {
    label: "Total Followers",
    value: "132.3K",
    change: "+4.2%",
    icon: <Users className="size-5" />,
    color: "bg-purple-500",
  },
  {
    label: "Total Views",
    value: "1.09M",
    change: "+8.1%",
    icon: <Eye className="size-5" />,
    color: "bg-blue-500",
  },
  {
    label: "Total Engagement",
    value: "3.2K",
    change: "+12.5%",
    icon: <Heart className="size-5" />,
    color: "bg-pink-500",
  },
  {
    label: "Total Clicks",
    value: "12.4K",
    change: "+6.8%",
    icon: <TrendingUp className="size-5" />,
    color: "bg-green-500",
  },
]

// Platform breakdown data
const PLATFORM_DATA = [
  {
    name: "X (Twitter)",
    metricsCount: 2,
    color: "bg-black",
    metrics: [
      { label: "Followers", value: "15.4K", change: "+4.2%" },
      { label: "Engagement Rate", value: "4.2", change: "+10.5%" },
    ],
  },
  {
    name: "Instagram",
    metricsCount: 2,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    metrics: [
      { label: "Followers", value: "28.8K", change: "+5.7%" },
      { label: "Likes", value: "3.2K", change: "+9.8%" },
    ],
  },
  {
    name: "YouTube",
    metricsCount: 2,
    color: "bg-red-500",
    metrics: [
      { label: "Subscribers", value: "12.3K", change: "+3.8%" },
      { label: "Views", value: "145.6K", change: "+4.8%" },
    ],
  },
  {
    name: "TikTok",
    metricsCount: 2,
    color: "bg-gradient-to-r from-red-500 to-purple-500",
    metrics: [
      { label: "Followers", value: "45.8K", change: "+8.3%" },
      { label: "Views", value: "892.0K", change: "+18.0%" },
    ],
  },
  {
    name: "Facebook",
    metricsCount: 1,
    color: "bg-blue-600",
    metrics: [
      { label: "Followers", value: "18.6K", change: "+1.2%" },
    ],
  },
  {
    name: "Discord",
    metricsCount: 1,
    color: "bg-indigo-600",
    metrics: [
      { label: "Members", value: "3.4K", change: "+7.5%" },
    ],
  },
]

// Performance trends chart data
const PERFORMANCE_TRENDS_DATA = {
  labels: [
    "Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7", 
    "Jan 8", "Jan 9", "Jan 10", "Jan 11", "Jan 12", "Jan 13", "Jan 14", "Jan 15"
  ],
  datasets: [
    {
      label: "value",
      data: [25000, 30000, 45000, 35000, 60000, 55000, 70000, 85000, 90000, 75000, 80000, 65000, 70000, 75000, 80000],
      borderColor: "#8B5CF6",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#8B5CF6",
      pointBorderColor: "#8B5CF6",
      pointRadius: 4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
      },
    },
    y: {
      beginAtZero: true,
      max: 100000,
      grid: {
        color: "rgba(106, 106, 106, 0.1)",
      },
      ticks: {
        color: "#6A6A6A",
        callback: function (value: any) {
          return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
        },
        font: {
          size: 12,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: {
        color: "#FFFFFF",
        font: {
          size: 14,
        },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
    },
  },
}

export default function EcosystemPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white">Ecosystem</h1>
        <p className="text-white/60">Performance metrics across our OpenxAI ecosystem</p>
      </div>

      {/* Controls Section */}
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-white/60" />
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[140px] bg-[#1F2021]/50 border-[#454545] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1F2021] border-[#454545]">
                <SelectItem value="24h" className="text-white hover:bg-[#2A2A2A]">24 Hours</SelectItem>
                <SelectItem value="7d" className="text-white hover:bg-[#2A2A2A]">7 Days</SelectItem>
                <SelectItem value="1m" className="text-white hover:bg-[#2A2A2A]">1 Month</SelectItem>
                <SelectItem value="3m" className="text-white hover:bg-[#2A2A2A]">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SOCIAL_METRICS.map((metric, index) => (
          <Card key={index} className="bg-[#1F2021]/50 border-[#454545]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-green-400">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Trends Chart */}
      <Card className="bg-[#1F2021]/50 border-[#454545]">
        <CardHeader>
          <CardTitle className="text-white">Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Line data={PERFORMANCE_TRENDS_DATA} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-5 text-white" />
          <h2 className="text-2xl font-bold text-white">Platform Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_DATA.map((platform, index) => (
            <Card key={index} className="bg-[#1F2021]/50 border-[#454545] hover:bg-[#1F2021]/70 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                    <p className="text-sm text-white/60">{platform.metricsCount} metrics tracked</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                </div>
                <div className="space-y-3">
                  {platform.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">{metric.label}</p>
                        <p className="text-lg font-semibold text-white">{metric.value}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-3 text-green-400" />
                        <span className="text-sm text-green-400">{metric.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
