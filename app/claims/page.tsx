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
    status: "12 days"
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
        <main className="ml-[234px] flex-1 p-8 pt-24">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-7xl font-bold">
                <span className="bg-gradient-to-r from-white via-[#6B8DE6] to-[#8AB4FF] bg-clip-text text-transparent">
                  2,846
                </span>
              </h1>
              <p className="text-lg text-gray-400">OPENX -289MUSD</p>
            </div>
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Claim
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl bg-[#1F2021]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="p-4 text-sm font-medium text-gray-400">Project Name</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Funding Goal</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Deadline</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Backers Rewards</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Flash Bonus</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Reward APY</th>
                  <th className="p-4 text-sm font-medium text-gray-400">Claims</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((project, index) => (
                  <tr 
                    key={index}
                    className="border-b border-white/10 text-white transition-colors hover:bg-white/5"
                  >
                    <td className="p-4">{project.name}</td>
                    <td className="p-4">{project.fundingGoal}</td>
                    <td className="p-4">{project.deadline}</td>
                    <td className="p-4">{project.backersRewards}</td>
                    <td className="p-4">{project.flashBonus}</td>
                    <td className="p-4">{project.rewardAPY}</td>
                    <td className="p-4">
                      {project.status === "Claimed" ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">Claimed</span>
                          <span className="text-blue-500">{project.txId}</span>
                        </div>
                      ) : (
                        <span>{project.status}</span>
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