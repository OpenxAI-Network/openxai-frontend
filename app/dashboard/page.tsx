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
    value: "$0.02",
    tooltip: "Token Price (USD)"
  },
  {
    label: "Exchange Rate (ETH / OPENX)",
    value: "1,476,947(-78%)",
    tooltip: "1 ETH = 1,476,947 OPENX"
  },
  {
    label: "Marketcap",
    value: "$20K",
    tooltip: "Current market capitalization"
  },
  {
    label: "FDV",
    value: "2M",
    tooltip: "Fully Diluted Valuation"
  },
  {
    label: "Staking Rewards",
    value: "1,578.34%",
    tooltip: "Staking rewards"
  },
  {
    label: "Softcap",
    value: "$500k",
    tooltip: "Softcap"
  }
]

// Protocol Metrics data
const PROTOCOL_METRICS = [
  {
    label: "AI Models Hosted",
    value: "46",
    tooltip: "Number of distinct AI models available on the OpenxAI platform."
  },
  {
    label: "Total Compute Power (FLOPS/TPUs)",
    value: "24K",
    tooltip: "Aggregate compute power available on the OpenxAI network."
  },
  {
    label: "Cost per Compute Hour (CPC)",
    value: "$0.008",
    tooltip: "The cost of running AI computations on OpenxAI compared to traditional cloud providers (AWS, GCP, Azure)."
  },
  {
    label: "Average Deployment Speed",
    value: "4 mins",
    tooltip: "Average time taken to deploy an AI model from upload to operational status."
  },
  {
    label: "Censorship Resilience Rate (CRR)",
    value: "82%",
    tooltip: "Percentage of models immune to takedown by centralized authorities."
  },
  {
    label: "No. of DAO Proposals",
    value: "21",
    tooltip: "Total number of governance proposals submitted by the OpenxAI community."
  }
]

// Render metric component
const MetricItem = ({ stat }: { stat: typeof ON_CHAIN_DATA[0] }) => (
  <div>
    <div className="flex items-center gap-2">
      <div className="text-2xl font-bold text-white">{stat.value}</div>
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
    { color: "#3384FF", percentage: 46, label: "OpenxAI Protocol and Ecosystem Development" },
    { color: "#00FF94", percentage: 18, label: "Core Protocol, Infrastructure & Future Expansions" },
    { color: "#FF00FF", percentage: 24, label: "Community & Governance" },
    { color: "#FFFF00", percentage: 12, label: "Genesis Event" }
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
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,  // Enable stacking on x-axis
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
      stacked: true,  // Enable stacking on y-axis
      beginAtZero: true,
      max: 100, // Force max to 100%
      grid: {
        color: 'rgba(106, 106, 106, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#6A6A6A',
        callback: function(value: any) {
          return `${value}%`
        },
        font: {
          size: 12
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const
    }
  }
} as const

