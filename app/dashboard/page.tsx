"use client"

import React from "react"
import { Info } from "lucide-react"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Filler,
  Legend
} from 'chart.js'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Filler,
  Legend
)

// Stats for the On-chain Data section
const ON_CHAIN_DATA = [
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "FDV",
    value: "$723K",
    tooltip: "Fully Diluted Valuation"
  },
  {
    label: "Marketcap",
    value: "$20.1K",
    tooltip: "Current market capitalization"
  },
  {
    label: "Staking Rewards",
    value: "3,725%",
    tooltip: "Annual staking reward rate"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  }
]

// Protocol Metrics data
const PROTOCOL_METRICS = [
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "FDV",
    value: "$0.01",
    tooltip: "Fully Diluted Valuation"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  },
  {
    label: "Token Price",
    value: "$0.01",
    tooltip: "Current token price in USD"
  }
]

// Render metric component
const MetricItem = ({ stat }: { stat: typeof ON_CHAIN_DATA[0] }) => (
  <div>
    <div className="flex items-center gap-2">
      <div className="text-3xl font-bold text-white">{stat.value}</div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="size-4 text-[#6A6A6A]" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{stat.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div className="text-sm text-[#6A6A6A]">{stat.label}</div>
  </div>
)

// Donut chart data
const DONUT_DATA = {
  totalTokens: "$22,870",
  segments: [
    { color: "#FF00FF", percentage: 25 },
    { color: "#3384FF", percentage: 35 },
    { color: "#00FF94", percentage: 30 },
    { color: "#FFFF00", percentage: 10 }
  ]
}

// Line chart data
const LINE_CHART_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Food',
      data: [10000, 15000, 20000, 25000, 22000, 20000, 18000, 15000, 12000, 10000, 8000, 9000],
      borderColor: '#3384FF',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(51, 132, 255, 0.1)'
    },
    {
      label: 'Salary',
      data: [8000, 12000, 18000, 22000, 20000, 18000, 15000, 12000, 10000, 8000, 7000, 8000],
      borderColor: '#FF00FF',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(255, 0, 255, 0.1)'
    }
  ]
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6A6A6A',
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      max: 30000,
      grid: {
        color: 'rgba(106, 106, 106, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#6A6A6A',
        callback: function(value: any) {
          return `${value/1000}k`
        },
        font: {
          size: 12
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
} as const

export default function DashboardPage() {
  return (
    <MobileResponsiveWrapper>
      {/* Top Split Cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* On-chain Data Card - Left */}
        <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
          <h2 className="mb-4 text-lg font-bold">
            <span className="bg-gradient-to-r from-white to-[#00FF94] bg-clip-text text-transparent">
              On-chain Data
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {ON_CHAIN_DATA.map((stat, index) => (
              <MetricItem key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Protocol Metrics Card - Right */}
        <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
          <h2 className="mb-4 text-lg font-bold">
            <span className="bg-gradient-to-r from-white to-[#3384FF] bg-clip-text text-transparent">
              Protocol Metrics
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {PROTOCOL_METRICS.map((stat, index) => (
              <MetricItem key={index} stat={stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Full Width On-chain Data Card */}
      <div className="mb-4 rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-4 text-lg font-bold">
          <span className="bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent">
            On-chain Data
          </span>
        </h2>
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
            {/* Left side - Stats */}
            <div className="md:hidden">
              {/* Mobile: Label-value pairs stacked */}
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <div className="text-sm text-[#6A6A6A]">Number of Delegated Checker License</div>
                  <div className="text-3xl font-bold text-white">3,725%</div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">Number of Delegated Checker License</div>
                  <div className="text-3xl font-bold text-white">3,725%</div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">Token Price</div>
                  <div className="text-3xl font-bold text-white">3,725%</div>
                </div>
              </div>
            </div>

            <div className="hidden md:grid md:gap-8">
              {/* Desktop: Row-column layout */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-sm text-[#6A6A6A]">Number of Delegated Checker License</div>
                <div className="text-sm text-[#6A6A6A]">Number of Delegated Checker License</div>
                <div className="text-sm text-[#6A6A6A]">Token Price</div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-3xl font-bold text-white">3,725%</div>
                <div className="text-3xl font-bold text-white">3,725%</div>
                <div className="text-3xl font-bold text-white">3,725%</div>
              </div>
            </div>

          {/* Right side - Logos */}
          <div className="relative">
            {/* All logos in a single grid */}
            <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {[...Array(24)].map((_, i) => (
                <Image
                  key={`logo-${i}`}
                  src="/logo/openxai-logo-icon-light.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ))}
            </div>
            {/* 20+ text positioned absolutely */}
            <div className="absolute bottom-0 right-0 bg-[#1F2021]/50 pl-4 pt-4">
              <span className="text-white">20+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tokenomics & Treasury Card */}
      <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-4 text-lg font-bold">
          <span className="bg-gradient-to-r from-white to-[#00FF94] bg-clip-text text-transparent">
            Tokenomics & Treasury
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Donut Chart - 1/3 width */}
          <div className="relative flex aspect-square items-center justify-center">
            <div className="absolute inset-[7.5%]"> {/* This creates the 15% reduction */}
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                {DONUT_DATA.segments.map((segment, index) => {
                  const prevPercentages = DONUT_DATA.segments
                    .slice(0, index)
                    .reduce((acc, curr) => acc + curr.percentage, 0)
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="20"
                      strokeDasharray={`${segment.percentage} 100`}
                      strokeDashoffset={-prevPercentages}
                      pathLength="100"
                      className="transition-all duration-1000 ease-in-out"
                    />
                  )
                })}
              </svg>
            </div>
            <div className="z-10 text-center">
              <div className="text-2xl font-bold text-white">{DONUT_DATA.totalTokens}</div>
              <div className="text-sm text-[#6A6A6A]">Total Tokens</div>
            </div>
          </div>
          
          {/* Line Chart Column - 2/3 width */}
          <div className="col-span-2 flex flex-col pl-4">
            {/* Legend - Absolutely centered */}
            <div className="mb-8 flex w-full items-center justify-center">
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-[#3384FF]" />
                  <span className="text-white">Food</span>
                  <span className="ml-2 text-white">$12,400</span>
                </div>
                <div className="mx-12" /> {/* Fixed spacing between items */}
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-[#FF00FF]" />
                  <span className="text-white">Salary</span>
                  <span className="ml-2 text-white">$500,000</span>
                </div>
              </div>
            </div>
            {/* Line Chart */}
            <div className="h-[400px]">
              <Line options={chartOptions} data={LINE_CHART_DATA} />
            </div>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}
    