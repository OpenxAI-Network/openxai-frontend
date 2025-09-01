"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useAccount } from "wagmi"

import { formatNumber } from "@/lib/openxai"

export default function StakePage() {
  const { address } = useAccount()

  const { data: total } = useQuery({
    queryKey: ["total_staking", address ?? ""],
    enabled: !!address,
    queryFn: async () => {
      return await axios
        .get(`https://indexer.core.openxai.org/api/${address}/total_staking`)
        .then((res) => res.data as number)
    },
  })

  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      return await axios
        .get("https://indexer.core.openxai.org/api/staking/leaderboard")
        .then((res) => res.data as { account: string; total: number }[])
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-end justify-end [@media(max-width:960px)]:items-start [@media(max-width:960px)]:justify-start">
        <div className="flex items-baseline gap-4 [@media(max-width:960px)]:flex-col">
          <div className="flex gap-2">
            <span className="mt-10 text-lg text-[#6A6A6A] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm [@media(max-width:960px)]:mt-7 [@media(max-width:960px)]:text-base">
              By staking you&apos;ve earned
            </span>
            <h1 className="text-7xl text-white [@media(max-width:400px)]:text-3xl [@media(max-width:650px)]:text-4xl [@media(max-width:960px)]:text-5xl">
              {total !== undefined ? formatNumber(total / 1_000_000) : "..."}
            </h1>
            <span className="mt-10 text-lg text-[#6A6A6A] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm [@media(max-width:960px)]:mt-7 [@media(max-width:960px)]:text-base">
              OPENX
            </span>
          </div>
        </div>
      </div>

      <div className="my-8 h-px w-full bg-[#505050]" />

      <div className="">
        <h2 className="mb-6 text-xl font-semibold text-white [@media(max-width:960px)]:text-lg">
          Staking Leaderboard
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[400px]">
            <table className="w-full border-collapse rounded-lg border border-[#454545] bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Address
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Rank
                  </th>
                  <th className="border-0 border-b border-[#454545] p-4 text-right text-base font-bold text-[#D9D9D9] [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                    Total Staking Rewards (OPENX)
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard?.map((entry, i) => {
                  const ranking = i + 1
                  return (
                    <tr
                      key={i}
                      className={`
                            text-sm transition-colors
                            ${i === 0 && "bg-[linear-gradient(90deg,#353535_0%,#FABF58_60%,#353535_98%)]"} 
                            ${i === 1 && "bg-[linear-gradient(90deg,#353535_0%,#B8EAA8_60%,#353535_98%)]"}
                            ${i === 2 && "bg-[linear-gradient(90deg,#353535_0%,#A8C4EA_60%,#353535_98%)]"}
                            ${i > 2 && "hover:bg-white/5"}
                          `}
                    >
                      <td className="border-0 p-4 font-mono text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        {entry.account}
                      </td>
                      <td className="border-0 p-4 [@media(max-width:960px)]:p-2">
                        <span className="font-medium text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:text-xs">
                          {ranking % 10 === 1 && ranking !== 11
                            ? `${ranking}st`
                            : ranking % 10 === 2 && ranking !== 12
                              ? `${ranking}nd`
                              : ranking % 10 === 3 && ranking !== 13
                                ? `${ranking}rd`
                                : `${ranking}th`}
                        </span>
                      </td>
                      <td className="border-0 p-4 text-right font-mono text-white [@media(max-width:400px)]:text-[3px] [@media(max-width:650px)]:text-[6px] [@media(max-width:960px)]:p-2 [@media(max-width:960px)]:text-xs">
                        {entry.total}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
