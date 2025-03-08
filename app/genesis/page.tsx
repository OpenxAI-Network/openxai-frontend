"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/data/projects"
import { ObjectFilter } from "@/openxai-indexer/nodejs-app/api/filter"
import { FilterEventsReturn } from "@/openxai-indexer/nodejs-app/api/return-types"
import { OpenxAIContract } from "@/openxai-indexer/nodejs-app/contracts/OpenxAI"
import { OpenxAIGenesisContract } from "@/openxai-indexer/nodejs-app/contracts/OpenxAIGenesis"
import { Participated } from "@/openxai-indexer/nodejs-app/types/genesis/events"
import { replacer, reviver } from "@/openxai-indexer/nodejs-app/utils/json"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import axios from "axios"
import { AlertTriangleIcon } from "lucide-react"
import {
  Address,
  erc20Abi,
  formatUnits,
  parseAbi,
  parseEther,
  parseUnits,
} from "viem"
import { mainnet, sepolia } from "viem/chains"
import { useAccount, useBalance, useChainId, useReadContract } from "wagmi"
import { useQuery } from "wagmi/query"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

import { formatNumber, PROJECT_RATE } from "@/lib/openxai"
import { cn } from "@/lib/utils"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { chains } from "@/components/custom/web3-provider"
import SuccessModal from "@/components/genesis/Success"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

// Calculate positions with padding at start/end
const MILESTONES = projects.map((project, index) => {
  // Use 10% padding on each end (start at 10%, end at 90%)
  const position = 10 + (80 / (projects.length - 1)) * index
  return {
    position: `calc(${position}% - 4px)`,
    projectId: project.id,
    name: project.name,
  }
})

const PAYMENT_METHODS = [
  { id: "eth", name: "ETH", icon: "/eth.png" },
  { id: "weth", name: "WETH", icon: "/weth.png" },
  { id: "usdc", name: "USDC", icon: "/usdc.png" },
  { id: "usdt", name: "USDT", icon: "/usdt.png" },
]

const CHAIN_INFO = {
  [mainnet.id]: {
    ethOracle: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    wrappedEth: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
    },
    USDC: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    USDT: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
    },
  },
  [sepolia.id]: {
    ethOracle: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    wrappedEth: {
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
      decimals: 18,
    },
    USDC: {
      address: "0xC69258C33cCFD5d2F862CAE48D4F869Db59Abc6A",
      decimals: 6,
    },
    USDT: {
      address: "0xC69258C33cCFD5d2F862CAE48D4F869Db59Abc6A",
      decimals: 6,
    },
  },
} as const

const FAQS = [
  {
    question: "What is the OpenxAI Genesis Event?",
    answer:
      "The OpenxAI Genesis Event is a milestone-based funding initiative that supports the development of the OpenxAI ecosystem. It uses a secure escrow contract system to ensure funds are properly allocated as development milestones are achieved.",
  },
  {
    question: "What is milestone-based funding?",
    answer:
      "Milestone-based funding releases funds in stages based on predetermined project milestones. This ensures continuous progress, reduces risk, and maintains accountability throughout the project's lifecycle.",
  },
  {
    question: "How does the funding mechanism work?",
    answer:
      "Funds are held in a secure escrow contract until each milestone is completed. Once a milestone is achieved and verified, the corresponding portion of funds is released to support the next phase of development.",
  },
  {
    question: "What are the funding limits per wallet?",
    answer:
      "During the initial critical milestone funding phase, there is no limit per wallet. Once the critical milestone funding target is reached, a maximum limit of $1,000 per wallet will be implemented to ensure fair distribution of allocation.",
  },
  {
    question: "What happens if a milestone is not reached?",
    answer:
      "If a milestone is not achieved, the remaining funds stay locked in the escrow contract, protecting contributors' investments. This ensures project accountability and proper resource management.",
  },
  {
    question: "How are milestone completions verified?",
    answer:
      "Each milestone has specific deliverables and criteria that must be met. The completion is verified through transparent on-chain mechanisms and community governance processes.",
  },
  {
    question: "What are the benefits of this funding model?",
    answer:
      "This model provides greater security for contributors, ensures project accountability, enables steady development progress, and allows for community oversight of fund utilization.",
  },
  {
    question: "How can I track milestone progress?",
    answer:
      "Progress can be tracked through our transparent dashboard showing milestone status, fund allocation, and project updates. The escrow contract is publicly viewable on Etherscan.",
  },
  {
    question: "Where can I learn more about OpenxAI?",
    answer:
      'Check out our <a href="https://docs.openxai.org" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:opacity-80">documentation portal</a> to learn more about the OpenxAI ecosystem or products and the OPENX token.',
  },
]

