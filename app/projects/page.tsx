"use client"

import React from "react"
import Link from "next/link"
import { projects } from "@/data/projects"
import { ObjectFilter } from "@/openxai-indexer/nodejs-app/api/filter"
import { FilterEventsReturn } from "@/openxai-indexer/nodejs-app/api/return-types"
import { OpenxAIContract } from "@/openxai-indexer/nodejs-app/contracts/OpenxAI"
import { Participated } from "@/openxai-indexer/nodejs-app/types/genesis/events"
import { replacer, reviver } from "@/openxai-indexer/nodejs-app/utils/json"
import axios from "axios"
import { formatUnits } from "viem"
import { useChainId, useReadContract } from "wagmi"
import { useQuery } from "wagmi/query"

import { formatNumber } from "@/lib/openxai"
import { cn } from "@/lib/utils"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

export default function ProjectsPage() {
  const chainId = useChainId()

  const { data: participationEvents } = useQuery({
    initialData: [],
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
  }) as { data: Participated[] }

  const { data: openxSupply } = useReadContract({
    abi: OpenxAIContract.abi,
    address: OpenxAIContract.address,
    functionName: "totalSupply",
  })

  // Stats for the boxes at the top
  const STATS = [
    {
      value: projects.filter((p) => p.status === "Completed").length.toString(),
      label: "Completed Projects",
    },
    {
      value: projects.filter((p) => p.status === "Pending").length.toString(),
      label: "Pending Projects",
    },
    {
      value: participationEvents
        ? new Set(participationEvents.map((e) => e.account)).size
        : "...",
      label: "Number of Backers",
    },
    {
      value: `$${formatNumber(
        projects
          .filter((p) => p.status === "Completed")
          .reduce((prev, cur) => prev + parseInt(cur.fundingGoal), 0)
      )}`,
      label: "Distributed Funds",
    },
    {
      value:
        openxSupply !== undefined
          ? formatNumber(formatUnits(openxSupply, 18))
          : "0",
      label: "Distributed Tokens",
    },
    {
      value: "~$0", // a pain to fetch prices of ALL assets in the DAO
      label: "Available funds in the DAO",
      special: true,
    },
  ]

  return (
    <MobileResponsiveWrapper>
      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
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

      {/* Project Table */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="inline-block min-w-full align-middle">
          <div className="min-w-[320px]">
            <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Project Name
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Creation Date
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Budget
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Rewards Paid out
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Flash Bonus
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Reward APY
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      <Link
                        href={`/projects/project?id=${project.id}`}
                        className="font-bold underline transition-colors hover:text-white"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      {project.deadline}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      ${Number(project.fundingGoal).toLocaleString()}
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      {Number(project.backersRewards).toLocaleString()} OPENX
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      {Number(project.flashBonus).toLocaleString()} OPENX
                    </td>
                    <td className="border-0 p-4 text-[#6A6A6A]">
                      {project.rewardAPY}%
                    </td>
                    <td className="border-0 p-4">
                      {project.status === "Completed" ? (
                        <span className="bg-gradient-to-r from-white to-green-500 bg-clip-text text-sm text-transparent">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-sm text-transparent">
                          Pending
                        </span>
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
