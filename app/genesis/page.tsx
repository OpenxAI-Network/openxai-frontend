"use client"

import React, { useState, useEffect } from "react"
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
    const targetDate = new Date('2025-02-21T00:00:00Z')
    
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
    <>
      <Header />
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(20,28,43,0.9)_0%,_#0B0B0B_100%)]">
        <SideMenu className="bg-[radial-gradient(100%_100%_at_50%_50%,_#5C5C5C_0%,_#242424_100%)] bg-[length:100vw_100vh]" />
        <main className="ml-48 flex-1 p-8 pt-24">
          {/* Countdown Section */}
          <div className="mb-24 text-center">
            <div className="mb-2 text-lg text-white">Starting soon</div>
            <div className="mb-2 text-6xl font-bold text-white">
              {countdown.days}D: {countdown.hours}H: {countdown.minutes}M: {countdown.seconds}S
            </div>
            <a 
              href="/earn" 
              className="text-yellow-400 underline hover:text-yellow-300"
            >
              Until launch you can still Earn tokens here
            </a>
          </div>

          {/* Disabled overlay */}
          <div className="relative">
            <div className="absolute -inset-6 z-10 flex cursor-not-allowed bg-black/50" 
                 title="Available after launch">
              <div className="flex h-full w-full items-center justify-center">
                <svg className="size-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m0 0h4" />
                </svg>
              </div>
            </div>

            {/* Existing content wrapped in relative div */}
            <div className="relative z-[5]">
              {/* Main stats and info container */}
              <div className="grid grid-cols-6 gap-4">
                {/* Amount section (columns 1-3) */}
                <div className="col-span-3">
                  <h1 className="inline-flex items-baseline gap-4 text-7xl">
                    <span className="text-white">
                      $111.4K
                    </span>
                    <span className="text-lg text-white">$312.3K remaining</span>
                  </h1>
                </div>

                {/* Info boxes (columns 4-6) */}
                <div className="relative col-span-1 flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-['']">
                  <div className="relative z-10 flex w-full flex-col justify-center text-center">
                    <div className="text-white">Ticker</div>
                    <div className="text-white">$OPENX (ERC20)</div>
                  </div>
                </div>
                <div className="relative col-span-1 flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-['']">
                  <div className="relative z-10 flex w-full flex-col justify-center text-center">
                    <div className="text-white">Max per wallet</div>
                    <div className="text-white">$1,000</div>
                  </div>
                </div>
                <div className="relative col-span-1 flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-['']">
                  <div className="relative z-10 flex w-full flex-col justify-center text-center">
                    <div className="text-white">Contract</div>
                    <a href="https://etherscan.io/#" target="_blank" rel="noopener noreferrer" className="text-white underline hover:opacity-80">0x84...84s4</a>
                  </div>
                </div>
              </div>

              {/* Horizontal divider */}
              <div className="my-8 h-px w-full bg-[#505050]" />

              <div className="mt-6">
                <div className="mb-6 flex items-center justify-between text-base">
                  <div className="relative w-full">
                    <span className="absolute whitespace-nowrap text-white" style={{ left: '15%', transform: 'translateX(-50%)' }}>
                      1 ETH = 1,476,947 OPENX
                    </span>
                    <span className="float-right text-3xl font-bold text-white">$500K</span>
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
                      <div className="h-6 w-px border-l border-dotted border-white/30" />
                      
                      {/* Play icon triangle - rotated 90 degrees */}
                      <div 
                        className="mt-2 cursor-pointer transition-all hover:opacity-80"
                        onMouseEnter={() => setSelectedMilestone(index)}
                        onMouseLeave={() => setSelectedMilestone(null)}
                      >
                        <div className="size-0 rotate-90 border-x-[6px] border-b-8 border-solid border-x-transparent border-b-white/30" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Milestone table */}
                <div className="mt-10 overflow-x-auto">
                  <table className="w-full rounded-lg bg-[#1F2021]">
                    <thead>
                      <tr className="border-b border-gray-700 text-left text-base font-bold text-white">
                        <th className="rounded-tl-lg p-4">Project Name</th>
                        <th className="p-4">Funding Goal</th>
                        <th className="p-4">Deadline</th>
                        <th className="p-4">Backers Rewards</th>
                        <th className="p-4">Flash Bonus</th>
                        <th className="p-4">Reward APY</th>
                        <th className="rounded-tr-lg p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MILESTONES.map((milestone, index) => (
                        <tr 
                          key={index}
                          className={`text-sm text-white transition-all
                            ${selectedMilestone === index ? 'font-bold' : 'font-normal'}
                            ${index === MILESTONES.length - 1 ? 'last:rounded-b-lg' : ''}
                          `}
                        >
                          <td className="p-4">{milestone.title}</td>
                          <td className="p-4">{milestone.fundingGoal}</td>
                          <td className="p-4">{milestone.deadline}</td>
                          <td className="p-4">{milestone.backersRewards}</td>
                          <td className="p-4">{milestone.flashBonus}</td>
                          <td className="p-4">{milestone.rewardAPY}</td>
                          <td className="p-4">
                            <span className="bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">
                              {milestone.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payment method buttons container - 50% width */}
                <div className="mb-6 w-1/2">
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

                <div className="mb-16 inline-block rounded-lg bg-[#5C5C5C] px-4 py-2">
                  <span className="text-gray-300">Current balance: </span>
                  {address && ethBalance ? (
                    <span className="text-white">{formatUnits(ethBalance.value, ethBalance.decimals).substring(0, 5)} ETH</span>
                  ) : (
                    <span className="text-white">please connect wallet</span>
                  )}
                </div>

                <div className="mb-6 w-1/2">
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

                <div className="w-1/2">
                  <div className="flex h-[60px] items-center rounded-lg border border-gray-700 bg-[#1F2021] p-4">
                    <span className="text-lg text-white">13,149 OPENX</span>
                  </div>
                </div>
              </div>

              {/* WalletConnect button */}
              <Button
                className="mt-10 h-[40px] w-[calc(100%/6)] bg-[#2D63F6] text-xl font-bold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {if (address) {setShowSuccessModal(true)} else {open()}}}
                disabled={countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0}
              >
                WalletConnect
              </Button>
            </div>
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
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </>
  )
}