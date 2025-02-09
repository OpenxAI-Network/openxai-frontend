"use client"

import React from "react"
import Image from "next/image"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import SuccessModal from "@/components/genesis/Success"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useBalance } from "wagmi"
import { formatUnits } from "viem"

const MILESTONES = [
  { position: 25, title: "Community Launch", description: "Initial community token distribution" },
  { position: 50, title: "DEX Listing", description: "Token listed on major DEXes" },
  { position: 75, title: "CEX Integration", description: "Major CEX listings" },
  { position: 100, title: "Staking Launch", description: "Staking mechanism goes live" },
]

const PAYMENT_METHODS = [
  { id: 'eth', name: 'ETH', icon: '/icon.png' },
  { id: 'weth', name: 'WETH', icon: '/icon.png' },
  { id: 'usdc', name: 'USDC', icon: '/icon.png' },
  { id: 'usdt', name: 'USDT', icon: '/icon.png' },
]

export default function GenesisPage() {
  const [selectedMilestone, setSelectedMilestone] = React.useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = React.useState('eth')
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const {address} = useAccount();
  const {open} = useWeb3Modal();

  const {data: ethBalance} = useBalance({address})
  
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gradient-to-b from-[#1a1f2e] to-[#0B1120]">
        <SideMenu className="bg-gray-900" />
        <main className="ml-48 flex-1 p-8 pt-24">
          {/* Main stats and info container */}
          <div className="grid grid-cols-6 gap-4">
            {/* Amount section (columns 1-3) */}
            <div className="col-span-3">
              <h1 className="inline-flex items-baseline gap-4 text-7xl font-bold">
                <span className="bg-gradient-to-r from-white via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
                  $111.4K
                </span>
                <span className="text-lg text-white">$312.3K remaining</span>
              </h1>
            </div>

            {/* Info boxes (columns 4-6) */}
            <div className="relative col-span-1 rounded-lg border border-white bg-[#0B1120] p-4">
              <div className="text-gray-500">Ticker</div>
              <div className="text-white">$OPENX (ERC20)</div>
            </div>
            <div className="relative col-span-1 rounded-lg border border-white bg-[#0B1120] p-4">
              <div className="text-gray-500">Max per wallet</div>
              <div className="text-white">$1000</div>
            </div>
            <div className="relative col-span-1 rounded-lg border border-white bg-[#0B1120] p-4">
              <div className="text-gray-500">Contract</div>
              <a href="https://etherscan.io/#" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">0x84...84s4</a>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-6 flex items-center justify-between text-base">
              <div className="relative w-full">
                <span 
                  className="absolute whitespace-nowrap bg-gradient-to-r from-white via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent"
                  style={{ left: '15%', transform: 'translateX(-50%)' }}
                >
                  1 ETH = 1,476,947 OPENX
                </span>
                <span className="float-right text-3xl font-bold text-white">$500K</span>
              </div>
            </div>
            
            <div className="relative mb-6">
              {/* Current progress indicator */}
              <div 
                className="absolute top-0 h-6 w-0.5 bg-white" 
                style={{ left: '15%', zIndex: 20 }}
              />
              {/* Vertical connecting line */}
              <div 
                className="absolute bottom-full h-4 w-0.5 bg-white/30"
                style={{ left: '15%' }}
              />
              <Progress 
                value={15} 
                className="h-6 border border-white bg-[#1a1f2e] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:via-[#6B8DE6] [&>div]:to-[#8AB4FF]" 
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
            <div className="mx-auto mb-6 w-4/5">
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

            <div className="mb-6 grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`flex items-center justify-center gap-2 rounded-md p-3 text-center text-lg font-bold text-white transition-all
                    ${method.id === selectedPayment 
                      ? 'border-2 border-white bg-blue-600' 
                      : 'bg-[#1a1f2e] hover:border-2 hover:border-white'
                    }`}
                >
                  <Image
                    src={method.icon}
                    alt={method.name}
                    width={24}
                    height={24}
                    className="size-6"
                  />
                  {method.name}
                </button>
              ))}
            </div>

            <div className="mb-6 inline-block rounded-lg bg-gray-800/50 px-4 py-2">
              <span className="text-gray-300">Current balance: </span>
              {address && ethBalance ? (
                <span className="text-white">{formatUnits(ethBalance.value, ethBalance.decimals).substring(0, 5)} ETH</span>
              ) : (
                <span className="text-white">please connect wallet</span>
              )}
            </div>

            <div className="mb-6">
              <div className="mb-2 text-base text-gray-500">Your deposit</div>
              <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-[#1a1f2e] p-4">
                <div className="text-lg text-white">
                  0.35 ETH
                  <span className="text-sm text-gray-400"> ($950.13)</span>
                </div>
                <div className="rounded-lg bg-gray-800 px-4 py-2">
                  <span className="text-gray-300">Max Amount</span>
                  <span className="ml-2 text-white">$1,000</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-base text-gray-500">You will receive</div>
              <div className="mb-6">
                <div className="flex items-center rounded-lg border border-gray-700 bg-[#1a1f2e] p-4">
                  <span className="text-lg text-white">316,438 OPENX</span>
                </div>
              </div>              
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              className="w-[300px] bg-gradient-to-r from-blue-600 to-green-400 text-white hover:opacity-90"
              onClick={() => {if (address) {setShowSuccessModal(true)} else {open()}}}
            >
              WalletConnect
            </Button>
          </div>
        </main>
      </div>
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </>
  )
}