"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

const SIMPLE_TASKS = [
  { 
    platform: "X", 
    icon: "/x-logo.svg",
    action: "Follow @OpenxAI", 
    reward: "500 OPENX",
    bgColor: "bg-[#1F2021]" 
  },
  { 
    platform: "Telegram", 
    icon: "/telegram-logo.svg",
    action: "Join @OpenxAI", 
    reward: "500 OPENX",
    bgColor: "bg-[#1F2021]" 
  },
  { 
    platform: "Video", 
    action: "Create a short video about..", 
    reward: "500 OPENX",
    hasInput: true,
    bgColor: "bg-[#1F2021]" 
  },
]

const LONG_TERM_TASKS = [
  { name: "Token Generation Event (Genesis)", reward: "500 OPENX" },
  { name: "In-Person OpenxAI Conference", reward: "500 OPENX" },
]

const TOP_EARNERS = Array(10).fill({
  address: "0xbb43.....327894",
  points: "3,333,335,444.6"
})

export default function EarnPage() {
  const [isVideoExpanded, setIsVideoExpanded] = React.useState(false);
  
  return (
    <MobileResponsiveWrapper>
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)] p-0">
        <SideMenu />

        <main className="ml-[234px] flex-1 p-12 pt-16 [@media(max-width:960px)]:ml-0 [@media(max-width:960px)]:p-4 [@media(max-width:960px)]:pt-32">
          <div className="hidden [@media(max-width:960px)]:block">
          </div>

          <div className="grid grid-cols-2 gap-8 [@media(max-width:960px)]:mt-16 [@media(max-width:960px)]:grid-cols-1">
            {/* Simple Tasks Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">
                Complete Simple Tasks to Earn
              </h2>
              
              <div className="space-y-4">
                {/* X/Twitter Task */}
                <div className="relative">
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#829ED1] to-[#0059FE]" />
                  <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
                    <div className="flex items-center gap-3">
                      <svg className="size-5 text-white [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">Follow @OpenxAI</span>
                    </div>
                    <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">500 OPENX</span>
                  </div>
                </div>

                {/* Telegram Task */}
                <div className="relative">
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-[#B2FE00] to-[#829ED1]" />
                  <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
                    <div className="flex items-center gap-3">
                      <svg className="size-5 text-white [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z"/>
                      </svg>
                      <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">Join @OpenxAI</span>
                    </div>
                    <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">500 OPENX</span>
                  </div>
                </div>

                {/* Video Task */}
                <div className="relative">
                  <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-[#FF0000] to-[#829ED1]" />
                  <div className="relative rounded-lg bg-[#1F2021] hover:bg-[#2a2a2a]">
                    {/* Header */}
                    <div className="flex h-[60px] items-center justify-between px-6 [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
                      <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">Create a short video about..</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">500 OPENX</span>
                        <ChevronDown 
                          className={`size-5 cursor-pointer text-gray-400 transition-transform [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4 ${isVideoExpanded ? 'rotate-180' : ''}`}
                          onClick={() => setIsVideoExpanded(!isVideoExpanded)}
                        />
                      </div>
                    </div>
                    
                    {/* Collapsible Content */}
                    {isVideoExpanded && (
                      <div className="border-t border-white/10 p-6 pt-2 [@media(max-width:960px)]:p-4">
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            placeholder="share your link" 
                            className="h-12 w-full rounded-lg border border-white/10 bg-[#1F2021] px-4 text-white [@media(max-width:400px)]:h-8 [@media(max-width:650px)]:h-10 [@media(max-width:650px)]:text-sm"
                          />
                          <input 
                            type="text" 
                            placeholder="your wallet" 
                            className="h-12 w-full rounded-lg border border-white/10 bg-[#1F2021] px-4 text-white [@media(max-width:400px)]:h-8 [@media(max-width:650px)]:h-10 [@media(max-width:650px)]:text-sm"
                          />
                          <button className="ml-auto block h-12 w-24 rounded-lg bg-[#0066FF] text-white [@media(max-width:400px)]:h-8 [@media(max-width:400px)]:w-16 [@media(max-width:650px)]:h-10 [@media(max-width:650px)]:w-20 [@media(max-width:650px)]:text-sm">
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Long Term Tasks Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">
                Contribute to more long term projects & tasks
              </h2>
              
              <div className="space-y-4">
                {LONG_TERM_TASKS.map((task, index) => (
                  <div 
                    key={index}
                    className="rounded-lg border border-white/10 bg-[#1F2021] p-4 [@media(max-width:650px)]:p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">{task.name}</span>
                      <span className="text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">{task.reward}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="link"
                  className="text-sm text-gray-400 hover:text-white [@media(max-width:650px)]:text-xs"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>

          {/* Top Earners Section */}
          <div className="mt-12">
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
                            {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}`}
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
        </main>
      </div>
    </MobileResponsiveWrapper>
  )
}