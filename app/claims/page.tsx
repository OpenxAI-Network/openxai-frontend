"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

const PROJECTS = [
  {
    name: "Content Creation",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1.279%",
    status: "Claimed",
    txId: "0x79-4564"
  },
  {
    name: "Uniswap Listing & Liquidity",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1.278%",
    status: "Claim Now"
  },
  {
    name: "30 Days or 30 Days Campaign",
    fundingGoal: "$2,500",
    deadline: "2-20-2025",
    backersRewards: "10,000 OPENX",
    flashBonus: "5,000 OPENX",
    rewardAPY: "1.278%",
    status: "45 days"
  }
]

export default function ClaimsPage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
        <SideMenu />
        <main className="ml-[234px] flex-1 p-16 pt-24">
          <div className="mb-8 flex items-end justify-end">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4">
                <div className="flex flex-col">
                  <h1 className="text-7xl text-white">2,846</h1>
                  <div className="mt-2 flex justify-between">
                    <span className="text-lg text-[#6A6A6A]">OPENX</span>
                    <span className="text-lg text-[#6A6A6A]">~2,894 USD</span>
                  </div>
                </div>
                <Button className="ml-4 h-[40px] w-[200px] bg-blue-600 text-xl font-bold text-white hover:bg-blue-700">
                  Claim
                </Button>
              </div>
            </div>
          </div>

          {/* Horizontal divider */}
          <div className="my-8 h-px w-full bg-[#505050]" />

          {/* Projects you backed */}
          <h2 className="my-10 text-xl font-bold text-white">Projects that you backed</h2>
          <div className="mb-8 overflow-hidden rounded-lg border border-[#454545]">
            <table className="w-full border-collapse bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Project Name</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Funding Goal</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Deadline</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Backers Rewards</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Flash Bonus</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Reward APY</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Claims</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project, index) => (
                  <tr 
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.name}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.fundingGoal}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.deadline}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.backersRewards}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.flashBonus}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.rewardAPY}</td>
                    <td className="border-0 p-4">
                      {project.status === "Claimed" ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">Claimed</span>
                          <span className="text-blue-500">{project.txId}</span>
                        </div>
                      ) : project.status === "Claim Now" ? (
                        <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">Claim Now</span>
                      ) : (
                        <span className="text-[#6A6A6A]">{project.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Projects others backed */}
          <h2 className="my-10 text-xl font-bold text-white">Projects that others backed</h2>
          <div className="overflow-hidden rounded-lg border border-[#454545]">
            <table className="w-full border-collapse bg-[#1F2021]">
              <thead>
                <tr>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Project Name</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Funding Goal</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Deadline</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Backers Rewards</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Flash Bonus</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Reward APY</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Claims</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project, index) => (
                  <tr 
                    key={index}
                    className="text-sm transition-colors hover:bg-white/5"
                  >
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.name}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.fundingGoal}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.deadline}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.backersRewards}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.flashBonus}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.rewardAPY}</td>
                    <td className="border-0 p-4">
                      {project.status === "Claimed" ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">Claimed</span>
                          <span className="text-blue-500">{project.txId}</span>
                        </div>
                      ) : project.status === "Claim Now" ? (
                        <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">Claim Now</span>
                      ) : (
                        <span className="text-[#6A6A6A]">{project.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  )
}