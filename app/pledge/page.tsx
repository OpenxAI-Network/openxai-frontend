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
  "Thou shalt have no corporations or middlemen ruling thy AI systems.\nNo single entity shall alter protocol governance, data, services, or network.​",
  "Thou shalt keep access open unto all, regardless of identity or location.\nThe protocol shall be available to everyone without KYC, licensing, or location-based restrictions.​",
  "Thou shalt let thy community govern with a united voice.\nGovernance shall be community-driven through a DAO, with no CEO, foundation, company, or corporation exerting control.​",
  "Thou shalt honor data sovereignty for all users.\nIndividuals shall own and control their data, ensuring usage is consensual and beneficial to the data providers.​",
  "Thou shalt ensure ethical alignment above all else.\nAI systems shall uphold fairness and human values, preventing misuse and unintended harmful consequences.​",
  "Thou shalt make thy code transparent and auditable.\nAI systems shall be open-source, allowing stakeholders to understand and verify their functionalities and decision-making processes.​",
  "Thou shalt design for censorship resistance by distributing authority.\nPower shall be distributed among community members to prevent monopolistic control, ensuring immutable records and decentralized authority.​",
  "Thou shalt pursue sustainability in all endeavors.\nAI technologies shall be developed and utilized in an environmentally responsible manner, minimizing ecological footprints and promoting resource efficiency.​",
  "Thou shalt ensure composability and interoperability by design.\nAI systems shall adopt open standards and protocols to enable seamless integration and collaboration among different AI systems and platforms.​",
  "Thou shalt build redundancy and reliability into network design.\nAI systems shall implement robust security measures to protect against malicious activities, ensuring the integrity and reliability of AI operations.​"
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
    const message = `I pledge to uphold and embody these 10 AI Commandments, ensuring my actions align with the principles of a free and decentralized AI future.\n\n${commandments.join('\n')}`
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
      <div className="px-[10%]">
        {/* Title with gradient matching Projects page */}
        <div className="mb-8 mt-0 text-center">
          <h2 className="font-inter text-3xl font-medium leading-tight [@media(min-width:960px)]:text-4xl">
            <div className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
              OpenxAI 10 AI Commandments
            </div>
          </h2>
          <p className="mt-4 text-[#CCCCCC]">
            Confirm your commitment by connecting your crypto wallet, signing with a smart contract, or verifying with your email.
          </p>
        </div>

        <div className="my-16 text-center">
          <div className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-transparent">
            <p className="mb-2 text-xl font-bold">The BIG Why</p>
          </div>
          <p className="mb-4 text-[#FFFFFF]">
            AI is among the most powerful technologies humans have ever created. However, five companies currently own, control, and decide its future. This centralization poses risks not just to business but also to democracy and our collective future.
          </p>
          <p className="mb-4 text-[#FFFFFF]">
            We believe AI should be free and available to everyone, much like the internet or public transportation. Making AI accessible to all can lead to a significantly better world than relying on a few corporations to manage it and hoping for the best.
          </p>
          <p className="mb-4 text-[#FFFFFF]">
            Currently, there is no fully decentralized, community-owned AI protocol in existence.
          </p>
          <p className="mb-6 text-[#FFFFFF]">
            Imagine a Bitcoin-like network for AI: all you need is a computer and internet access. Anyone can participate, regardless of who or where they are—a permissionless, open AI network. Governance by a community, with no CEO, foundation, company, or corporation.
          </p>
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

        {/* Commandments Table - removed vertical border */}
        <div>
          <div className="w-full">
            <div className="overflow-hidden rounded-lg border border-[#454545] bg-[#1F2021]">
              <div className="grid grid-cols-[auto,1fr] border-b border-[#454545]">
                <div className="p-4 text-left text-xl font-bold text-[#D9D9D9]">
                  #
                </div>
                <div className="p-4 text-left text-xl font-bold text-[#D9D9D9]">
                  Commandment
                </div>
              </div>
              
              {commandments.map((commandment, index) => {
                const [title, description] = commandment.split('\n');
                return (
                  <div 
                    key={index}
                    className="grid grid-cols-[auto,1fr] border-b border-[#454545] transition-colors last:border-b-0 hover:bg-white/5"
                  >
                    <div className="self-start p-4 text-xl font-bold text-[#6A6A6A]">
                      {index + 1}
                    </div>
                    <div className="p-4">
                      <div className="break-words text-xl text-white">{title}</div>
                      <div className="mt-1 break-words text-sm text-[#6A6A6A]">{description}</div>
                    </div>
                  </div>
                );
              })}
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
          <div className="mt-8">
            <div className="mb-8 text-center">
              <p className="bg-gradient-to-r from-white to-[#2D63F6] bg-clip-text text-lg font-bold text-transparent">
                Sign Now. Make It Official. Own Your Commitment On-Chain.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => isConnected ? handleSign() : open()}
                className="h-[40px] rounded-lg bg-[#2D63F6] px-8 text-xl font-bold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isConnected ? 'Sign the Pledge' : 'Connect Wallet to Sign'}
              </button>
            </div>
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
                <table className="mb-16 w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
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
      </div>
    </MobileResponsiveWrapper>
  )
}
