"use client"

import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { OpenxAIContract } from "@/contracts/OpenxAI"
import { OpenxAIGenesisContract } from "@/contracts/OpenxAIGenesis"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { AlertTriangleIcon } from "lucide-react"
import {
  Address,
  erc20Abi,
  formatUnits,
  parseAbi,
  parseEther,
  parseUnits,
  zeroAddress,
} from "viem"
import { base, baseSepolia } from "viem/chains"
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi"

import { formatNumber } from "@/lib/openxai"
import { cn } from "@/lib/utils"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { chains } from "@/components/custom/web3-provider"
import SuccessModal from "@/components/genesis/Success"

const TIERS = [
  { amount: parseUnits("10000", 6), openx_rate: 10.0, credits_rate: 0.1559 },
  { amount: parseUnits("10000", 6), openx_rate: 9.8522, credits_rate: 0.1102 },
  { amount: parseUnits("10000", 6), openx_rate: 9.7087, credits_rate: 0.09 },
  { amount: parseUnits("10000", 6), openx_rate: 9.5694, credits_rate: 0.078 },
  { amount: parseUnits("10000", 6), openx_rate: 9.434, credits_rate: 0.0697 },
  { amount: parseUnits("10000", 6), openx_rate: 9.3023, credits_rate: 0.0637 },
  { amount: parseUnits("10000", 6), openx_rate: 9.1743, credits_rate: 0.0589 },
  { amount: parseUnits("10000", 6), openx_rate: 9.0498, credits_rate: 0.0551 },
  { amount: parseUnits("10000", 6), openx_rate: 8.9286, credits_rate: 0.052 },
  { amount: parseUnits("10000", 6), openx_rate: 8.8106, credits_rate: 0.0493 },
  { amount: parseUnits("10000", 6), openx_rate: 8.6957, credits_rate: 0.047 },
  { amount: parseUnits("10000", 6), openx_rate: 8.5837, credits_rate: 0.045 },
  { amount: parseUnits("10000", 6), openx_rate: 8.4746, credits_rate: 0.0432 },
  { amount: parseUnits("10000", 6), openx_rate: 8.3682, credits_rate: 0.0417 },
  { amount: parseUnits("10000", 6), openx_rate: 8.2645, credits_rate: 0.0403 },
  { amount: parseUnits("142000", 6), openx_rate: 8.0, credits_rate: 0 },
]

const CHAIN_INFO = {
  [base.id]: {
    ethOracle: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
    wrappedEth: {
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
    },
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
    },
    USDT: {
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      decimals: 6,
    },
  },
  [baseSepolia.id]: {
    ethOracle: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
    USDC: {
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
    },
    USDT: {
      address: "0xEE5b5633B8fa453bD1a4A24973c742BD0488D1C6",
      decimals: 6,
    },
  },
} as const

