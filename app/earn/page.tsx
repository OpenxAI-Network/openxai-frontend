"use client"

import React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
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
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/7a480ae5-be87-4ee6-b7c5-13cf1ba36ef4",
  },
  {
    platform: "Zealy",
    name: "Follow OpenxAI on X",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#829ED1] to-[#0059FE]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/f10b4da6-cce4-4c68-9656-3a76935c1e4a",
  },
  {
    platform: "Zealy",
    name: "Join OpenxAI Telegram",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#B2FE00] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/1834439f-62e4-45ba-babd-289114804d41",
  },
  {
    platform: "Zealy",
    name: "Join OpenxAI Discord",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#5865F2] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/a27fd2b3-7645-4976-8753-a5c5ceec42d3",
  },
  {
    platform: "Zealy",
    name: "Follow OpenxAI on LinkedIn",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#0A66C2] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/914bf14e-2f16-44c4-ac27-e2ff332d260e",
  },
  {
    platform: "Zealy",
    name: "Follow OpenxAI on Medium",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#000000] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/479d5371-e1ab-4572-a030-288ba5612eb2",
  },
  {
    platform: "Zealy",
    name: "YouTube Subscribe",
    icon: "/logo/zealy-icon.png",
    reward: "OPENX / USDT",
    bgColor: "bg-[#1F2021]",
    gradient: "from-[#FF0000] to-[#829ED1]",
    link: "https://zealy.io/cw/openxai/questboard/0de467db-b4d6-47e5-b295-ee7abec02b84/a6250092-c6a2-4986-bdc2-6aabf4ac3c82",
  },
]

const FILTER_OPTIONS = ["All", "Zealy", "Tally"]

const TOP_EARNERS = Array(5).fill({
  address: "0",
  points: "0",
})

export default function EarnPage() {
  const [selectedFilter, setSelectedFilter] = React.useState("All")
  const [isHighlighted, setIsHighlighted] = React.useState(false)
  const [isComingSoonHighlighted, setIsComingSoonHighlighted] =
    React.useState(false)

  // Filter tasks based on selected platform
  const filteredTasks = React.useMemo(() => {
    if (selectedFilter === "All") return TASKS
    return TASKS.filter((task) => task.platform === selectedFilter)
  }, [selectedFilter])

  React.useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isHighlighted])

  React.useEffect(() => {
    if (isComingSoonHighlighted) {
      const timer = setTimeout(() => setIsComingSoonHighlighted(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isComingSoonHighlighted])

  return (
    <>
      {/* Banner notification */}
      <div
        className={`mb-6 rounded-lg bg-blue-900/30 p-4 text-center transition-all duration-300 ${isHighlighted ? "ring-1 ring-white" : ""}`}
      >
        <span className="text-sm text-white md:text-base">
          More tasks will be going live soon! Please follow{" "}
          <a
            href="https://x.com/OpenxAINetwork"
            target="_blank"
            className="pointer-events-auto font-bold underline hover:text-blue-300"
          >
            OpenxAI
          </a>{" "}
          for updates.
        </span>
      </div>

      {/* Content with disabled interactions */}
      <div className="relative">
        {/* Coming Soon overlay */}
        <div
          className="absolute -inset-1 z-50 flex cursor-pointer items-start justify-center rounded-lg bg-black/90"
          onClick={() => setIsComingSoonHighlighted(true)}
        >
          <div
            className={`mt-20 rounded-lg bg-black/80 px-8 py-4 text-center transition-all duration-300 ${isComingSoonHighlighted ? "scale-110 ring-2 ring-white" : ""}`}
          >
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Coming Soon
            </h2>
            <p className="mt-2 text-gray-300">
              Follow{" "}
              <a
                href="https://x.com/OpenxAINetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-300"
              >
                OpenxAI
              </a>{" "}
              for updates.
            </p>
          </div>
        </div>

        {/* Existing content with pointer-events disabled */}
        <div className="pointer-events-none">
          <div style={{ backgroundColor: "transparent" }}>
            <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">
              Earn more $OPENX & $USDT by completing tasks on the following
              platforms
            </h2>

            {/* Filter buttons */}
            <div className="mb-6 flex gap-4">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`rounded-lg px-6 py-3 text-lg font-bold text-white transition-all
                    ${
                      selectedFilter === filter
                        ? "bg-blue-600"
                        : "bg-[#1F2021] hover:bg-[#2a2a2a]"
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
                  <div
                    className={`absolute -inset-px rounded-lg bg-gradient-to-t ${task.gradient}`}
                  />
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
            {/*}
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
            {*/}
          </div>
        </div>
      </div>
    </>
  )
}
