"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { projects } from "@/data/projects"
import tasks from "@/data/tasks.json"
import { ObjectFilter } from "@/openxai-indexer/nodejs-app/api/filter"
import {
  FilterEventsReturn,
  FilterProofsReturn,
  GetProofReturn,
} from "@/openxai-indexer/nodejs-app/api/return-types"
import { OpenxAIClaimerContract } from "@/openxai-indexer/nodejs-app/contracts/OpenxAIClaimer"
import { TokensClaimed } from "@/openxai-indexer/nodejs-app/types/claimer/events"
import { Participated } from "@/openxai-indexer/nodejs-app/types/genesis/events"
import { Proof } from "@/openxai-indexer/nodejs-app/types/rewards"
import { replacer, reviver } from "@/openxai-indexer/nodejs-app/utils/json"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatUnits, parseSignature } from "viem"
import { mainnet } from "viem/chains"
import { useAccount, useChainId } from "wagmi"

import { formatNumber, PROJECT_RATE } from "@/lib/openxai"
import { cn } from "@/lib/utils"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"
import { Button } from "@/components/ui/button"
import { chains } from "@/components/custom/web3-provider"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

export default function ClaimsPage() {
  const [isHighlighted, setIsHighlighted] = React.useState(false)

  React.useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isHighlighted])

  const chainId = useChainId()
  const { address } = useAccount()
  const { data: myParticipation } = useQuery({
    initialData: [],
    queryKey: ["participate", address ?? ""],
    refetchInterval: 10_000, // 10s
    queryFn: async () => {
      const filter: ObjectFilter = {
        chainId: {
          equal: chainId,
        },
        type: {
          equal: "Participated",
        },
        account: {
          equal: address?.toLowerCase(),
          convertValueToLowercase: true,
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
            JSON.parse(
              JSON.stringify(data),
              reviver
            ) as FilterEventsReturn as Participated[]
        )
    },
    enabled: !!address,
  })

  const { data: myProofs } = useQuery({
    initialData: [],
    queryKey: ["proofs", address ?? ""],
    refetchInterval: 10_000, // 10s
    queryFn: async () => {
      const filter: ObjectFilter = {
        chainId: {
          equal: chainId,
        },
        claimer: {
          equal: address?.toLowerCase(),
          convertValueToLowercase: true,
        },
      }
      return await axios
        .post(
          "https://indexer.openxai.org/filterProof",
          JSON.parse(JSON.stringify(filter, replacer))
        )
        .then((res) => res.data)
        .then(
          (data) =>
            JSON.parse(JSON.stringify(data), reviver) as FilterProofsReturn
        )
    },
    enabled: !!address,
  })

  const { data: mySubmittedProofs } = useQuery({
    initialData: [],
    queryKey: ["submittedProofs", address ?? ""],
    refetchInterval: 10_000, // 10s
    queryFn: async () => {
      const filter: ObjectFilter = {
        chainId: {
          equal: chainId,
        },
        type: {
          equal: "TokensClaimed",
        },
        account: {
          equal: address?.toLowerCase(),
          convertValueToLowercase: true,
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
            JSON.parse(
              JSON.stringify(data),
              reviver
            ) as FilterEventsReturn as TokensClaimed[]
        )
    },
    enabled: !!address,
  })

  const myProjects = useMemo(() => {
    return myParticipation.map((e) => {
      const project = projects.find((p) => BigInt(p.id) - BigInt(1) === e.tier)
      const basedOn = getBasedOn(e)
      return {
        name: project?.name ?? "Unnamed project",
        participationAmount: e.amount,
        deadline: project?.deadline ?? "Unknown",
        expectedRewards:
          parseFloat(formatUnits(e.amount, 6)) * PROJECT_RATE[Number(e.tier)],
        claimable: project?.status === "Claimable",
        generatedProof: myProofs.some((p) => p.basedOn.includes(basedOn)),
        raw: {
          project,
          event: e,
        },
      }
    })
  }, [myParticipation, myProofs])

  const proofList = useMemo(() => {
    return myProofs.map((p) => {
      const submitted = mySubmittedProofs.find((sp) => sp.proofId === p.proofId)
      return {
        id: p.proofId,
        tx: submitted
          ? `${(chains.find((c) => c.id === submitted.chainId) ?? mainnet).blockExplorers.default.url}/tx/${submitted.transactionHash}`
          : undefined,
        amount: formatNumber(formatUnits(p.amount, 18)),
        raw: {
          submitted,
          proof: p,
        },
      }
    })
  }, [myProofs, mySubmittedProofs])

  const { performTransaction, performingTransaction, loggers } =
    usePerformTransaction({})
  const claimProof = async (proof: Proof) => {
    await performTransaction({
      transactionName: "Claiming proof",
      transaction: async () => {
        const { v, yParity, r, s } = parseSignature(proof.signature)
        return {
          abi: OpenxAIClaimerContract.abi,
          address: OpenxAIClaimerContract.address,
          functionName: "claim",
          args: [
            v ? Number(v) : yParity,
            r,
            s,
            proof.proofId,
            proof.claimer,
            proof.amount,
          ],
        }
      },
    })
  }

  const claimable = useMemo(() => {
    return myProjects.reduce(
      (prev, cur) =>
        prev + (cur.claimable && !cur.generatedProof ? cur.expectedRewards : 0),
      0
    )
  }, [myProjects])

  return (
    <MobileResponsiveWrapper>
      {/* Banner notification */}
      <div
        className={`mb-6 rounded-lg bg-blue-900/30 p-4 text-center transition-all duration-300 ${isHighlighted ? "ring-1 ring-white" : ""}`}
      >
        <span className="text-sm text-white md:text-base">
          Project milestone claims will be going live after the{" "}
          <strong>OpenxAI Genesis Event</strong>! Task claims may be sooner...
          stay tuned!
        </span>
      </div>

      <div style={{ backgroundColor: "transparent" }}>
        <div className="mb-8 flex items-end justify-end [@media(max-width:960px)]:items-start [@media(max-width:960px)]:justify-start">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-4 [@media(max-width:960px)]:flex-col">
              <div className="flex flex-col">
                <h1 className="text-7xl text-white [@media(max-width:400px)]:text-3xl [@media(max-width:650px)]:text-4xl [@media(max-width:960px)]:text-5xl">
                  {formatNumber(claimable)}
                </h1>
                <div className="mt-2 flex justify-between">
                  <span className="text-lg text-[#6A6A6A] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm [@media(max-width:960px)]:text-base">
                    OPENX
                  </span>
                  <span className="text-lg text-[#6A6A6A] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm [@media(max-width:960px)]:text-base">
                    ~0 USD
                  </span>
                </div>
              </div>
              <Button
                className="ml-4 h-[40px] w-[200px] bg-blue-600 text-xl font-bold text-white hover:bg-blue-700 [@media(max-width:960px)]:ml-0 [@media(max-width:960px)]:w-full"
                onClick={async () => {
                  try {
                    const claim = {
                      chainId,
                      claimer: address,
                      basedOn: myProjects
                        .filter((p) => p.claimable && !p.generatedProof)
                        .map((p) => getBasedOn(p.raw.event)),
                    }
                    const proof = await axios
                      .post(
                        "https://indexer.openxai.org/getProof",
                        JSON.parse(JSON.stringify(claim, replacer))
                      )
                      .then((res) => res.data)
                      .then(
                        (data) =>
                          JSON.parse(
                            JSON.stringify(data),
                            reviver
                          ) as GetProofReturn
                      )

                    await claimProof(proof)
                  } catch (e: any) {
                    loggers?.onError?.({
                      title: "Error",
                      description:
                        e?.message ?? "An unexpected error occurred.",
                      error: e,
                    })
                  }
                }}
                disabled={claimable === 0 || performingTransaction}
              >
                Claim
              </Button>
            </div>
          </div>
        </div>

        {/* Horizontal divider */}
        <div className="my-8 h-px w-full bg-[#505050]" />

        {/* Projects you have backed */}
        <h2 className="mb-10 text-xl font-bold text-white">
          Projects Available to Back
        </h2>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="inline-block min-w-full align-middle">
            <div className="min-w-[320px]">
              <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
                <thead>
                  <tr>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      Project Name
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      Participation Amount
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      Deadline
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      Expected Rewards
                    </th>
                    <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      Claims
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myProjects.map((project, index) => (
                    <tr
                      key={index}
                      className="text-sm transition-colors hover:bg-white/5"
                    >
                      <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        {project.name}
                      </td>
                      <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        $
                        {formatNumber(
                          formatUnits(project.participationAmount, 6)
                        )}
                      </td>
                      <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        {project.deadline}
                      </td>
                      <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        {formatNumber(project.expectedRewards)} OPENX
                      </td>
                      <td className="border-0 p-4 [@media(max-width:400px)]:p-[2px] [@media(max-width:650px)]:p-1 [@media(max-width:960px)]:p-2">
                        <span
                          className={cn(
                            "bg-gradient-to-r from-white  bg-clip-text text-sm text-transparent [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs",
                            project.claimable
                              ? project.generatedProof
                                ? "to-gray-500"
                                : "to-green-500"
                              : "to-blue-500"
                          )}
                        >
                          {project.claimable
                            ? project.generatedProof
                              ? "Claimed"
                              : "Claimable"
                            : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tasks reward claims */}
        <h2 className="my-10 text-xl font-bold text-white">
          Tasks Rewards You Will be Able to Claim
        </h2>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[400px]">
            <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Task Name
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Deadline
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Your Rewards
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Link
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Claims
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {task.name}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {task.deadline}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {task.rewards}
                    </td>
                    <td className="border-0 p-4 [@media(max-width:400px)]:p-[2px] [@media(max-width:650px)]:p-1 [@media(max-width:960px)]:p-2">
                      {task.link && (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:opacity-80"
                        >
                          <span className="[@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                            Zealy Campaign
                          </span>
                          <svg
                            className="size-4 [@media(max-width:400px)]:size-2 [@media(max-width:650px)]:size-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </td>
                    <td className="border-0 p-4 [@media(max-width:400px)]:p-[2px] [@media(max-width:650px)]:p-1 [@media(max-width:960px)]:p-2">
                      <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-sm text-transparent [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                        {"Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="my-10 text-xl font-bold text-white">Claim History</h2>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[400px]">
            <table className="mb-10 w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    ID
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Amount
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Status
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {proofList.map((proof, index) => (
                  <tr
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {proof.id.toString()}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {proof.amount} OPENX
                    </td>
                    <td
                      className={cn(
                        "border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs",
                        proof.tx ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {proof.tx ? "Claimed" : "Unclaimed"}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A] [@media(max-width:400px)]:p-[2px] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:p-1 [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                      {proof.tx ? (
                        <Button asChild>
                          <Link href={proof.tx} target="_blank">
                            View on explorer
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            claimProof(proof.raw.proof)
                          }}
                        >
                          Claim
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}

function getBasedOn(event: Participated): string {
  return `event:${JSON.stringify({ chainId: event.chainId, transactionHash: event.transactionHash, logIndex: event.logIndex }, replacer)}`
}
