"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { OpenxAIClaimerContract } from "@/contracts/OpenxAIClaimer"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Address, formatUnits, Hex, parseSignature } from "viem"
import { useAccount, useReadContract } from "wagmi"

import { formatNumber } from "@/lib/openxai"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"
import { Button } from "@/components/ui/button"
import { chains } from "@/components/custom/web3-provider"

export default function ClaimsPage() {
  const { address } = useAccount()
  const { performTransaction, performingTransaction, loggers } =
    usePerformTransaction({})

  const { data: total } = useQuery({
    queryKey: ["claim", address ?? ""],
    enabled: !!address,
    queryFn: async () => {
      return await axios
        .get(`https://indexer.core.openxai.org/api/${address}/claim`)
        .then((res) => res.data as number)
        .then((total) => BigInt(total))
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

  return (
    <div style={{ backgroundColor: "transparent" }}>
      <div className="mb-8 flex items-end justify-end [@media(max-width:960px)]:items-start [@media(max-width:960px)]:justify-start">
        <div className="flex flex-col">
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
                    throw new Error("Connect wallet to claim")
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
                claimable === undefined ||
                claimable <= BigInt(0) ||
                performingTransaction
              }
            >
              Claim
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
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
