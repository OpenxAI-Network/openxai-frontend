"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const SIMPLE_TASKS = [
  { platform: "X", action: "Follow @OpenxAI", reward: "500 OPENX" },
  { platform: "Telegram", action: "Join @OpenxAI", reward: "500 OPENX" },
  { platform: "Video", action: "Create a short video about..", reward: "500 OPENX" },
  { platform: "Video", action: "Create a short video", reward: "500 OPENX" },
  { platform: "Video", action: "Create a short video", reward: "500 OPENX" },
]

const LONG_TERM_TASKS = [
  { name: "Token Generation Event (Genesis)", reward: "500 OPENX" },
  { name: "Follow OpenxAI", reward: "500 OPENX" },
  { name: "Follow OpenxAI", reward: "500 OPENX" },
  { name: "In-Person OpenxAI Conference", reward: "500 OPENX" },
]

const TOP_EARNERS = Array(10).fill({
  address: "0xbb43.....327894",
  points: "3,333,335,444.6"
})

export default function EarnPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
        <SideMenu />
        <main className="ml-[234px] flex-1 p-8 pt-24">
          <div className="grid grid-cols-2 gap-8">
            {/* Simple Tasks Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">
                Complete Simple Tasks to Earn
              </h2>
              
              <div className="space-y-4">
                {SIMPLE_TASKS.map((task, index) => (
                  <div 
                    key={index}
                    className="rounded-lg border border-white/10 bg-[#1F2021] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white">{task.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{task.reward}</span>
                        <ChevronDown className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long Term Tasks Section */}
            <div>
              <h2 className="mb-6 text-xl font-semibold text-white">
                Contribute to more long term projects & tasks
              </h2>
              
              <div className="space-y-4">
                {LONG_TERM_TASKS.map((task, index) => (
                  <div 
                    key={index}
                    className="rounded-lg border border-white/10 bg-[#1F2021] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{task.name}</span>
                      <span className="text-white">{task.reward}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="link"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>

          {/* Top Earners Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-white">Top Earners</h2>
            
            <div className="overflow-hidden rounded-xl bg-[#1F2021]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-sm font-medium text-gray-400">User Address</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-400">Rank</th>
                    <th className="p-4 text-right text-sm font-medium text-gray-400">Total Points (OPENX)</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_EARNERS.map((earner, index) => (
                    <tr 
                      key={index}
                      className="border-b border-white/10 text-white transition-colors hover:bg-white/5"
                    >
                      <td className="p-4">{earner.address}</td>
                      <td className="p-4">
                        <span 
                          className={`${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-green-500' :
                            index === 2 ? 'text-blue-500' :
                            'text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="p-4 text-right">{earner.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}