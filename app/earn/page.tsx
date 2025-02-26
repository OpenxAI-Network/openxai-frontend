"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

// Define task types and data
const TASKS = [
  { 
    platform: "Zealy",
    name: "Read OpenxAI Vision",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#829ED1] to-[#0059FE]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  { 
    platform: "Zealy",
    name: "Follow OpenxAI on X",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#829ED1] to-[#0059FE]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  {
    platform: "Zealy",
    name: "Join OpenxAI Telegram",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#B2FE00] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  {
    platform: "Zealy",
    name: "Join OpenxAI Discord",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#5865F2] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  {
    platform: "Zealy",
    name: "Follow OpenxAI on LinkedIn",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#0A66C2] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  {
    platform: "Zealy",
    name: "Follow OpenxAI on Medium",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#000000] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard"
  },
  {
    platform: "Zealy",
    name: "YouTube Subscribe",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#FF0000] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard"
  }
]

const FILTER_OPTIONS = ["All", "Zealy", "TaskOn", "Youtoo"]

const TOP_EARNERS = Array(5).fill({
  address: "0xabcd....6789",
  points: "0"
})

export default function EarnPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("All")
  const [isHighlighted, setIsHighlighted] = React.useState(false)

  // Filter tasks based on selected platform
  const filteredTasks = React.useMemo(() => {
    if (selectedFilter === "All") return TASKS
    return TASKS.filter(task => task.platform === selectedFilter)
  }, [selectedFilter])

  React.useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);
  
  return (
    <MobileResponsiveWrapper>
      {/* Banner notification */}
      <div className={`mb-24 rounded-lg bg-blue-900/30 p-4 text-center transition-all duration-300 ${isHighlighted ? 'ring-1 ring-white' : ''}`}>
        <span className="text-sm text-white md:text-base">
          Tasks will be going live soon... stay tuned!
        </span>
      </div>

      <div style={{ backgroundColor: 'transparent' }}>
        <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">
          Earn more $OPENX & $USDT by completing tasks on the following platforms
        </h2>

        {/* Filter buttons */}
        <div className="mb-6 flex gap-4">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-lg px-6 py-3 text-lg font-bold transition-all text-white
                ${selectedFilter === filter 
                  ? 'bg-blue-600' 
                  : 'bg-[#1F2021] hover:bg-[#2a2a2a]'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Tasks grid */}
        <div className="grid grid-cols-2 gap-4 [@media(max-width:960px)]:grid-cols-1">
          {filteredTasks.map((task, index) => (
            <a 
              key={index}
              href={task.link}
              target="_blank" 
              rel="noopener noreferrer"
              className="relative block"
            >
              <div className={`absolute -inset-px rounded-lg bg-gradient-to-t ${task.gradient}`} />
              <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={task.icon}
                    alt={task.platform}
                    width={20}
                    height={20}
                    className="[@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4"
                  />
                  <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">
                    {task.name}
                  </span>
                </div>
                <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">
                  {task.reward}
                </span>
              </div>
            </a>
          ))}

          {/* More tasks coming soon box */}
          <div className="flex h-[60px] items-center justify-center [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px]">
            <span className="text-xl text-gray-400 [@media(max-width:400px)]:text-sm [@media(max-width:650px)]:text-base">
              More tasks coming soon!
            </span>
          </div>
        </div>

        {/* Top Earners Section */}
        <div className="mt-24">
          <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">Top Earners</h2>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
                <thead>
                  <tr>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">User Address</th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Rank</th>
                    <th className="border-0 border-b border-[#454545] p-4 text-right text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Total Points (OPENX)</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_EARNERS.map((earner, index) => (
                    <tr 
                      key={index}
                      className={`
                        text-sm transition-colors
                        ${index === 0 && 'bg-[linear-gradient(90deg,#353535_0%,#FABF58_60%,#353535_98%)]'} 
                        ${index === 1 && 'bg-[linear-gradient(90deg,#353535_0%,#B8EAA8_60%,#353535_98%)]'}
                        ${index === 2 && 'bg-[linear-gradient(90deg,#353535_0%,#A8C4EA_60%,#353535_98%)]'}
                        ${index > 2 && 'hover:bg-white/5'}
                      `}
                    >
                      <td className="border-0 p-4 font-mono text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{earner.address}</td>
                      <td className="border-0 p-4 [@media(max-width:960px)]:p-2">
                        <span className="font-medium text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                          {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                        </span>
                      </td>
                      <td className="border-0 p-4 text-right font-mono text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{earner.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}