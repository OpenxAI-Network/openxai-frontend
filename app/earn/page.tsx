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

const TOP_EARNERS = Array(5).fill({
  address: "0xabcd....6789",
  points: "0"
})

export default function EarnPage() {
  const [isVideoExpanded, setIsVideoExpanded] = React.useState(false);
  const [isHighlighted, setIsHighlighted] = React.useState(false);

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
          Earn more $OPENX by completing tasks
        </h2>
        
        <div className="grid grid-cols-2 gap-4 [@media(max-width:960px)]:grid-cols-1">
          {/* X/Twitter Task - gradient from blue */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="relative block">
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
          </a>

          {/* Telegram Task - gradient from green */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="relative block">
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
          </a>

          {/* YouTube Task - gradient from red */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="relative block">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-[#FF0000] to-[#829ED1]" />
            <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
              <div className="flex items-center gap-3">
                <svg className="size-5 text-white [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">Create a Shorts Video</span>
              </div>
              <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">500 OPENX</span>
            </div>
          </a>

          {/* TikTok Task - gradient from blue */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="relative block">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#829ED1] to-[#0059FE]" />
            <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
              <div className="flex items-center gap-3">
                <svg className="size-5 text-white [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z"/>
                </svg>
                <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">Create a Shorts Video</span>
              </div>
              <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">500 OPENX</span>
            </div>
          </a>

          {/* Meetup Task - gradient from green */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="relative block">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-[#B2FE00] to-[#829ED1]" />
            <div className="relative flex h-[60px] items-center justify-between rounded-lg bg-[#1F2021] px-6 hover:bg-[#2a2a2a] [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px] [@media(max-width:960px)]:px-4">
              <div className="flex items-center gap-3">
                <svg className="size-5 text-white [@media(max-width:400px)]:size-3 [@media(max-width:650px)]:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">In-Person OpenxAI Meetup</span>
              </div>
              <span className="text-[16px] font-medium text-white [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">2000 OPENX</span>
            </div>
          </a>

          {/* More tasks coming soon box */}
          <a href="https://zealy.io/cw/openxai/questboard?invitationId=pgvBr_b0wl4QCZ7MuUf-L" target="_blank" rel="noopener noreferrer" className="block">
            <div className="flex h-[60px] items-center justify-center [@media(max-width:400px)]:h-[40px] [@media(max-width:650px)]:h-[50px]">
              <span className="text-xl text-gray-400 [@media(max-width:400px)]:text-sm [@media(max-width:650px)]:text-base">
                More tasks coming soon!
              </span>
            </div>
          </a>
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