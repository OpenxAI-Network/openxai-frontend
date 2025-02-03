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
  { id: 'eth', name: 'ETH', icon: '⟠' },
  { id: 'usdc', name: 'USDC', icon: '$' },
  { id: 'usdt', name: 'USDT', icon: '$' },
  { id: 'sol', name: 'SOL', icon: '◎' },
]

export default function GenesisPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-black">
        <SideMenu />
        <main className="ml-48 flex-1 p-8 pt-24">
          <div className="mb-6 text-right">
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-[#4776E6] via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
                $111.4K
              </span>
            </h1>
            <p className="text-gray-500">$312.3K remaining</p>
          </div>

          <div className="rounded-xl bg-[#0B1120] p-6">
            <div className="mb-6 flex justify-between text-sm">
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

            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">1 ETH = 1,476,947 OPENX</span>
              <span className="text-2xl font-medium text-green-500">$500K</span>
            </div>
            
            <div className="relative mb-8">
              <Progress 
                value={15} 
                className="h-1.5 border border-white/10 bg-[#1a1f2e] [&>div]:bg-blue-600" 
              />
              {MILESTONES.map((milestone) => (
                <div
                  key={milestone.position}
                  className="absolute top-0 -mt-1 size-3 cursor-pointer rounded-full border border-white/20 bg-[#1a1f2e]"
                  style={{ left: `${milestone.position}%`, transform: 'translateX(-50%)' }}
                  title={`${milestone.title}: ${milestone.description}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`rounded-lg p-3 text-center text-sm ${
                    method.id === 'eth' ? 'bg-blue-600' : 'bg-[#1a1f2e]'
                  }`}
                >
                  <span className="mr-2">{method.icon}</span>
                  {method.name}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Your deposit</div>
                <div className="flex items-center justify-between">
                  <div className="text-white">0.35 ETH</div>
                  <div className="text-sm text-gray-500">Max Amount $1,000</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">You will receive</div>
                <div className="text-white">316,438 OPENX</div>
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