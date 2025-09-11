"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { OpenxAIClaimerContract } from "@/contracts/OpenxAIClaimer"
import { useQuery } from "@tanstack/react-query"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import axios from "axios"
import { Address, formatUnits, Hex, parseSignature } from "viem"
import { useAccount, useReadContract } from "wagmi"

import { formatNumber } from "@/lib/openxai"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"
import { Button } from "@/components/ui/button"
import { chains } from "@/components/custom/web3-provider"

export default function ClaimsPage() {
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const { performTransaction, performingTransaction, loggers } =
    usePerformTransaction({ chainId: chains[0].id })

  const { data: total } = useQuery({
    queryKey: ["claim_total", address ?? ""],
    enabled: !!address,
    queryFn: async () => {
      return await axios
        .get(`https://indexer.core.openxai.org/api/${address}/claim_total`)
        .then((res) => res.data as Hex)
        .then((total) => BigInt(total))
    },
  })

  const { data: claim_breakdown } = useQuery({
    queryKey: ["claim", address ?? ""],
    enabled: !!address,
    queryFn: async () => {
      return await axios
        .get(`https://indexer.core.openxai.org/api/${address}/claim`)
        .then(
          (res) =>
            res.data as {
              amount: number
              description: string
              date: number
            }[]
        )
        .then((breakdown) => breakdown.sort((a, b) => b.date - a.date))
    },
  })

  const { data: claimed, refetch: refetchClaimed } = useReadContract({
    abi: OpenxAIClaimerContract.abi,
    address: OpenxAIClaimerContract.address,
    functionName: "claimed",
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  })
  const claimable = useMemo(() => {
    if (total === undefined || claimed === undefined) {
      return undefined
    }

    return total - claimed
  }, [total, claimed])

  const { data: tokensClaimed, refetch: refetchTokensClaimed } = useQuery({
    queryKey: ["tokens_claimed", address ?? ""],
    enabled: !!address,
    queryFn: async () => {
      return await axios
        .get(`https://indexer.core.openxai.org/api/${address}/tokens_claimed`)
        .then(
          (res) => res.data as { released: bigint; transaction_hash: string }[]
        )
    },
  })

  const openAt = Date.UTC(2025, 9 - 1, 10, 18, 0, 0, 0)
  const [openIn, setOpenIn] = useState<number>(openAt - Date.now())
  useEffect(() => {
    setInterval(() => setOpenIn(openAt - Date.now()), 1000)
  }, [])

  return (
    <div>
      <div className="mb-8 flex items-end justify-end [@media(max-width:960px)]:items-start [@media(max-width:960px)]:justify-start">
        {openIn > 0 ? (
          <div className="w-full flex place-content-center text-white">
            <span className="text-3xl">
              Claiming starts at 10 September 2025 18:00:00 UTC (in{" "}
              {openIn > 60 * 60 * 1000
                ? `${Math.round(openIn / (60 * 60 * 1000))}h`
                : openIn > 60 * 1000
                  ? `${Math.round(openIn / (60 * 1000))}m`
                  : `${Math.round(openIn / 1000)}s`}
              )
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-4 [@media(max-width:960px)]:flex-col">
            <div className="flex gap-2">
              <h1 className="text-7xl text-white [@media(max-width:400px)]:text-3xl [@media(max-width:650px)]:text-4xl [@media(max-width:960px)]:text-5xl">
                {claimable !== undefined
                  ? formatNumber(formatUnits(claimable, 18))
                  : "..."}
              </h1>
              <span className="mt-10 text-lg text-[#6A6A6A] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm [@media(max-width:960px)]:mt-7 [@media(max-width:960px)]:text-base">
                OPENX
              </span>
            </div>
            <Button
              className="ml-4 h-[40px] w-[200px] bg-blue-600 text-xl font-bold text-white hover:bg-blue-700 [@media(max-width:960px)]:ml-0 [@media(max-width:960px)]:w-full"
              onClick={async () => {
                try {
                  if (!address) {
                    open()
                    return
                  }

                  if (total === undefined) {
                    throw new Error("Could not fetch total claimable tokens")
                  }

                  const signature = await axios
                    .post(
                      `https://indexer.core.openxai.org/api/${address}/claim`
                    )
                    .then((res) => res.data as Hex)

                  await performTransaction({
                    transactionName: "Claiming proof",
                    transaction: async () => {
                      const { v, yParity, r, s } = parseSignature(signature)
                      return {
                        abi: OpenxAIClaimerContract.abi,
                        address: OpenxAIClaimerContract.address,
                        functionName: "claim",
                        args: [v ? Number(v) : yParity, r, s, address, total],
                      }
                    },
                    onConfirmed() {
                      Promise.all([
                        refetchClaimed(),
                        new Promise(
                          (resolve) => setTimeout(resolve, 3000) // wait 3 seconds
                        ).then(() => refetchTokensClaimed()),
                      ]).catch(console.error)
                    },
                  })
                } catch (e: any) {
                  loggers?.onError?.({
                    title: "Error",
                    description: e?.message ?? "An unexpected error occurred.",
                    error: e,
                  })
                }
              }}
              disabled={
                address &&
                (claimable === undefined ||
                  claimable <= BigInt(0) ||
                  performingTransaction)
              }
            >
              {address ? "Claim" : "Connect Wallet"}
            </Button>
          </div>
        )}
      </div>

      <div className="my-8 h-px w-full bg-[#505050]" />

      <h2 className="my-10 text-xl font-bold text-white">Breakdown</h2>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <table className="mb-10 w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
            <thead>
              <tr>
                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                  Date
                </th>
                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                  Amount
                </th>
                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {claim_breakdown?.map((claim, index) => (
                <tr
                  key={index}
                  className="text-sm transition-colors hover:bg-white/5"
                >
                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    {new Date(claim.date * 1000).toLocaleDateString()}{" "}
                    {new Date(claim.date * 1000).toLocaleTimeString()}
                  </td>
                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    {(claim.amount / 1_000_000).toFixed(2)} OPENX
                  </td>
                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    {claim.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-8 h-px w-full bg-[#505050]" />

      <h2 className="my-10 text-xl font-bold text-white">Claim History</h2>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <table className="mb-10 w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
            <thead>
              <tr>
                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                  Amount
                </th>
                <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody>
              {tokensClaimed?.map((claim, index) => (
                <tr
                  key={index}
                  className="text-sm transition-colors hover:bg-white/5"
                >
                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    {formatUnits(claim.released, 6)} OPENX
                  </td>
                  <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    <Button asChild>
                      <Link
                        href={`${chains[0].blockExplorers.default.url}/tx/${claim.transaction_hash}`}
                        target="_blank"
                      >
                        View on explorer
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
