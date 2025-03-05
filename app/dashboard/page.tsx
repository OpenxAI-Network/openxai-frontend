"use client"

import React, { useEffect, useState } from 'react'
import { Info } from "lucide-react"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"
import { Line, Bar } from 'react-chartjs-2'
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
import dynamic from 'next/dynamic'
import CloudComparisonSection from '@/components/dashboard/Comparison'

// Add this type definition
type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
} | null;

// Create a separate chart component with NO SSR
const DynamicChart = dynamic(
  () => import('../../components/dashboard/Comparison'),
  { ssr: false, loading: () => <div className="flex h-[300px] items-center justify-center">Loading chart...</div> }
);

// Stats for the On-chain Data section
const ON_CHAIN_DATA = [
  {
    label: "Token Price",
    value: "$0.02",
    tooltip: "Token Price (USD)"
  },
  {
    label: "Exchange Rate (ETH / OPENX)",
    value: "1,476,947",
    change: "-78%",
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
      <div className="text-2xl font-bold text-white">
        {stat.value}
        {stat.change && <span className="ml-1 text-sm font-normal text-[#CCCCCC]">({stat.change})</span>}
      </div>
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
      display: true,
      position: 'top' as const,
      labels: {
        color: '#FFFFFF',  // Make text white
        font: {
          size: 14
        },
        padding: 20
      }
    },
    filler: {
      propagate: true
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label || ''}: ${context.parsed.y}%`;
        }
      }
    }
  }
} as const

// Add types for the model data
interface AIModel {
  logo: string;
  name: string;
}

// Add types for the ScrollingRow props
interface ScrollingRowProps {
  models: AIModel[];
  direction?: 'normal' | 'reverse';
  speed?: number;
}

// Component with proper TypeScript types
const ScrollingRow: React.FC<ScrollingRowProps> = ({ models, direction = 'normal', speed = 20 }) => (
  <div className="flex overflow-hidden py-4">
    <div 
      className={`flex whitespace-nowrap ${
        direction === 'reverse' ? 'animate-scroll-reverse' : 'animate-scroll'
      }`}
      style={{ 
        animationDuration: `${speed}s`
      }}
    >
      {models.map((model, index) => (
        <div key={index} className="mx-6 inline-flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src={model.logo} 
                  alt={model.name}
                  className="h-12 w-12 object-contain"
                  style={{
                    minWidth: '48px',
                    minHeight: '48px',
                    background: '#1a1a1a',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{model.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
      {/* Duplicate for seamless scrolling */}
      {models.map((model, index) => (
        <div key={`duplicate-${index}`} className="mx-6 inline-flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img 
                  src={model.logo} 
                  alt={model.name}
                  className="h-12 w-12 object-contain"
                  style={{
                    minWidth: '48px',
                    minHeight: '48px',
                    background: '#1a1a1a',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{model.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  </div>
);

// Make sure AI_MODELS is typed
const AI_MODELS: AIModel[] = [
  { logo: "https://studio.openxai.org/images/models/deepseek.png", name: "deepseek-r1" },
  { logo: "/logo/meta-logo.png", name: "llama2" },
  { logo: "https://studio.openxai.org/images/models/mistral.png", name: "mistral" },
  { logo: "https://studio.openxai.org/images/models/mistral.png", name: "mixtral" },
  { logo: "https://studio.openxai.org/images/models/qwen.png", name: "qwen" },
  { logo: "https://studio.openxai.org/images/models/google.png", name: "gemma" },
  { logo: "https://studio.openxai.org/images/models/microsoft.png", name: "phi3" },
  { logo: "/logo/meta-logo.png", name: "codellama" },
  { logo: "https://studio.openxai.org/images/models/tinyllama.png", name: "tinyllama" },
  { logo: "https://studio.openxai.org/images/models/starcoder2.png", name: "starcoder2" },
  { logo: "https://studio.openxai.org/images/models/dolphin.png", name: "dolphin-mixtral" },
  { logo: "https://studio.openxai.org/images/models/deepseek.png", name: "deepseek-coder-v2" },
  { logo: "https://studio.openxai.org/images/models/google.png", name: "codegemma" },
  { logo: "https://studio.openxai.org/images/models/wizardlm2.jpg", name: "wizardlm2" },
  { logo: "https://studio.openxai.org/images/models/h4.png", name: "zephyr" },
  { logo: "https://studio.openxai.org/images/models/yi.svg", name: "yi" },
  { logo: "https://studio.openxai.org/images/models/llava.jpeg", name: "llava" },
  { logo: "https://studio.openxai.org/images/models/google.png", name: "gemma2" },
  { logo: "https://studio.openxai.org/images/models/qwen.png", name: "qwen2.5" },
  { logo: "https://studio.openxai.org/images/models/mistral.png", name: "mistral-nemo" },
  { logo: "/logo/meta-logo.png", name: "llama3.2-vision" },
  { logo: "https://studio.openxai.org/images/models/qwen.png", name: "qwen2.5-coder" },
  { logo: "https://studio.openxai.org/images/models/internlm.jpeg", name: "internlm2" },
  { logo: "https://studio.openxai.org/images/models/nvidia.png", name: "nemotron" },
  { logo: "https://studio.openxai.org/images/models/microsoft.png", name: "phi3.5" },
  { logo: "https://studio.openxai.org/images/models/codestral.png", name: "codestral" },
  { logo: "https://studio.openxai.org/images/models/starcoder2.png", name: "starcoder" },
  { logo: "https://studio.openxai.org/images/models/ibm.png", name: "granite-code" },
  { logo: "https://studio.openxai.org/images/models/vicuna.png", name: "vicuna" },
  { logo: "https://studio.openxai.org/images/models/smollm2.png", name: "smollm" },
  { logo: "https://studio.openxai.org/images/models/wizard-vicuna-uncensored.png", name: "wizard-vicuna-uncensored" },
  { logo: "https://studio.openxai.org/images/models/mistral.png", name: "mistral-openorca" },
  { logo: "https://studio.openxai.org/images/models/qwen.png", name: "qwq" },
  { logo: "/logo/meta-logo.png", name: "llama2-chinese" },
  { logo: "https://studio.openxai.org/images/models/smollm2.png", name: "smollm2" },
  { logo: "https://studio.openxai.org/images/models/codegeex4.jpg", name: "codegeex4" },
  { logo: "https://studio.openxai.org/images/models/openchat.png", name: "openchat" },
  { logo: "https://studio.openxai.org/images/models/cohere.png", name: "aya" },
  { logo: "https://studio.openxai.org/images/models/deepseek.png", name: "deepseek-v3" },
  { logo: "https://studio.openxai.org/images/models/qwen.png", name: "codeqwen" },
  { logo: "https://studio.openxai.org/images/models/nous.png", name: "nous-hermes2" }
];

// Split models into three roughly equal groups
const third = Math.ceil(AI_MODELS.length / 3);
const firstRow = AI_MODELS.slice(0, third);
const secondRow = AI_MODELS.slice(third, third * 2);
const thirdRow = AI_MODELS.slice(third * 2);

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

      {/* Full Width AI Infrastructure Card */}
      <div className="mb-4 rounded-lg border border-[#454545] bg-[#1F2021]/50 p-6">
        <h2 className="mb-6 text-2xl font-bold">
          <span className="bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent">
            AI Infrastructure
          </span>
        </h2>
        
        {/* Grid container for metrics and logos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Metrics section - 4 columns on desktop */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            <div>
              <div className="text-sm text-[#6A6A6A]">AI Model Accessibility Index (AMAI)</div>
              <div className="text-2xl font-bold text-white">10/10</div>
            </div>
            <div>
              <div className="text-sm text-[#6A6A6A]">AI Model Privacy Score (MPS)</div>
              <div className="text-2xl font-bold text-white">9.2/10</div>
            </div>
            <div>
              <div className="text-sm text-[#6A6A6A]">AI Cost Reduction Ratio (ACRR)</div>
              <div className="text-2xl font-bold text-white">9.3/10</div>
            </div>
            <div>
              <div className="text-sm text-[#6A6A6A]">User Savings Index (USI)</div>
              <div className="text-2xl font-bold text-white">8.5/10</div>
            </div>
          </div>

          {/* Scrolling logos section - 7 columns on desktop */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4">
              <ScrollingRow models={firstRow} direction="normal" speed={60} />
              <ScrollingRow models={secondRow} direction="reverse" speed={50} />
              <ScrollingRow models={thirdRow} direction="normal" speed={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Decentralized Infrastructure Card */}
      <CloudComparisonSection />

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
            
            <div className="h-[400px]">
              <Line 
                data={{
                  labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26', 'Q1 27', 'Q2 27', 'Q3 27', 'Q4 27', 'Q1 28', 'Q2 28', 'Q3 28', 'Q4 28', 'Q1 29', 'Q2 29', 'Q3 29', 'Q4 29'],
                  datasets: [
                    {
                      label: 'Genesis Distribution',
                      data: [2.5, 5, 7.5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                      borderColor: '#00FF94',
                      fill: true,
                      backgroundColor: 'rgba(0, 255, 148, 0.3)',
                    },
                    {
                      label: 'Milestone Achievement Rewards',
                      data: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
                      borderColor: '#33CCFF',
                      fill: true,
                      backgroundColor: 'rgba(51, 204, 255, 0.3)',
                    },
                    {
                      label: 'Core Contributors & Early Builders',
                      data: [3, 6, 9, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
                      borderColor: '#FFCC00',
                      fill: true,
                      backgroundColor: 'rgba(255, 204, 0, 0.3)',
                    },
                    {
                      label: 'Data, Compute & Storage Provider Fund',
                      data: [1.2, 3.6, 4.8, 6, 7.2, 8.4, 9.6, 10.8, 12, 13.2, 14.4, 15.6, 16.8, 18, 19.2, 20.4, 21.6, 22.8, 24, 24],
                      borderColor: '#9933FF',
                      fill: true,
                      backgroundColor: 'rgba(153, 51, 255, 0.3)',
                    },
                    {
                      label: 'AI Marketplace & Monetization',
                      data: [0, 0, 0.9, 1.8, 2.7, 3.6, 4.5, 5.4, 6.3, 7.2, 8.1, 9, 9.9, 10.8, 11.7, 12.6, 13.5, 14.4, 14.4, 14.4],
                      borderColor: '#FF00FF',
                      fill: true,
                      backgroundColor: 'rgba(255, 0, 255, 0.3)',
                    },
                    {
                      label: 'Core Protocol, Infrastructure',
                      data: [2.08, 3.64, 5.2, 6.76, 8.32, 9.88, 11.44, 13, 14.56, 16.12, 17.68, 19.24, 20.8, 22.36, 23.92, 25.48, 26, 26, 26, 26],
                      borderColor: '#3384FF',
                      fill: true,
                      backgroundColor: 'rgba(51, 132, 255, 0.3)',
                    }
                  ]
                }}
                options={options}
                plugins={[
                  {
                    id: 'forceStacked',
                    beforeDraw: (chart: any) => {
                      const datasets = chart.data.datasets;
                      for (let i = 0; i < datasets.length; i++) {
                        datasets[i].fill = true;
                      }
                    }
                  }
                ]}
              />
            </div>
          </div>
      </div>
    </MobileResponsiveWrapper>
  )
}
    