export default function GenesisPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    null
  )
  const [selectedPayment, setSelectedPayment] = useState<
    "eth" | "weth" | "usdc" | "usdt"
  >("eth")
  const [paymentAmount, setPaymentAmount] = useState(BigInt(0))
  const [paymentAmountInput, setPaymentAmountInput] = useState("0")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()
  const chainInfo =
    chainId === mainnet.id || chainId == sepolia.id
      ? CHAIN_INFO[chainId]
      : undefined
  const { open } = useWeb3Modal()
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [highlightedProject, setHighlightedProject] = useState<string | null>(
    null
  )

  const { performTransaction, performingTransaction, loggers } =
    usePerformTransaction({})

  const { data: ethBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: wethBalance } = useReadContract({
    abi: erc20Abi,
    address: chainInfo?.wrappedEth?.address as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!chainInfo && !!address,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: usdcBalance } = useReadContract({
    abi: erc20Abi,
    address: chainInfo?.USDC?.address as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!chainInfo && !!address,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: usdtBalance } = useReadContract({
    abi: erc20Abi,
    address: chainInfo?.USDT?.address as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!chainInfo && !!address,
      refetchInterval: 10_000, // 10s
    },
  })

  const { data: ethPriceRaw } = useReadContract({
    abi: parseAbi([
      "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    ]),
    address: chainInfo?.ethOracle as Address,
    functionName: "latestRoundData",
    query: {
      enabled: !!chainInfo,
      refetchInterval: 10_000, // 10s
    },
  })
  const ethPrice = useMemo(
    () =>
      ethPriceRaw ? parseFloat(formatUnits(ethPriceRaw[1], 8)) : undefined,
    [ethPriceRaw]
  )

  const selectedToken = useMemo(() => {
    return selectedPayment === "eth"
      ? {
          symbol: "ETH",
          isEth: true,
          balance: ethBalance?.value,
          decimals: 18,
        }
      : selectedPayment === "weth"
        ? {
            symbol: "WETH",
            isEth: true,
            balance: wethBalance,
            decimals: chainInfo?.wrappedEth.decimals ?? 18,
          }
        : selectedPayment === "usdc"
          ? {
              symbol: "USDC",
              isEth: false,
              balance: usdcBalance,
              decimals: chainInfo?.USDC?.decimals ?? 6,
            }
          : selectedPayment === "usdt"
            ? {
                symbol: "USDT",
                isEth: false,
                balance: usdtBalance,
                decimals: chainInfo?.USDT?.decimals ?? 6,
              }
            : {
                symbol: "UNKNOWN",
                isEth: false,
                balance: BigInt(0),
                decimals: 0,
              }
  }, [selectedPayment, wethBalance, usdcBalance, usdtBalance, chainInfo])
  useEffect(() => {
    if (selectedToken.balance !== undefined) {
      const newPaymentAmount =
        selectedPayment === "eth"
          ? selectedToken.balance - parseEther("0.001") // Keep some eth to pay for gas fee
          : selectedToken.balance
      setPaymentAmount(newPaymentAmount)
      setPaymentAmountInput(
        parseFloat(
          formatUnits(newPaymentAmount, selectedToken.decimals)
        ).toFixed(selectedToken.isEth ? 4 : 2)
      )
    }
  }, [selectedToken])

  const usdValue = useMemo(
    () =>
      selectedToken.isEth
        ? ethPrice !== undefined
          ? parseFloat(formatUnits(paymentAmount, selectedToken.decimals)) *
            ethPrice
          : undefined
        : parseFloat(formatUnits(paymentAmount, selectedToken.decimals)),
    [selectedToken, ethPrice, paymentAmount]
  )

  const { data: participateEvents, refetch: participateRefretch } = useQuery({
    queryKey: ["participate"],
    refetchInterval: 10_000, // 10s
    queryFn: async () => {
      const filter: ObjectFilter = {
        chainId: {
          equal: chainId,
        },
        type: {
          equal: "Participated",
        },
      }
      return await axios
        .post(
          "https://indexer.openxai.org/filterEvents",
          JSON.parse(JSON.stringify(filter, replacer))
        )
        .then((res) => res.data)
        .then(
          (data) =>
            JSON.parse(JSON.stringify(data), reviver) as FilterEventsReturn
        )
    },
  }) as { data: Participated[]; refetch: () => {} }

  const currentUsd = useMemo(
    () =>
      participateEvents
        ? parseFloat(
            formatUnits(
              participateEvents.reduce(
                (prev, cur) => prev + cur.amount,
                BigInt(0)
              ),
              6
            )
          )
        : 0,
    [participateEvents]
  )
  const myUsd = useMemo(
    () =>
      participateEvents && address
        ? parseFloat(
            formatUnits(
              participateEvents
                .filter(
                  (e) => e.account.toLowerCase() === address.toLowerCase()
                )
                .reduce((prev, cur) => prev + cur.amount, BigInt(0)),
              6
            )
          )
        : 0,
    [participateEvents, address]
  )
  const currentProject = useMemo(
    () =>
      participateEvents
        ? participateEvents.reduce(
            (prev, cur) => Math.max(prev, Number(cur.tier)), // NOTE: tier is 0 indexed, while projects "id" is 1 indexed
            0
          )
        : 0,
    [participateEvents]
  )

  const receiveOpenx = useMemo(() => {
    if (!usdValue) {
      return { openx: 0, valueLeft: 0 }
    }

    const tiers = projects
      .filter((p) => parseInt(p.id) > currentProject)
      .map((p) => {
        let usd = parseInt(p.fundingGoal)
        const id = parseInt(p.id) - 1
        if (id === currentProject) {
          usd -= parseFloat(
            formatUnits(
              participateEvents
                ?.filter((p) => p.tier === BigInt(id))
                ?.reduce((prev, cur) => prev + cur.amount, BigInt(0)) ??
                BigInt(0),
              6
            )
          )
        }
        return {
          usd,
          rate: PROJECT_RATE[id],
        }
      })

    let valueLeft = usdValue
    let openx = 0
    let tierIndex = 0
    while (valueLeft > 0 && tierIndex < tiers.length) {
      const tier = tiers[tierIndex]
      const amountInTier = Math.min(valueLeft, tier.usd)
      openx += amountInTier * tier.rate
      valueLeft -= amountInTier
      tierIndex++
    }

    return { openx, valueLeft }
  }, [usdValue, currentProject])

  const tokenAddress = useMemo(() => {
    if (!chainInfo || selectedPayment === "eth") return undefined

    let erc20Address: Address
    switch (selectedPayment) {
      case "weth":
        erc20Address = chainInfo.wrappedEth.address
        break
      case "usdc":
        erc20Address = chainInfo.USDC.address
        break
      case "usdt":
        erc20Address = chainInfo.USDT.address
        break
    }
    return erc20Address
  }, [selectedPayment])
  const { data: tokenAllowance, refetch: refetchTokenAllowance } =
    useReadContract({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "allowance",
      args: [address as Address, OpenxAIGenesisContract.address],
      query: {
        enabled: !!address && !!tokenAddress,
        refetchInterval: 1_000, // 1s
      },
    })

  useEffect(() => {
    const targetDate =
      chainId === sepolia.id
        ? new Date("2025-01-01T00:00:00Z")
        : new Date("2025-03-10T00:00:00Z")

    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    // Update every second instead of every minute
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Set the first FAQ open by default (index 0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0)

  const [expectedContribution, setExpectedContribution] = useState({
    currency: "",
    openx: "",
  })

  // Add this state for table visibility
  const [isTableVisible, setIsTableVisible] = useState(false)

  // First 100k is unlimited, afterward max 1000 per address
  const maxAmount = useMemo(() => {
    return Math.max(100_000 - currentUsd, Math.max(0, 1_000 - myUsd))
  }, [currentUsd, myUsd])
  const overMaxAmount = useMemo(() => {
    return usdValue !== undefined && usdValue > maxAmount
  }, [usdValue, maxAmount])

  return (
    <MobileResponsiveWrapper>
      {/* Disable interactions but without visual overlay */}
      <div
        className="pointer-events-auto"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="[@media(max-width:960px)]:mt-16">
          <main
            className="min-w-[320px] flex-1 overflow-x-auto p-4 pt-0 [@media(max-width:500px)]:pt-0 
            [@media(max-width:960px)]:pt-0 
            [@media(min-width:960px)]:p-8 [@media(min-width:960px)]:pt-2"
          >
            <div className="px-safe">
              {/* Gradient Text Section - minimal top spacing */}
              <div className="mb-16 mt-0 text-center">
                <h2 className="font-inter text-3xl font-medium leading-tight [@media(min-width:960px)]:text-4xl">
                  <div className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
                  AI is no longer limited to mega corporations.
                  </div>
                  <div className="mt-3 bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
                  OpenxAI Genesis is a milestone-based fair launch initiative.
                  </div>
                  <div className="mt-3 bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
                  <a 
                    href="https://medium.com/openxai" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-2xl text-gray-400 underline transition-colors hover:opacity-80"
                  >
                    How to participate
                  </a>
                  </div>

                </h2>
              </div>

              {/* Countdown Section - reduced top margin */}
              <div className="mb-16 text-center">
                <div className="mb-2 text-[18px] font-normal text-white">
                  Starting soon
                </div>
                <div className="mb-8 text-[60px] font-medium leading-tight text-white">
                  {countdown.days}D: {countdown.hours}H: {countdown.minutes}M:{" "}
                  {countdown.seconds}S
                </div>

                {/* Social Media Buttons - Desktop (≥960px) */}
                <div className="mt-12 hidden justify-center gap-12 px-4 [@media(min-width:960px)]:flex">
                  {/* Twitter/X Button with gradient */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-[24px] font-bold text-white">1.</span>
                    <a
                      href="https://x.com/OpenxAINetwork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block"
                    >
                      <div className="relative">
                        <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#829ED1] to-[#0059FE]" />
                        <div className="relative flex flex-col items-center rounded-lg bg-[#1F2021] px-6 py-3 hover:bg-[#2a2a2a]">
                          <div className="flex items-center gap-2">
                            <svg
                              className="size-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                            </svg>
                            <span className="text-lg text-white">
                              Follow @OpenxAI
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            500 OPENX (Points)
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Telegram Button with gradient */}
                  <div className="relative flex items-center gap-3">
                    <span className="text-[24px] font-bold text-white">2.</span>
                    <a
                      href="https://t.me/OpenxAINetwork"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block"
                    >
                      <div className="relative">
                        <div className="absolute -inset-px rounded-lg bg-gradient-to-t from-[#B2FE00] to-[#829ED1]" />
                        <div className="relative flex flex-col items-center rounded-lg bg-[#1F2021] px-6 py-3 hover:bg-[#2a2a2a]">
                          <div className="flex items-center gap-2">
                            <svg
                              className="size-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z" />
                            </svg>
                            <span className="text-lg text-white">
                              Join @OpenxAI
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            500 OPENX (Points)
                          </div>
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
                        <span className="absolute left-6 text-2xl font-bold text-white">
                          1.
                        </span>
                        <div className="ml-12 flex w-full flex-col items-center">
                          <div className="flex items-center gap-2">
                            <svg
                              className="size-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
                            </svg>
                            <span className="text-lg text-white [@media(max-width:400px)]:text-sm">
                              Follow @OpenXAI
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400 [@media(max-width:400px)]:text-xs">
                            500 OPENX (Points)
                          </div>
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
                        <span className="absolute left-6 text-2xl font-bold text-white">
                          2.
                        </span>
                        <div className="ml-12 flex w-full flex-col items-center">
                          <div className="flex items-center gap-2">
                            <svg
                              className="size-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z" />
                            </svg>
                            <span className="text-lg text-white [@media(max-width:400px)]:text-sm">
                              Join @OpenXAI
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-400 [@media(max-width:400px)]:text-xs">
                            500 OPENX (Points)
                          </div>
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
                      <span className="text-white">
                        ${formatNumber(currentUsd)}
                      </span>
                      <span className="text-base text-white [@media(min-width:960px)]:text-lg">
                        ${Math.round((500_000 - currentUsd) / 1000)}K remaining
                      </span>
                    </h1>
                  </div>

                  {/* Info boxes */}
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1 [@media(min-width:960px)_and_(max-width:1200px)]:px-2 [@media(min-width:960px)_and_(max-width:1560px)]:h-[90px]">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">Ticker</div>
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">$OPENX (ERC20)</div>
                    </div>
                  </div>
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1 [@media(min-width:960px)_and_(max-width:1200px)]:px-2 [@media(min-width:960px)_and_(max-width:1560px)]:h-[90px]">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">Min / Max per wallet</div>
                      <div className="mx-auto flex items-center justify-center text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">
                        <span>$50 / $1,000</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="ml-2 size-4 text-[#6A6A6A] [@media(min-width:960px)_and_(max-width:1200px)]:size-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>We want the $OPENX token to be as widely distributed as possible and fair for the community! After 50% of our funding goal has been achieved, we will restrict min & max contibutions.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1 [@media(min-width:960px)_and_(max-width:1200px)]:px-2 [@media(min-width:960px)_and_(max-width:1560px)]:h-[90px]">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">Contract</div>
                      <a
                        href={`${chains.find((c) => c.id === chainId)?.blockExplorers.default.url ?? "https://etherscan.io"}/token/${OpenxAIContract.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:opacity-80 [@media(min-width:960px)_and_(max-width:1200px)]:text-sm"
                      >
                        0x32f...953d
                      </a>
                    </div>
                  </div>
                </div>

                {/* Progress bar section */}
                <div className="my-8 h-px w-full bg-[#505050]" />
                <div className="mt-6">
                  <div className="mb-6 flex flex-col items-start justify-between text-base [@media(min-width:400px)]:flex-row [@media(min-width:400px)]:items-center">
                    <div className="mb-2 [@media(min-width:400px)]:mb-0">
                      <span className="text-white">
                        {/* Commented out dynamic calculation: {(1 / PROJECT_RATE[currentProject]).toFixed(3)} USD = 1 OPENX */}
                        1 ETH = 1,476,947 OPENX (-78%)
                      </span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-white">
                        $500K
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-8">
                    <Progress
                      value={100 * (currentUsd / 500_000)}
                      className="h-6 cursor-pointer border border-white bg-[#1F2021] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:to-[#122BEA]"
                      onClick={() => setIsTableVisible(!isTableVisible)}
                    />

                    {/* Milestone markers */}
                    {MILESTONES.map((milestone, index) => (
                      <div
                        key={index}
                        className="absolute top-0"
                        style={{ left: milestone.position }}
                      >
                        {/* Vertical dotted line - added extra height for mobile */}
                        <div className="h-6 w-px border-l border-dotted border-white/30 [@media(max-width:660px)]:h-[25px]" />

                        {/* Play icon triangle - adjusted mobile positioning */}
                        {index < 3 ? (
                          <div
                            title={milestone.name}
                            className="ml-[2px] mt-2 cursor-pointer transition-all hover:opacity-80 [@media(max-width:660px)]:mt-3"
                            onMouseEnter={() =>
                              setHighlightedProject(milestone.projectId)
                            }
                            onMouseLeave={() =>
                              !selectedMilestone && setHighlightedProject(null)
                            }
                            onClick={() => {
                              if (selectedMilestone === milestone.projectId) {
                                setSelectedMilestone(null)
                                setHighlightedProject(null)
                              } else {
                                setSelectedMilestone(milestone.projectId)
                                setHighlightedProject(milestone.projectId)
                                setIsTableVisible(true)
                              }
                            }}
                          >
                            <div
                              className={cn(
                                "rotate-90 border-x-[6px] border-b-8 border-solid border-x-transparent",
                                selectedMilestone === milestone.projectId
                                  ? "border-b-white"
                                  : "border-b-white/30"
                              )}
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => setIsTableVisible(true)}
                            className="cursor-pointer"
                          >
                            <div
                              title={milestone.name}
                              className="ml-[-2px] mt-2 cursor-pointer transition-all hover:opacity-80 [@media(max-width:660px)]:mt-3"
                            >
                              <div className="rotate-90 border-x-[6px] border-b-8 border-solid border-x-transparent border-b-white/30" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Toggle button for table - added margin bottom when expanded */}
                  <div
                    className={`mb-2 flex justify-end pr-8 ${isTableVisible ? "mb-4" : ""}`}
                  >
                    <button
                      onClick={() => setIsTableVisible(!isTableVisible)}
                      className="flex items-center gap-2 text-base text-white hover:opacity-80"
                    >
                      {isTableVisible ? (
                        <>
                          <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          Hide project milestones
                        </>
                      ) : (
                        <>
                          <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          View project milestones
                        </>
                      )}
                    </button>
                  </div>

                  {/* Milestone table with animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isTableVisible
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="relative -mx-4 w-full overflow-x-auto px-4">
                      <div className="min-w-[800px]">
                        <div className="w-full align-middle">
                          <div className="overflow-hidden rounded-lg border border-[#454545]">
                            <table className="w-full table-auto border-collapse bg-[#1F2021]">
                              <thead>
                                <tr>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Project Name
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Funding Goal
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Deadline
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Backers Rewards
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Flash Bonus
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Reward APY
                                  </th>
                                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {projects.slice(0, 3).map((project, index) => (
                                  <tr
                                    key={index}
                                    className={cn(
                                      "text-sm transition-colors",
                                      highlightedProject === project.id ||
                                        selectedMilestone === project.id
                                        ? "bg-white/10"
                                        : "hover:bg-white/5"
                                    )}
                                  >
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      {project.name}
                                    </td>
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      $
                                      {Number(
                                        project.fundingGoal
                                      ).toLocaleString()}
                                    </td>
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      {project.deadline}
                                    </td>
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      {Number(
                                        project.backersRewards
                                      ).toLocaleString()}{" "}
                                      OPENX
                                    </td>
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      {Number(
                                        project.flashBonus
                                      ).toLocaleString()}{" "}
                                      OPENX
                                    </td>
                                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                                      {project.rewardAPY}%
                                    </td>
                                    <td className="border-0 p-4 [@media(max-width:400px)]:p-[2px] [@media(max-width:650px)]:p-1 [@media(max-width:960px)]:p-2">
                                      <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-sm text-transparent [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                                        {project.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          href="/projects"
                          className="text-base text-white underline hover:opacity-80"
                        >
                          View all project milestones
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment method buttons container */}
                <div className="mb-16 w-full [@media(min-width:960px)]:w-1/2">
                  <div className="my-10 text-xl font-bold text-white">
                    Your deposit
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() =>
                          setSelectedPayment(
                            method.id as "eth" | "weth" | "usdc" | "usdt"
                          )
                        }
                        className={`relative flex h-10 items-center justify-center rounded-md p-1.5 transition-all
                          ${
                            method.id === selectedPayment
                              ? "bg-blue-600"
                              : "bg-[#1F2021] hover:bg-[#2a2a2a]"
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
                            <svg
                              className="size-2.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
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
                  {address && selectedToken.balance !== undefined ? (
                    <span className="text-white">
                      {formatNumber(
                        formatUnits(
                          selectedToken.balance,
                          selectedToken.decimals
                        )
                      )}{" "}
                      {selectedToken.symbol}
                    </span>
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
                        <div className="flex gap-1 text-xl font-bold text-white">
                          <Input
                            type="number"
                            step="0"
                            className="spin-button-none flex size-auto border-0 bg-transparent p-0 px-1 text-xl font-bold focus-visible:border-0 focus-visible:ring-0"
                            style={{
                              width: `${paymentAmountInput.length + 1}ch`,
                            }}
                            value={paymentAmountInput}
                            onChange={(e) => {
                              setPaymentAmountInput(e.target.value)
                              const asNum = Number(e.target.value)
                              if (!Number.isNaN(asNum)) {
                                setPaymentAmount(
                                  parseUnits(
                                    e.target.value,
                                    selectedToken.decimals
                                  )
                                )
                              }
                            }}
                          />
                          <span>{selectedToken.symbol}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {usdValue !== undefined
                            ? `$${formatNumber(usdValue)}`
                            : "Loading..."}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Max Amount:</span>
                      <span
                        className={cn(
                          "rounded-md bg-[#5C5C5C] px-2 py-1 text-white",
                          overMaxAmount && "bg-red-600"
                        )}
                      >
                        ${formatNumber(maxAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gradient Divider with Text - align with content above/below on desktop */}
                <div className="my-8 w-full [@media(min-width:960px)]:w-1/2">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#454545] to-transparent" />
                    <div className="font-inter text-[13px] font-normal text-[#6A6A6A]">
                      You will receive
                      <span className="text-lg text-white">
                        {" "}
                        {formatNumber(receiveOpenx.openx)}{" "}
                      </span>
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
                    <span className="text-lg text-white">
                      {formatNumber(receiveOpenx.openx)} OPENX
                    </span>
                  </div>
                </div>
              </div>

              {receiveOpenx.valueLeft && (
                <div className="flex gap-2">
                  <AlertTriangleIcon className="text-white" />
                  <span className="text-white">
                    Contribution is more than remaining milestones! Oversupplied
                    ${formatNumber(receiveOpenx.valueLeft)} will be send back.
                  </span>
                </div>
              )}

              <div className="flex flex-col">
                {selectedPayment !== "eth" &&
                  (tokenAllowance ?? BigInt(0)) < paymentAmount && (
                    <Button
                      className="mt-10 h-[40px] w-full bg-[#2D63F6] text-xl font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 [@media(min-width:960px)]:w-[calc(100%/6)]"
                      onClick={() => {
                        if (address) {
                          performTransaction({
                            transactionName: "Approve token spending",
                            transaction: async () => {
                              if (!tokenAddress) {
                                loggers?.onError?.({
                                  title: "Error",
                                  description:
                                    "Token address not set, please try reconnecting your wallet.",
                                })
                                return
                              }

                              return {
                                abi: parseAbi([
                                  "function approve(address spender, uint256 amount)",
                                ]),
                                address: tokenAddress,
                                functionName: "approve",
                                args: [
                                  OpenxAIGenesisContract.address,
                                  paymentAmount,
                                ],
                              }
                            },
                            onConfirmed(receipt) {
                              refetchTokenAllowance()
                            },
                          })
                        } else {
                          open()
                        }
                      }}
                      disabled={
                        countdown.days > 0 ||
                        countdown.hours > 0 ||
                        countdown.minutes > 0 ||
                        countdown.seconds > 0 ||
                        performingTransaction ||
                        overMaxAmount
                      }
                    >
                      Approve
                    </Button>
                  )}

                {/* WalletConnect button - restore original desktop layout */}
                <Button
                  className="mt-10 h-[40px] w-full bg-[#2D63F6] text-xl font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 [@media(min-width:960px)]:w-[calc(100%/6)]"
                  onClick={() => {
                    if (address) {
                      performTransaction({
                        transactionName: "Participate in Genesis",
                        transaction: async () => {
                          if (selectedPayment === "eth") {
                            return {
                              abi: OpenxAIGenesisContract.abi,
                              address: OpenxAIGenesisContract.address,
                              functionName: "transfer_native",
                              value: paymentAmount,
                            } as any
                          }

                          if (!tokenAddress) {
                            loggers?.onError?.({
                              title: "Error",
                              description:
                                "Token address not set, please try reconnecting your wallet.",
                            })
                            return
                          }

                          setExpectedContribution({
                            currency: `${parseFloat(formatUnits(paymentAmount, selectedToken.decimals)).toFixed(selectedToken.isEth ? 4 : 2)} ${selectedToken.symbol}`,
                            openx: `${formatNumber(receiveOpenx.openx)} OPENX`,
                          })

                          return {
                            abi: OpenxAIGenesisContract.abi,
                            address: OpenxAIGenesisContract.address,
                            functionName: "transfer_erc20",
                            args: [tokenAddress, paymentAmount],
                          }
                        },
                        onConfirmed(receipt) {
                          setShowSuccessModal(true)
                          axios.post(
                            "https://indexer.openxai.org/sync",
                            JSON.parse(
                              JSON.stringify(
                                {
                                  chainId,
                                  fromBlock: receipt.blockNumber - BigInt(1),
                                  toBlock: receipt.blockNumber,
                                },
                                replacer
                              )
                            )
                          )
                          participateRefretch()
                        },
                      })
                    } else {
                      open()
                    }
                  }}
                  disabled={
                    countdown.days > 0 ||
                    countdown.hours > 0 ||
                    countdown.minutes > 0 ||
                    countdown.seconds > 0 ||
                    (selectedPayment !== "eth" &&
                      (tokenAllowance ?? BigInt(0)) < paymentAmount) ||
                    performingTransaction ||
                    overMaxAmount
                  }
                >
                  Participate
                </Button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-32 w-full px-4">
              <h2 className="mb-8 text-center text-3xl font-bold text-white">
                OpenxAI Genesis Event - Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div key={index} className="rounded-lg bg-[#1F2021] p-4">
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? -1 : index)
                      }
                      className="flex w-full justify-between text-left text-lg font-semibold text-white focus:outline-none"
                    >
                      <span className="mb-6">{faq.question}</span>
                      <span>{openFaqIndex === index ? "-" : "+"}</span>
                    </button>
                    {openFaqIndex === index && (
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                        className="text-[#6A6A6A]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          depositAmount={expectedContribution.currency}
          tokenAmount={expectedContribution.openx}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </MobileResponsiveWrapper>
  )
}
