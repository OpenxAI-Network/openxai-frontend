"use client"

import React, { useState } from "react"
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
  { id: 'eth', name: 'ETH', icon: '/eth.png' },
  { id: 'weth', name: 'WETH', icon: '/weth.png' },
  { id: 'usdc', name: 'USDC', icon: '/usdc.png' },
  { id: 'usdt', name: 'USDT', icon: '/usdt.png' },
]

export default function GenesisPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState("eth")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const { data: ethBalance } = useBalance({ address })

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
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
        <SideMenu className="bg-[radial-gradient(100%_100%_at_50%_50%,_#5C5C5C_0%,_#242424_100%)] bg-[length:100vw_100vh] bg-[position:0_0]" />
        <main className="ml-48 flex-1 p-8 pt-24">
          {/* Main stats and info container */}
          <div className="grid grid-cols-6 gap-4">
            {/* Amount section (columns 1-3) */}
            <div className="col-span-3">
              <h1 className="inline-flex items-baseline gap-4 text-7xl font-bold">
                <span className="text-white">
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

          <div className="mt-16">
            <Button
              className="h-[60px] w-[420px] bg-[#2D63F6] text-white hover:opacity-90"
              onClick={() => {if (address) {setShowSuccessModal(true)} else {open()}}}
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
                <div key={index} className="rounded-lg bg-[#1a1f2e] p-4">
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