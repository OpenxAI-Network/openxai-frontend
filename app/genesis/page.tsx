"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import SuccessModal from "@/components/genesis/Success"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useBalance } from "wagmi"
import { formatUnits } from "viem"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

const MILESTONES = [
  {
    position: 15,
    title: "Content Creation",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1,279%",
    status: "Funded"
  },
  {
    position: 35,
    title: "Uniswap Listing & Liquidity",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1,279%",
    status: "Funded"
  },
  {
    position: 65,
    title: "30 Days in 30 Days Campaign",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1,279%",
    status: "Funded"
  }
]

const PAYMENT_METHODS = [
  { id: 'eth', name: 'ETH', icon: '/eth.png' },
  { id: 'weth', name: 'WETH', icon: '/weth.png' },
  { id: 'usdc', name: 'USDC', icon: '/usdc.png' },
  { id: 'usdt', name: 'USDT', icon: '/usdt.png' },
]

const EXCHANGE_RATES = {
  eth: { amount: 0.35, symbol: 'ETH', usdValue: 920.45, openxValue: 13149 },
  weth: { amount: 0.35, symbol: 'WETH', usdValue: 920.45, openxValue: 13149 },
  usdc: { amount: 920.45, symbol: 'USDC', usdValue: 920.45, openxValue: 13149 },
  usdt: { amount: 920.45, symbol: 'USDT', usdValue: 920.45, openxValue: 13149 }
}

