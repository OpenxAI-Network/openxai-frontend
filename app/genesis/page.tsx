"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const MILESTONES = [
  { position: 25, title: "Community Launch", description: "Initial community token distribution" },
  { position: 50, title: "DEX Listing", description: "Token listed on major DEXes" },
  { position: 75, title: "CEX Integration", description: "Major CEX listings" },
  { position: 100, title: "Staking Launch", description: "Staking mechanism goes live" },
]

const PAYMENT_METHODS = [
  { id: 'eth', name: 'ETH', icon: 'fa-brands fa-ethereum' },
  { id: 'usdc', name: 'USDC', icon: 'fa-regular fa-circle-dollar' },
  { id: 'usdt', name: 'USDT', icon: 'fa-regular fa-circle-dollar' },
  { id: 'sol', name: 'SOL', icon: 'fa-regular fa-circle-s' },
]

export default function GenesisPage() {
  const [selectedMilestone, setSelectedMilestone] = React.useState<number | null>(null)

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-black">
        <SideMenu />
        <main className="ml-48 flex-1 p-8 pt-24">
          <div className="grid grid-cols-6 gap-4">
            {/* Info columns (1-3) */}
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <div>
                <div className="text-gray-500">Ticker</div>
                <div className="text-white">$OPENX (ERC20)</div>
              </div>
              <div>
                <div className="text-gray-500">Max per wallet</div>
                <div className="text-white">$1000</div>
              </div>
              <div>
                <div className="text-gray-500">Contract</div>
                <div className="text-blue-500">0x84...84s4</div>
              </div>
            </div>

            {/* Empty columns (4-5) */}
            <div className="col-span-2"></div>

            {/* Amount column (6) */}
            <div className="text-right">
              <h1 className="text-7xl font-bold">
                <span className="bg-gradient-to-r from-white via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
                  $111.4K
                </span>
              </h1>
              <p className="text-lg text-white">$312.3K remaining</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#0B1120] p-6">
            <div className="mb-2 flex items-center justify-between text-base">
              <div className="relative w-full">
                <span 
                  className="absolute whitespace-nowrap bg-gradient-to-r from-white via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent"
                  style={{ left: '15%', transform: 'translateX(-50%)' }}
                >
                  1 ETH = 1,476,947 OPENX
                </span>
                <span className="float-right text-3xl font-bold text-green-500">$500K</span>
              </div>
            </div>
            
            <div className="relative mb-2">
              {/* Current progress indicator */}
              <div 
                className="absolute top-0 h-6 w-0.5 bg-white" 
                style={{ left: '15%', zIndex: 20 }}
              />
              <Progress 
                value={15} 
                className="h-6 border border-white bg-[#1a1f2e] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:via-white [&>div]:to-green-400" 
              />
              {/* Milestone markers */}
              {MILESTONES.map((milestone, index) => (
                <div
                  key={milestone.position}
                  onClick={() => setSelectedMilestone(index)}
                  onMouseEnter={() => setSelectedMilestone(index)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                  className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{ left: `${milestone.position}%` }}
                >
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 size-4 rotate-45 border-2 border-white/30 bg-[#1a1f2e] transition-all hover:border-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Milestone information box */}
            <div className="mx-auto mt-6 w-4/5">
              <div className="min-h-[100px] rounded-lg border border-white/10 bg-[#1a1f2e] p-4 text-center transition-all">
                <div className="flex h-[100px] items-center justify-center">
                  {selectedMilestone !== null ? (
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-white">
                        {MILESTONES[selectedMilestone].title}
                      </h3>
                      <p className="mt-4 text-base text-gray-400">
                        {MILESTONES[selectedMilestone].description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg text-gray-400">
                      <span className="font-bold">Hover</span> or <span className="font-bold">tap</span> milestone markers to learn more about project phases
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`rounded-lg p-3 text-center text-base ${
                    method.id === 'eth' ? 'bg-blue-600' : 'bg-[#1a1f2e]'
                  }`}
                >
                  <i className={`${method.icon} mr-2`}></i>
                  {method.name}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="text-base text-gray-500">Your deposit</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg text-white">0.35 ETH</div>
                  <div className="text-base text-gray-500">Max Amount $1,000</div>
                </div>
              </div>

              <div>
                <div className="text-base text-gray-500">You will receive</div>
                <div className="text-lg text-white">316,438 OPENX</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                className="w-[300px] bg-gradient-to-r from-blue-600 to-green-400 text-white hover:opacity-90"
              >
                WalletConnect
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}