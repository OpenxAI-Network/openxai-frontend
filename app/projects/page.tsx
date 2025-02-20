"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"
import projects from "@/data/projects.json"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Stats for the boxes at the top
const STATS = [
  {
    value: "0",
    label: "Completed Projects"
  },
  {
    value: "12",
    label: "Pending Projects"
  },
  {
    value: "122",
    label: "Number of Backers"
  },
  {
    value: "$110,000",
    label: "Distributed Funds"
  },
  {
    value: "1,730,908",
    label: "Distributed Tokens"
  },
  {
    value: "~$332,000",
    label: "Available funds in the DAO",
    special: true
  }
]

export default function ProjectsPage() {
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
            <div className="text-center text-2xl font-bold text-white">{stat.value}</div>
            <div className={cn(
              "text-center text-sm",
              stat.special ? "font-bold text-white" : "text-[#6A6A6A]"
            )}>
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
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Project Name</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Creation Date</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Budget</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Rewards Paid out</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Flash Bonus</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Reward APY</th>
                  <th className="border-0 border-b border-[#454545] p-4 text-left text-base font-bold text-[#D9D9D9]">Status</th>
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
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.deadline}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.fundingGoal}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.backersRewards}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.flashBonus}</td>
                    <td className="border-0 p-4 text-[#6A6A6A]">{project.rewardAPY}</td>
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