export default function GenesisPage() {
  const [selectedTier, setSelectedTier] = useState<number | undefined>(
    undefined
  )
  const [selectedPayment, setSelectedPayment] = useState<
    "eth" | "weth" | "usdc" | "usdt"
  >("eth")
  const [paymentAmount, setPaymentAmount] = useState(BigInt(0))
  const [paymentAmountInput, setPaymentAmountInput] = useState("0")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()
  const chainInfo = useMemo(
    () =>
      chainId === base.id || chainId == baseSepolia.id
        ? CHAIN_INFO[chainId as keyof typeof CHAIN_INFO]
        : undefined,
    [chainId]
  )
  const paymentMethods = useMemo(
    () =>
      [
        { id: "eth", name: "ETH", icon: "/eth.png" },
        { id: "usdc", name: "USDC", icon: "/usdc.png" },
        { id: "usdt", name: "USDT", icon: "/usdt.png" },
      ].concat(
        chainInfo && "wrappedEth" in chainInfo
          ? [{ id: "weth", name: "WETH", icon: "/weth.png" }]
          : []
      ),
    [chainInfo]
  )
  const { open } = useWeb3Modal()

  const { performTransaction, performingTransaction, loggers } =
    usePerformTransaction({})

  const { data: ethBalance, refetch: refetchEth } = useBalance({
    address,
    query: {
      enabled: !!address,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: wethBalance, refetch: refetchWeth } = useReadContract({
    abi: erc20Abi,
    address: (chainInfo as any)?.wrappedEth?.address as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!chainInfo && !!address && !!(chainInfo as any)?.wrappedEth,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: usdcBalance, refetch: refetchUsdc } = useReadContract({
    abi: erc20Abi,
    address: chainInfo?.USDC?.address as Address,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!chainInfo && !!address,
      refetchInterval: 10_000, // 10s
    },
  })
  const { data: usdtBalance, refetch: refetchUsdt } = useReadContract({
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
  const ethPrice = useMemo(() => {
    if (!ethPriceRaw) {
      return undefined
    }

    return parseFloat(formatUnits(ethPriceRaw![1], 8))
  }, [ethPriceRaw])

  const selectedToken = useMemo(() => {
    return selectedPayment === "eth"
      ? {
          symbol: "ETH",
          isEth: true,
          balance: ethBalance?.value,
          decimals: 18,
          refetch: refetchEth,
        }
      : selectedPayment === "weth"
        ? {
            symbol: "WETH",
            isEth: true,
            balance: wethBalance,
            decimals: (chainInfo as any)?.wrappedEth.decimals ?? 18,
            refetch: refetchWeth,
          }
        : selectedPayment === "usdc"
          ? {
              symbol: "USDC",
              isEth: false,
              balance: usdcBalance,
              decimals: chainInfo?.USDC?.decimals ?? 6,
              refetch: refetchUsdc,
            }
          : selectedPayment === "usdt"
            ? {
                symbol: "USDT",
                isEth: false,
                balance: usdtBalance,
                decimals: chainInfo?.USDT?.decimals ?? 6,
                refetch: refetchUsdt,
              }
            : {
                symbol: "UNKNOWN",
                isEth: false,
                balance: BigInt(0),
                decimals: 0,
                refetch: () => {},
              }
  }, [
    selectedPayment,
    wethBalance,
    usdcBalance,
    usdtBalance,
    chainInfo,
    ethBalance?.value,
    refetchEth,
    refetchWeth,
    refetchUsdc,
    refetchUsdt,
  ])

  const usdValue = useMemo(
    () =>
      selectedToken.isEth
        ? ethPrice !== undefined
          ? parseFloat(formatUnits(paymentAmount, selectedToken.decimals)) *
            ethPrice!
          : undefined
        : parseFloat(formatUnits(paymentAmount, selectedToken.decimals)),
    [selectedToken, ethPrice, paymentAmount]
  )

  const { data: tiers, refetch: refetchTiers } = useReadContracts({
    contracts: TIERS.map((_, i) => {
      return {
        abi: OpenxAIGenesisContract.abi,
        address: OpenxAIGenesisContract.address,
        functionName: "tiers",
        args: [BigInt(i)],
      } as const
    }),
    allowFailure: false,
  })

  const currentUsd = useMemo(
    () =>
      tiers
        ? parseFloat(
            formatUnits(
              TIERS.reduce((prev, cur) => prev + cur.amount, BigInt(0)) -
                tiers.reduce((prev, cur) => prev + cur, BigInt(0)),
              6
            )
          )
        : 0,
    [tiers]
  )

  const currentTier = useMemo(
    () =>
      tiers ? tiers.findIndex((tier) => tier !== BigInt(0), 0) : undefined,
    [tiers]
  )

  const receive = useMemo(() => {
    if (!usdValue || !tiers) {
      return { openx: 0, credits: 0, valueLeft: 0 }
    }

    let valueLeft = usdValue
    let openx = 0
    let credits = 0
    let tierIndex = 0
    while (valueLeft > 0 && tierIndex < TIERS.length) {
      const amountInTier = Math.min(
        valueLeft,
        parseFloat(formatUnits(tiers[tierIndex], 6))
      )
      openx += amountInTier * TIERS[tierIndex].openx_rate
      credits += amountInTier * TIERS[tierIndex].credits_rate
      valueLeft -= amountInTier
      tierIndex++
    }

    return { openx, credits, valueLeft }
  }, [usdValue, tiers])

  const tokenAddress = useMemo(() => {
    if (!chainInfo || selectedPayment === "eth") return undefined

    let erc20Address: Address
    switch (selectedPayment) {
      case "weth":
        erc20Address =
          "wrappedEth" in chainInfo ? chainInfo.wrappedEth.address : zeroAddress
        break
      case "usdc":
        erc20Address = chainInfo.USDC.address
        break
      case "usdt":
        erc20Address = chainInfo.USDT.address
        break
      default:
        // This case should be unreachable given the type of selectedPayment
        throw new Error(`Unexpected payment method: ${selectedPayment}`)
    }
    return erc20Address
  }, [chainInfo, selectedPayment])
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
    const allowance =
      selectedPayment === "eth" ? BigInt(0) : (tokenAllowance ?? BigInt(0))
    if (selectedToken.balance !== undefined) {
      const balance = allowance ? allowance : selectedToken.balance
      const newPaymentAmount =
        selectedPayment === "eth"
          ? balance - parseEther("0.001") // Keep some eth to pay for gas fee
          : balance
      setPaymentAmount(newPaymentAmount)
      setPaymentAmountInput(
        parseFloat(
          formatUnits(newPaymentAmount, selectedToken.decimals)
        ).toFixed(selectedToken.isEth ? 4 : 2)
      )
    }
  }, [selectedPayment, selectedToken, tokenAllowance])

  const [expectedContribution, setExpectedContribution] = useState({
    currency: "",
    openx: "",
    credits: "",
  })

  return (
    <>
      <div style={{ backgroundColor: "transparent" }}>
        <div>
          <main>
            <div className="px-safe">
              {/* Main content */}
              <div className="relative z-[5]">
                <div className="h-8 max-lg:hidden" />
                {/* Main stats and info container */}
                <div className="grid grid-cols-1 gap-4 [@media(min-width:960px)]:grid-cols-6">
                  {/* Amount section */}
                  <div className="[@media(min-width:960px)]:col-span-4">
                    <h1 className="inline-flex items-baseline gap-4 text-4xl [@media(min-width:960px)]:text-7xl">
                      <span className="text-white">
                        ${formatNumber(currentUsd)}
                      </span>
                    </h1>
                  </div>

                  {/* Info boxes */}
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1 [@media(min-width:960px)_and_(max-width:1200px)]:px-2 [@media(min-width:960px)_and_(max-width:1560px)]:h-[90px]">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">
                        Ticker
                      </div>
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">
                        $OPENX (ERC20)
                      </div>
                    </div>
                  </div>
                  <div className="relative flex h-[58px] rounded-lg bg-[#0B1120] px-4 before:absolute before:inset-[-0.5px] before:rounded-lg before:border-0 before:bg-gradient-to-t before:from-[#829ED1] before:to-[#0059FE] before:content-[''] after:absolute after:inset-px after:rounded-lg after:bg-[#1F2021] after:content-[''] [@media(min-width:960px)]:col-span-1 [@media(min-width:960px)_and_(max-width:1200px)]:px-2 [@media(min-width:960px)_and_(max-width:1560px)]:h-[90px]">
                    <div className="relative z-10 flex w-full flex-col justify-center text-center">
                      <div className="text-white [@media(min-width:960px)_and_(max-width:1200px)]:text-sm">
                        Contract
                      </div>
                      <a
                        href={`${chains.find((c) => c.id === chainId)?.blockExplorers.default.url ?? "https://basescan.org"}/token/${OpenxAIContract.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline hover:opacity-80 [@media(min-width:960px)_and_(max-width:1200px)]:text-sm"
                      >
                        0xa734...aA32
                      </a>
                    </div>
                  </div>
                </div>

                {/* Progress bar section */}
                <div className="my-8 h-px w-full bg-[#505050]" />
                <div className="flex flex-col gap-2">
                  <div className="flex place-content-between place-items-center">
                    <div className="flex flex-col text-white">
                      <span>
                        ${(selectedTier ?? currentTier ?? 0) * 10}K - $
                        {((selectedTier ?? currentTier ?? 0) + 1) * 10}K
                      </span>
                      <span>
                        1 USD ={" "}
                        {selectedTier !== undefined
                          ? TIERS[selectedTier].openx_rate
                          : currentTier !== undefined
                            ? TIERS[currentTier].openx_rate
                            : "..."}{" "}
                        OPENX +{" "}
                        {selectedTier !== undefined
                          ? TIERS[selectedTier].credits_rate
                          : currentTier !== undefined
                            ? TIERS[currentTier].credits_rate
                            : "..."}{" "}
                        GPU Credits
                      </span>
                      <span>xx% Discount</span>
                    </div>

                    <div className="flex flex-col items-end text-white">
                      <span className="text-xl font-bold">$150K</span>
                      <span className="text-sm">(target)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-15">
                    {TIERS.slice(0, 15).map((tier, i) => (
                      <Progress
                        key={i}
                        onPointerEnter={() => {
                          setSelectedTier(i)
                        }}
                        onPointerLeave={() => {
                          setSelectedTier(undefined)
                        }}
                        value={
                          100 *
                          ((parseFloat(formatUnits(tier.amount, 6)) -
                            parseFloat(
                              formatUnits(
                                tiers?.at(i) ?? parseUnits("10000", 6),
                                6
                              )
                            )) /
                            parseFloat(formatUnits(tier.amount, 6)))
                        }
                        className={cn(
                          "h-6 rounded-none border border-white bg-[#1F2021] text-[#122BEA]",
                          i === 0 && "rounded-l-full",
                          i === 14 && "rounded-r-full",
                          i === selectedTier && "border-4"
                        )}
                      />
                    ))}
                  </div>

                  <div className="w-full">
                    {/* Payment method buttons container */}
                    <div className="mb-8 w-full [@media(min-width:960px)]:w-1/2">
                      <div className="my-10 text-xl font-bold text-white">
                        Your deposit
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {paymentMethods.map((method) => (
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
                              selectedToken.balance!,
                              selectedToken.decimals
                            )
                          )}{" "}
                          {selectedToken.symbol}
                        </span>
                      ) : (
                        <span className="text-white">
                          please connect wallet
                        </span>
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
                                onChange={(e: any) => {
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
                                ? `$${formatNumber(usdValue!)}`
                                : "Loading..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gradient Divider with Text - align with content above/below on desktop */}
                    <div className="my-8 w-full [@media(min-width:960px)]:w-1/2">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#454545] to-transparent" />
                        <div className="font-inter text-sm font-normal text-[#6A6A6A]">
                          You will receive
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
                          {formatNumber(receive.openx)} OPENX +{" "}
                          {formatNumber(receive.credits)} GPU Credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {receive.valueLeft && (
                  <div className="flex gap-2">
                    <AlertTriangleIcon className="text-white" />
                    <span className="text-white">
                      Contribution is more than remaining milestones!
                      Oversupplied ${formatNumber(receive.valueLeft)} will be
                      send back.
                    </span>
                  </div>
                )}

                <div className="flex gap-5">
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
                                  address: tokenAddress!,
                                  functionName: "approve",
                                  args: [
                                    OpenxAIGenesisContract.address,
                                    paymentAmount,
                                  ],
                                }
                              },
                              onConfirmed() {
                                refetchTokenAllowance()
                              },
                            })
                          } else {
                            open()
                          }
                        }}
                        disabled={performingTransaction}
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
                              openx: `${formatNumber(receive.openx)} OPENX`,
                              credits: `${formatNumber(receive.credits)} GPU Credits`,
                            })

                            return {
                              abi: OpenxAIGenesisContract.abi,
                              address: OpenxAIGenesisContract.address,
                              functionName: "transfer_erc20",
                              args: [tokenAddress, paymentAmount],
                            }
                          },
                          onConfirmed() {
                            setShowSuccessModal(true)
                            refetchTiers()
                            selectedToken.refetch()
                          },
                        })
                      } else {
                        open()
                      }
                    }}
                    disabled={
                      performingTransaction ||
                      (selectedPayment !== "eth" &&
                        (tokenAllowance ?? BigInt(0)) < paymentAmount)
                    }
                  >
                    Participate
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          depositAmount={expectedContribution.currency}
          tokenAmount={expectedContribution.openx}
          creditsAmount={expectedContribution.credits}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  )
}
