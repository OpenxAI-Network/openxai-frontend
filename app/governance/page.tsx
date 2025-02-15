"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Timer } from "lucide-react"

const ACTIVE_PROPOSALS = [
  {
    id: "OXAI-1",
    title: "Protocol Fee Distribution Update",
    description: "Modify the fee distribution model to allocate 30% to development fund",
    status: "Active",
    votesFor: 2845923,
    votesAgainst: 982341,
    endsIn: "2 days",
    quorum: 75
  },
  {
    id: "OXAI-2",
    title: "Treasury Management Framework",
    description: "Establish a comprehensive framework for managing protocol treasury",
    status: "Active",
    votesFor: 1845923,
    votesAgainst: 782341,
    endsIn: "5 days",
    quorum: 45
  },
  {
    id: "OXAI-3",
    title: "Integration Partner Selection",
    description: "Vote on potential integration partners for Q2 2025",
    status: "Active",
    votesFor: 2145923,
    votesAgainst: 382341,
    endsIn: "3 days",
    quorum: 60
  }
]

const GOVERNANCE_STATS = [
  { label: "Total Locked OPENX", value: "12.5M" },
  { label: "Your Voting Power", value: "2,846" },
  { label: "Proposals Created", value: "23" },
  { label: "Total Votes Cast", value: "1.2M" }
]

export default function GovernancePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-black">
        <SideMenu />
        <main className="ml-[234px] flex-1 p-8 pt-24">
          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-4 gap-4">
            {GOVERNANCE_STATS.map((stat, index) => (
              <div 
                key={index}
                className="rounded-xl bg-[#0B1120] p-6"
              >
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="mt-2 text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* Active Proposals */}
            <div className="col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Active Proposals</h2>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Proposal
                </Button>
              </div>

              <div className="space-y-4">
                {ACTIVE_PROPOSALS.map((proposal) => (
                  <div 
                    key={proposal.id}
                    className="rounded-xl bg-[#0B1120] p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{proposal.id}</span>
                          <h3 className="text-lg font-medium text-white">{proposal.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{proposal.description}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-500">
                        <Timer size={14} />
                        {proposal.endsIn}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Quorum Progress</span>
                        <span className="text-white">{proposal.quorum}%</span>
                      </div>
                      <Progress 
                        value={proposal.quorum} 
                        className="h-2 bg-[#1a1f2e] [&>div]:bg-green-500" 
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <Button 
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      >
                        Vote For
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 text-white hover:bg-red-700"
                      >
                        Vote Against
                      </Button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Votes For</div>
                        <div className="text-white">{proposal.votesFor.toLocaleString()} OPENX</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Votes Against</div>
                        <div className="text-white">{proposal.votesAgainst.toLocaleString()} OPENX</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting Power */}
              <div className="rounded-xl bg-[#0B1120] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Your Voting Power</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">OPENX Balance</div>
                    <div className="text-2xl font-bold text-white">2,846</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Delegated to You</div>
                    <div className="text-2xl font-bold text-white">0</div>
                  </div>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Delegate Votes
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl bg-[#0B1120] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
                    <div>
                      <div className="text-sm text-white">Voted on OXAI-1</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                  <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
                    <div>
                      <div className="text-sm text-white">Delegated 1000 OPENX</div>
                      <div className="text-xs text-gray-400">1 day ago</div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="rounded-xl bg-[#0B1120] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Resources</h3>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Governance Documentation
                  </a>
                  <a 
                    href="#" 
                    className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Proposal Guidelines
                  </a>
                  <a 
                    href="#" 
                    className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Voting FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}