export default function DashboardPage() {
  // Add state to track which segment is active
  const [activeSegment, setActiveSegment] = React.useState<number | null>(null);

  return (
    <MobileResponsiveWrapper>
      {/* Top Split Cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* On-chain Data Card - Left */}
        <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
          <h2 className="mb-4 text-2xl font-bold">
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
          <h2 className="mb-4 text-2xl font-bold">
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

{/* Decentralized Infrastructure Card */}
<div className="mb-8 rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
  <h2 className="mb-6 text-2xl font-bold">
    <span className="bg-gradient-to-r from-[#B18686] to-[#DEB887] bg-clip-text text-transparent">
      Decentralized Infrastructure
    </span>
  </h2>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
    {/* First Row */}
    <MetricItem stat={{
      label: "Cost per Compute Hour (CPC)",
      value: "$0.12",
      tooltip: "Cost per Compute Hour"
    }} />

    <MetricItem stat={{
      label: "Cost per Data Storage TB (CPSD)",
      value: "$0.002",
      tooltip: "Cost per Data Storage TB"
    }} />

    <MetricItem stat={{
      label: "Data Retrieval Cost (DRC)",
      value: "$0.02",
      tooltip: "Data Retrieval Cost"
    }} />

    {/* Second Row */}
    <MetricItem stat={{
      label: "Available GPUs",
      value: "335 G/F",
      tooltip: "Total Available GPUs"
    }} />

    <MetricItem stat={{
      label: "Available Memory",
      value: "26 PB",
      tooltip: "Total Available Memory"
    }} />

    <MetricItem stat={{
      label: "Available Bandwidth",
      value: "900 PB",
      tooltip: "Total Available Bandwidth"
    }} />

    {/* Third Row */}
    <MetricItem stat={{
      label: "Bare Metal Providers",
      value: "32",
      tooltip: "Number of Bare Metal Providers"
    }} />

    <MetricItem stat={{
      label: "Cities & Regions",
      value: "482",
      tooltip: "Number of Cities & Regions"
    }} />

    <MetricItem stat={{
      label: "No. of DAO Proposals",
      value: "21",
      tooltip: "Number of DAO Proposals"
    }} />
  </div>

  <div className="mt-6">
    <button className="text-[#6A6A6A] hover:text-white">
      Becoming a provider +
    </button>
  </div>
</div>

      {/* Full Width AI Infrastructure Card */}
      <div className="mb-4 rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-4 text-2xl font-bold">
          <span className="bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent">
            AI Infrastructure
          </span>
        </h2>
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
            {/* Left side - Stats */}
            <div className="md:hidden">
              {/* Mobile: Label-value pairs stacked */}
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Model Accessibility Index (AMAI)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">10/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Measure of how many developers globally can access advanced AI models via OpenxAI without permission.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Model Privacy Score (MPS)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">9.2/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of models run without user data exposure.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Cost Reduction Ratio (ACRR)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">9.3/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of cost savings running top open-source AI models on OpenxAI vs. centralized platforms.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">User Savings Index (USI)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">8.5/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average annual savings per user.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              {/* Desktop: 4 columns in 2x2 grid within 50% width */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Model Accessibility Index (AMAI)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">10/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Measure of how many developers globally can access advanced AI models via OpenxAI without permission.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Model Privacy Score (MPS)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">9.2/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of models run without user data exposure.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">AI Cost Reduction Ratio (ACRR)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">9.3/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of cost savings running top open-source AI models on OpenxAI vs. centralized platforms.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#6A6A6A]">User Savings Index (USI)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-white">8.5/10</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-4 text-[#6A6A6A]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average annual savings per user.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
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

      {/* Tokenomics, Treasury & Vesting Card */}
      <div className="rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-4 text-2xl font-bold">
          <span className="bg-gradient-to-r from-white to-[#00FF94] bg-clip-text text-transparent">
            Tokenomics, Treasury & Vesting
          </span>
        </h2>
        
      {/* Row 1: 1/3 for donut and 2/3 for text, stacking on mobile */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Column 1: Donut Chart - taking 1/3 width */}
        <div className="flex items-center justify-center py-6">
          <div className="relative aspect-square w-[95%] max-w-[400px]">
            <div className="absolute inset-[7.5%]"> {/* This creates the 15% reduction */}
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                {/* First segment - OpenxAI Protocol and Ecosystem Development */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3384FF"
                  strokeWidth="20"
                  strokeDasharray="46 100"
                  strokeDashoffset="0"
                  pathLength="100"
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  className={`transition-all duration-300 ${activeSegment === 0 ? 'stroke-[#3384FF] opacity-100' : 'opacity-70'}`}
                  onMouseEnter={() => setActiveSegment(0)}
                  onMouseLeave={() => setActiveSegment(null)}
                  onClick={() => setActiveSegment(activeSegment === 0 ? null : 0)}
                />
                {/* Second segment - Core Protocol, Infrastructure & Future Expansions */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#00FF94"
                  strokeWidth="20"
                  strokeDasharray="18 100"
                  strokeDashoffset="-46"
                  pathLength="100"
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  className={`transition-all duration-300 ${activeSegment === 1 ? 'stroke-[#00FF94] opacity-100' : 'opacity-70'}`}
                  onMouseEnter={() => setActiveSegment(1)}
                  onMouseLeave={() => setActiveSegment(null)}
                  onClick={() => setActiveSegment(activeSegment === 1 ? null : 1)}
                />
                {/* Third segment - Community & Governance */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FF00FF"
                  strokeWidth="20"
                  strokeDasharray="24 100"
                  strokeDashoffset="-64"
                  pathLength="100"
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  className={`transition-all duration-300 ${activeSegment === 2 ? 'stroke-[#FF00FF] opacity-100' : 'opacity-70'}`}
                  onMouseEnter={() => setActiveSegment(2)}
                  onMouseLeave={() => setActiveSegment(null)}
                  onClick={() => setActiveSegment(activeSegment === 2 ? null : 2)}
                />
                {/* Fourth segment - Genesis Event */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FFFF00"
                  strokeWidth="20"
                  strokeDasharray="12 100"
                  strokeDashoffset="-88"
                  pathLength="100"
                  style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                  className={`transition-all duration-300 ${activeSegment === 3 ? 'stroke-[#FFFF00] opacity-100' : 'opacity-70'}`}
                  onMouseEnter={() => setActiveSegment(3)}
                  onMouseLeave={() => setActiveSegment(null)}
                  onClick={() => setActiveSegment(activeSegment === 3 ? null : 3)}
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{DONUT_DATA.totalTokens}</div>
                <div className="text-lg text-[#6A6A6A]">Total Tokens</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column 2: Token allocation percentages - taking 2/3 width */}
        <div className="col-span-2 flex flex-col justify-center space-y-10 py-6">
          {/* First segment */}
          <div 
            className={`flex items-center rounded-lg p-3 transition-all duration-300 ${activeSegment === 0 ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
            onMouseEnter={() => setActiveSegment(0)}
            onMouseLeave={() => setActiveSegment(null)}
            onClick={() => setActiveSegment(activeSegment === 0 ? null : 0)}
          >
            <div className="flex w-[150px] shrink-0 items-center pl-2">
              <span className={`bg-gradient-to-r from-white to-[#3384FF] bg-clip-text text-5xl font-bold text-transparent transition-all duration-300 ${activeSegment === 0 ? 'scale-110' : ''}`}>46%</span>
            </div>
            <div className="flex-1">
              <div className={`text-2xl text-white transition-all duration-300 ${activeSegment === 0 ? 'text-[#3384FF]' : ''}`}>OpenxAI Protocol and Ecosystem Development</div>
              <div className="mt-1 text-lg text-[#6A6A6A]">
                Core protocol development, infrastructure scaling, AI model development, 
                decentralized compute, AI model monetization, OpenxAI marketplace, and 
                ecosystem security.
              </div>
            </div>
          </div>
          
          {/* Second segment */}
          <div 
            className={`flex items-center rounded-lg p-3 transition-all duration-300 ${activeSegment === 1 ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
            onMouseEnter={() => setActiveSegment(1)}
            onMouseLeave={() => setActiveSegment(null)}
            onClick={() => setActiveSegment(activeSegment === 1 ? null : 1)}
          >
            <div className="flex w-[150px] shrink-0 items-center pl-2">
              <span className={`bg-gradient-to-r from-white to-[#00FF94] bg-clip-text text-5xl font-bold text-transparent transition-all duration-300 ${activeSegment === 1 ? 'scale-110' : ''}`}>18%</span>
            </div>
            <div className="flex-1">
              <div className={`text-2xl text-white transition-all duration-300 ${activeSegment === 1 ? 'text-[#00FF94]' : ''}`}>Core Protocol, Infrastructure & Future Expansions</div>
              <div className="mt-1 text-lg text-[#6A6A6A]">
                Funding for developers building AI models, enhancing OpenxAI protocol, 
                infrastructure, products, tools, and upgrading the protocol.
              </div>
            </div>
          </div>
          
          {/* Third segment */}
          <div 
            className={`flex items-center rounded-lg p-3 transition-all duration-300 ${activeSegment === 2 ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
            onMouseEnter={() => setActiveSegment(2)}
            onMouseLeave={() => setActiveSegment(null)}
            onClick={() => setActiveSegment(activeSegment === 2 ? null : 2)}
          >
            <div className="flex w-[150px] shrink-0 items-center pl-2">
              <span className={`bg-gradient-to-r from-white to-[#FF00FF] bg-clip-text text-5xl font-bold text-transparent transition-all duration-300 ${activeSegment === 2 ? 'scale-110' : ''}`}>24%</span>
            </div>
            <div className="flex-1">
              <div className={`text-2xl text-white transition-all duration-300 ${activeSegment === 2 ? 'text-[#FF00FF]' : ''}`}>Community & Governance</div>
              <div className="mt-1 text-lg text-[#6A6A6A]">
                Community incentives, governance mechanisms, staking, and liquidity
                incentives.
              </div>
            </div>
          </div>
          
          {/* Fourth segment */}
          <div 
            className={`flex items-center rounded-lg p-3 transition-all duration-300 ${activeSegment === 3 ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
            onMouseEnter={() => setActiveSegment(3)}
            onMouseLeave={() => setActiveSegment(null)}
            onClick={() => setActiveSegment(activeSegment === 3 ? null : 3)}
          >
            <div className="flex w-[150px] shrink-0 items-center pl-2">
              <span className={`bg-gradient-to-r from-white to-[#FFFF00] bg-clip-text text-5xl font-bold text-transparent transition-all duration-300 ${activeSegment === 3 ? 'scale-110' : ''}`}>12%</span>
            </div>
            <div className="flex-1">
              <div className={`text-2xl text-white transition-all duration-300 ${activeSegment === 3 ? 'text-[#FFFF00]' : ''}`}>Genesis Event</div>
              <div className="mt-1 text-lg text-[#6A6A6A]">
                Initial fundraising event, Uniswap liquidity provisioning, and early
                ecosystem bootstrap funding.
              </div>
            </div>
          </div>
        </div>
      </div>
        

          
          {/* Line chart */}
          <div className="mt-10">
            <div className="mb-4 text-2xl font-bold text-white">Token Release Schedule</div>
            
            {/* Legend row with your specified categories and colors */}
            <div className="mb-6 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#3384FF]"></div>
                <span className="text-white">Core Protocol, Infrastructure</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#FF00FF]"></div>
                <span className="text-white">AI Marketplace & Monetization</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#9933FF]"></div>
                <span className="text-white">Data, Compute & Storage Provider Fund</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#FFCC00]"></div>
                <span className="text-white">Core Contributors & Early Builders</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#33CCFF]"></div>
                <span className="text-white">Milestone Achievement Rewards</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 size-3 rounded-full bg-[#00FF94]"></div>
                <span className="text-white">Genesis Distribution</span>
              </div>
            </div>
            
            <div className="h-[400px]">
              <Line 
                options={{
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
                      max: 100,
                      grid: {
                        color: 'rgba(106, 106, 106, 0.1)',
                      },
                      ticks: {
                        color: '#6A6A6A',
                        callback: function(value: any) {
                          return `${value}%`
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
                }}
                data={{
                  labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26', 'Q1 27', 'Q2 27', 'Q3 27', 'Q4 27', 'Q1 28', 'Q2 28', 'Q3 28', 'Q4 28', 'Q1 29', 'Q2 29', 'Q3 29', 'Q4 29'],
                  datasets: [
                    {
                      label: 'Genesis Distribution',
                      data: [2.5, 5, 7.5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                      borderColor: '#00FF94',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(0, 255, 148, 0.3)',
                      tension: 0.4
                    },
                    {
                      label: 'Milestone Achievement Rewards',
                      data: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
                      borderColor: '#33CCFF',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(51, 204, 255, 0.3)',
                      tension: 0.4
                    },
                    {
                      label: 'Core Contributors & Early Builders',
                      data: [3, 6, 9, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                      borderColor: '#FFCC00',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(255, 204, 0, 0.3)',
                      tension: 0.4
                    },
                    {
                      label: 'Data, Compute & Storage Provider Fund',
                      data: [1.2, 3.6, 4.8, 6, 7.2, 8.4, 9.6, 10.8, 12, 13.2, 14.4, 15.6, 16.8, 18, 19.2, 20.4, 21.6, 22.8, 24, 24],
                      borderColor: '#9933FF',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(153, 51, 255, 0.3)',
                      tension: 0.4
                    },
                    {
                      label: 'AI Marketplace & Monetization',
                      data: [0, 0, 0.9, 1.8, 2.7, 3.6, 4.5, 5.4, 6.3, 7.2, 8.1, 9, 9.9, 10.8, 11.7, 12.6, 13.5, 14.4, 14.4, 14.4],
                      borderColor: '#FF00FF',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(255, 0, 255, 0.3)',
                      tension: 0.4
                    },
                    {
                      label: 'Core Protocol, Infrastructure',
                      data: [2.08, 3.64, 5.2, 6.76, 8.32, 9.88, 11.44, 13, 14.56, 16.12, 17.68, 19.24, 20.8, 22.36, 23.92, 25.48, 26, 26, 26, 26],
                      borderColor: '#3384FF',
                      borderWidth: 1,
                      fill: true,
                      backgroundColor: 'rgba(51, 132, 255, 0.3)',
                      tension: 0.4
                    }
                  ]
                }}
              />
            </div>
          </div>
      </div>
    </MobileResponsiveWrapper>
  )
}
    