export default function GenesisPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<"eth" | "weth" | "usdc" | "usdt">("eth")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const { data: ethBalance } = useBalance({ address })
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2025-02-27T00:00:00Z')
    
    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setCountdown({ days, hours, minutes, seconds })
    }

    // Update every second instead of every minute
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // FAQ Section Data
  const FAQS = [
    {
      question: "What is OpenxAI?",
      answer:
        "OpenxAI is a next-generation decentralized AI platform offering a comprehensive ecosystem for AI model deployment, tokenization, and community governance.",
    },
    {
      question: "Why should I choose OpenxAI? (Problems and Solutions)",
      answer:
        "OpenxAI addresses challenges in centralized AI—such as scalability, transparency, and cost inefficiency—by providing decentralized solutions with enhanced security and accountability.",
    },
    {
      question: "What are the key features and differentiators of OpenxAI?",
      answer:
        "OpenxAI offers tokenized AI models, decentralized governance, milestone-based funding, secure model hosting, and innovative staking mechanisms that set it apart.",
    },
    {
      question: "How does OpenxAI work (end-to-end workflow)?",
      answer:
        "From model deployment to monetization, OpenxAI streamlines the entire AI lifecycle with secure transactions, decentralized model hosting, and dynamic governance.",
    },
    {
      question: "What is the OpenxAI ecosystem?",
      answer:
        "The ecosystem encompasses AI model hosting, tokenization, staking, governance, and a vibrant marketplace connecting developers, investors, and users.",
    },
    {
      question: "How is tokenization of AI models and datasets managed?",
      answer:
        "OpenxAI leverages blockchain technology and standards like ERC-721/1155 to tokenize models and datasets, ensuring robust ownership rights and fair revenue distribution.",
    },
    {
      question: "How do staking, governance, and burn-to-vote mechanisms work?",
      answer:
        "Users stake tokens to participate in governance and influence platform decisions; the burn-to-vote mechanism adds accountability by requiring a token sacrifice to vote.",
    },
    {
      question: "What is milestone-based funding?",
      answer:
        "Funding is released in stages based on predetermined milestones, ensuring continuous progress, risk reduction, and accountability throughout a project's lifecycle.",
    },
    {
      question: "What is OpenxAI Studio and how do I get started?",
      answer:
        "OpenxAI Studio is the platform's integrated development environment where you can deploy and manage your AI models. It offers extensive onboarding documentation and tools.",
    },
    {
      question: "Where can I find further developer resources and API documentation?",
      answer:
        "Comprehensive developer resources, API references, and SDKs are available on the official documentation portal and our GitHub repositories.",
    },
  ]

  // Set the first FAQ open by default (index 0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0)

  return (
    <MobileResponsiveWrapper>
      {/* Disable interactions but without visual overlay */}
      <div className="pointer-events-auto" style={{ backgroundColor: 'transparent' }}>
        <div className="[@media(max-width:960px)]:mt-16">
          <main className="min-w-[320px] flex-1 overflow-x-auto p-4 pt-16 
            [@media(max-width:500px)]:pt-12 
            [@media(max-width:960px)]:pt-24 
            [@media(min-width:960px)]:p-8 
            [@media(min-width:960px)]:pt-20">
            <div className="px-safe">
              {/* Countdown Section - reduced top margin */}
              <div className="mb-16 text-center">
                <div className="mb-2 text-[18px] font-normal text-white">
                  Starting soon
                </div>
                <div className="mb-8 text-[60px] font-medium leading-tight text-white">
                  {countdown.days}D: {countdown.hours}H: {countdown.minutes}M: {countdown.seconds}S
                </div>

                {/* Social Media Buttons - Desktop (≥960px) */}
                <div className="mt-12 hidden justify-center gap-12 px-4 [@media(min-width:960px)]:flex">
                  {/* Twitter/X Button with gradient */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-[24px] font-bold text-white">1.</span>
                    <a href="https://x.com/OpenxAINetwork" target="_blank" rel="noopener noreferrer" className="relative block">
                      <div className="relative">
                        <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#829ED1] to-[#0059FE]" />
                        <div className="relative flex flex-col items-center rounded-lg bg-[#1F2021] px-6 py-3 hover:bg-[#2a2a2a]">
                          <div className="flex items-center gap-2">
                            <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                            </svg>
                            <span className="text-lg text-white">Follow @OpenXAI</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">500 OPENX (Points)</div>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Telegram Button with gradient */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-[24px] font-bold text-white">2.</span>
                    <a href="https://t.me/OpenxAINetwork" target="_blank" rel="noopener noreferrer" className="relative block">
                      <div className="relative">
                        <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#B2FE00] to-[#829ED1]" />
                        <div className="relative flex flex-col items-center rounded-lg bg-[#1F2021] px-6 py-3 hover:bg-[#2a2a2a]">
                          <div className="flex items-center gap-2">
                            <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z" />
                            </svg>
                            <span className="text-lg text-white">Join @OpenXAI</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">500 OPENX (Points)</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Social Media Buttons - Mobile (<960px) */}
                <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 [@media(min-width:960px)]:hidden">
                  {/* Mobile Twitter/X Box */}
                  <a 
                    href="https://x.com/OpenxAINetwork" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="relative block w-full hover:opacity-80"
                  >
                    <div className="relative w-full">
                      <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#829ED1] to-[#0059FE]" />
                      <div className="relative flex h-[80px] items-center rounded-lg bg-[#1F2021] p-6">
                        <span className="absolute left-6 text-2xl font-bold text-white">1.</span>
                        <div className="ml-12 flex w-full flex-col items-center">
                          <div className="flex items-center gap-2">
                            <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                            </svg>
                            <span className="text-lg text-white [@media(max-width:400px)]:text-sm">Follow @OpenXAI</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400 [@media(max-width:400px)]:text-xs">500 OPENX (Points)</div>
                        </div>
                      </div>
                    </div>
                  </a>

                  {/* Mobile Telegram Box */}
                  <a 
                    href="https://t.me/OpenxAINetwork" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative block w-full hover:opacity-80"
                  >
                    <div className="relative w-full">
                      <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-[#B2FE00] to-[#829ED1]" />
                      <div className="relative flex h-[80px] items-center rounded-lg bg-[#1F2021] p-6">
                        <span className="absolute left-6 text-2xl font-bold text-white">2.</span>
                        <div className="ml-12 flex w-full flex-col items-center">
                          <div className="flex items-center gap-2">
                            <svg className="size-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z" />
                            </svg>
                            <span className="text-lg text-white [@media(max-width:400px)]:text-sm">Join @OpenXAI</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400 [@media(max-width:400px)]:text-xs">500 OPENX (Points)</div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Main content */}
              <div className="relative z-[5]">
                {/* Main stats and info container */}
                <div className="grid grid-cols-1 gap-4 [@media(min-width:960px)]:grid-cols-6">
                  {/* Amount section */}
                  <div className="[@media(min-width:960px)]:col-span-3">
                    <h1 className="inline-flex items-baseline gap-4 text-4xl [@media(min-width:960px)]:text-7xl">
                      <span className="text-white">$111.4K</span>
                      <span className="text-base text-white [@media(min-width:960px)]:text-lg">$312.3K remaining</span>
                    </h1>
                  </div>

                  {/* Info boxes */}
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white">Ticker</div>
                      <div className="text-white">$OPENX (ERC20)</div>
                    </div>
                  </div>
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white">Max per wallet</div>
                      <div className="text-white">$1,000</div>
                    </div>
                  </div>
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white">Contract</div>
                      <a href="https://etherscan.io/#" target="_blank" rel="noopener noreferrer" className="text-white underline hover:opacity-80">0x84...84s4</a>
                    </div>
                  </div>
                </div>

                {/* Progress bar section */}
                <div className="my-8 h-px w-full bg-[#505050]" />
                <div className="mt-6">
                  <div className="mb-6 flex flex-col items-start justify-between text-base [@media(min-width:400px)]:flex-row [@media(min-width:400px)]:items-center">
                    <div className="mb-2 [@media(min-width:400px)]:mb-0">
                      <span className="text-white">1 ETH = 1,476,947 OPENX</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-white">$500K</span>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    {/* Progress bar */}
                    <Progress
                      value={15}
                      className="h-6 border border-white bg-[#1F2021] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:to-[#122BEA]" 
                    />

                    {/* Milestone markers */}
                    {MILESTONES.map((milestone, index) => (
                      <div
                        key={index}
                        className="absolute top-0"
                        style={{ left: `${milestone.position}%` }}
                      >
                        {/* Vertical dotted line */}
                        <div className="h-6 w-px border-l border-dotted border-white/30 [@media(max-width:400px)]:h-3 [@media(max-width:650px)]:h-4" />

                        {/* Play icon triangle - rotated 90 degrees */}
                        <div
                          className="mt-2 cursor-pointer transition-all hover:opacity-80 [@media(max-width:400px)]:mt-0.5 [@media(max-width:650px)]:mt-1"
                          onMouseEnter={() => setSelectedMilestone(index)}
                          onMouseLeave={() => setSelectedMilestone(null)}
                        >
                          <div className="rotate-90 border-x-[6px] border-b-8 border-solid border-x-transparent border-b-white/30" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Milestone table with horizontal scroll */}
                  <div className="relative -mx-4 w-full overflow-x-auto px-4">
                    <div className="min-w-[800px]"> {/* Fixed width to ensure all columns are visible */}
                      <div className="w-full align-middle">
                        <div className="overflow-hidden rounded-lg border border-[#454545]">
                          <table className="w-full table-auto border-collapse bg-[#1F2021]">
                            <thead>
                              <tr>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Project Name</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Funding Goal</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Deadline</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Backers Rewards</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Flash Bonus</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Reward APY</th>
                                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {MILESTONES.map((milestone, index) => (
                                <tr
                                  key={index}
                                  className="text-sm transition-colors hover:bg-white/5"
                                >
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.title}</td>
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.fundingGoal}</td>
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.deadline}</td>
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.backersRewards}</td>
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.flashBonus}</td>
                                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">{milestone.rewardAPY}</td>
                                  <td className="border-0 p-4 [@media(max-width:400px)]:p-[2px] [@media(max-width:650px)]:p-1 [@media(max-width:960px)]:p-2">
                                    <span className="bg-gradient-to-r from-white to-green-500 bg-clip-text text-sm text-transparent [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                                      {milestone.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment method buttons container */}
                <div className="mb-16 w-full [@media(min-width:960px)]:w-1/2">
                  <div className="my-10 text-xl font-bold text-white">Your deposit</div>
                  <div className="grid grid-cols-4 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id as "eth" | "weth" | "usdc" | "usdt")}
                        className={`relative flex h-10 items-center justify-center rounded-md p-1.5 transition-all
                          ${method.id === selectedPayment 
                            ? 'bg-blue-600' 
                            : 'bg-[#1F2021] hover:bg-[#2a2a2a]'
                          }`}
                      >
                        <Image
                          src={method.icon}
                          alt={method.name}
                          width={32}
                          height={32}
                          className="size-8"
                        />
                        {method.id === selectedPayment && (
                          <div className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-green-500">
                            <svg className="size-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current balance box - with restored spacing */}
                <div className="mb-16 mt-8 inline-block rounded-lg bg-[#5C5C5C] px-4 py-2">
                  <span className="text-gray-300">Current balance: </span>
                  {address && ethBalance ? (
                    <span className="text-white">{formatUnits(ethBalance.value, ethBalance.decimals).substring(0, 5)} ETH</span>
                  ) : (
                    <span className="text-white">please connect wallet</span>
                  )}
                </div>

                {/* ETH amount box - restored original width */}
                <div className="mb-6 w-full [@media(min-width:960px)]:w-1/2">
                  <div className="flex h-[60px] items-center justify-between rounded-lg border border-gray-700 bg-[#1F2021] p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={`/${selectedPayment}.png`}
                        alt={selectedPayment.toUpperCase()}
                        width={32}
                        height={32}
                        className="size-8"
                      />
                      <div className="flex flex-col">
                        <div className="text-xl font-bold text-white">
                          {EXCHANGE_RATES[selectedPayment].amount} {EXCHANGE_RATES[selectedPayment].symbol}
                        </div>
                        <div className="text-sm text-gray-400">
                          (${EXCHANGE_RATES[selectedPayment].usdValue.toLocaleString()})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Max Amount:</span>
                      <span className="rounded-md bg-[#5C5C5C] px-2 py-1 text-white">$1,000</span>
                    </div>
                  </div>
                </div>

                {/* Gradient Divider with Text - align with content above/below on desktop */}
                <div className="my-8 w-full [@media(min-width:960px)]:w-1/2">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#454545] to-transparent" />
                    <div className="font-inter text-[13px] font-normal text-[#6A6A6A]">You will receive 
                      <span className="text-lg text-white"> 13,149 </span>
                      <span className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-lg font-medium text-transparent">
                        OPENX
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#454545] to-transparent" />
                  </div>
                </div>

                {/* OPENX amount box */}
                <div className="w-full [@media(min-width:960px)]:w-1/2">
                  <div className="flex h-[60px] items-center gap-3 rounded-lg border border-gray-700 bg-[#1F2021] p-4">
                    <Image 
                      src="/openxai-logo.png"
                      alt="OpenXAI"
                      width={28}
                      height={28}
                    />
                    <span className="text-lg text-white">13,149 OPENX</span>
                  </div>
                </div>
              </div>

              {/* WalletConnect button - restore original desktop layout */}
              <Button
                className="mt-10 h-[40px] w-full bg-[#2D63F6] text-xl font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 [@media(min-width:960px)]:w-[calc(100%/6)]"
                onClick={() => {if (address) {setShowSuccessModal(true)} else {open()}}}
                disabled={countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0}
              >
                WalletConnect
              </Button>
            </div>

            {/* FAQ Section */}
            <div className="mt-32 w-full px-4">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div key={index} className="rounded-lg bg-[#1F2021] p-4">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                      className="flex w-full justify-between text-left text-lg font-semibold text-white focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <span>{openFaqIndex === index ? "-" : "+"}</span>
                    </button>
                    {openFaqIndex === index && (
                      <div className="mt-2 text-base text-gray-300">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </MobileResponsiveWrapper>
  )
}