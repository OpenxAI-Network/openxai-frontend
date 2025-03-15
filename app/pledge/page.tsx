"use client"

import { useState } from "react"
import { useAccount, useSignMessage, useChainId } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useQuery } from "wagmi/query"
import axios from "axios"
import { ObjectFilter } from "@/openxai-indexer/nodejs-app/api/filter"
import { FilterEventsReturn } from "@/openxai-indexer/nodejs-app/api/return-types"
import { replacer, reviver } from "@/openxai-indexer/nodejs-app/utils/json"

import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"
import { cn } from "@/lib/utils"

const commandments = [
  "I shall contribute to the democratization of AI technology",
  "I shall promote transparency in AI development",
  "I shall respect user privacy and data sovereignty",
  "I shall support decentralized infrastructure",
  "I shall foster collaboration over competition",
  "I shall prioritize ethical AI development",
  "I shall maintain open standards and interoperability",
  "I shall protect against AI centralization",
  "I shall advocate for fair AI resource distribution",
  "I shall uphold the principles of open source"
]

interface PledgeSigned {
  type: 'PledgeSigned'
  chainId: number
  signer: string
  signature: string
  timestamp: number
}

export default function PledgePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { open } = useWeb3Modal()
  const [signature, setSignature] = useState<string>('')

  // Fetch all signatures from the indexer
  const { data: pledgeEvents } = useQuery({
    initialData: [],
    queryKey: ["pledges"],
    refetchInterval: 10_000, // 10s
    queryFn: async () => {
      const filter: ObjectFilter = {
        chainId: {
          equal: chainId,
        },
        type: {
          equal: "PledgeSigned",
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
  }) as { data: PledgeSigned[] }

  // Fixed the useSignMessage hook to use the correct structure
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess(data) {
        setSignature(data)
        // After signing, we would call the smart contract to store the signature
        // This would be handled by your contract interaction code
      }
    }
  })

  const handleSign = () => {
    const message = `I hereby pledge to uphold the 10 Commandments of Open Source Decentralized AI\n\n${commandments.join('\n')}`
    signMessage({ message })
  }

  // Stats for the boxes at the top
  const STATS = [
    {
      value: "100",
      label: "Signatory Goal",
    },
    {
      value: "10",
      label: "Commandments",
    },
    {
      value: "EVM Gasless",
      label: "Signature Type",
    },
    {
      value: pledgeEvents?.length.toString() || "0",
      label: "Total Signers",
      special: true,
    },
  ]

  return (
    <MobileResponsiveWrapper>
      {/* Title with gradient matching Projects page */}
      <div className="mb-8 mt-0 text-center">
        <h2 className="font-inter text-3xl font-medium leading-tight [@media(min-width:960px)]:text-4xl">
          <div className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
            The 10 Commandments of Open Source Decentralized AI
          </div>
          <div className="mt-3 bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
            Sign the pledge to join the movement
          </div>
        </h2>
      </div>

      {/* Stats Grid - Exactly like Projects page */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg border border-[#454545] p-4 text-center backdrop-blur-sm",
              stat.special
                ? "bg-gradient-to-b from-[#3384FF] to-[#B1FFB6]"
                : "bg-[#1F2021]/50"
            )}
          >
            <div className="text-center text-2xl font-bold text-white">
              {stat.value}
            </div>
            <div
              className={cn(
                "text-center text-sm",
                stat.special ? "font-bold text-white" : "text-[#6A6A6A]"
              )}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Commandments Table - Exactly like Projects table */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="inline-block min-w-full align-middle">
          <div className="min-w-[320px]">
            <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    #
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Commandment
                  </th>
                </tr>
              </thead>
              <tbody>
                {commandments.map((commandment, index) => (
                  <tr
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 font-bold text-[#6A6A6A]">
                      {index + 1}
                    </td>
                    <td className="border-0 p-4 text-white">
                      {commandment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="my-12">
        {signature && (
          <div className="relative mb-8 w-full rounded-lg border border-[#454545] bg-[#1F2021] p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Your Signature</h3>
            <p className="break-all font-mono text-sm text-[#6A6A6A]">{signature}</p>
            <p className="mt-4 text-[#6A6A6A]">Signed by: {address}</p>
          </div>
        )}

        {/* Sign Button - Matching Projects styling */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => isConnected ? handleSign() : open()}
            className="h-[40px] rounded-lg bg-[#2D63F6] px-8 text-xl font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConnected ? 'Sign the Pledge' : 'Connect Wallet to Sign'}
          </button>
        </div>
      </div>

      {/* Signers Table - Projects page style */}
      <div className="mt-12">
        <h3 className="mb-6 bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-2xl font-bold text-transparent">
          Pledge Signers ({pledgeEvents?.length ?? 0})
        </h3>
        
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-block min-w-full align-middle">
            <div className="min-w-[320px]">
              <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
                <thead>
                  <tr>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                      Wallet Address
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                      Date Signed
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                      Signature
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pledgeEvents?.length ? (
                    pledgeEvents.map((event) => (
                      <tr key={event.signer} className="text-sm hover:bg-white/5">
                        <td className="border-0 p-4 text-[#6A6A6A]">
                          <span className="font-mono">{event.signer}</span>
                        </td>
                        <td className="border-0 p-4 text-[#6A6A6A]">
                          {new Date(event.timestamp * 1000).toLocaleString()}
                        </td>
                        <td className="border-0 p-4 text-[#6A6A6A]">
                          <span className="inline-block max-w-[200px] truncate font-mono">
                            {event.signature.substring(0, 20)}...
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="border-0 p-4 text-center text-[#6A6A6A]">
                        No signatures yet. Be the first to sign the pledge!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}
