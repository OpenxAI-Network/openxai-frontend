"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Timer } from "lucide-react"

const GOVERNANCE_STATS = [
  { label: "Total locked OPENX", value: "12.5M" },
  { label: "Your voting power", value: "2,846" },
  { label: "Proposal created", value: "23" },
  { label: "Total vote cast", value: "1.2M" }
]

const ACTIVE_PROPOSALS = [
  {
    id: "OXAI-1",
    title: "Protocol Fee Distribution Update",
    description: "Modify the fee distribution model to allocate 30% to development fund",
    status: "Active",
    votesFor: 2876888,
    votesAgainst: 2876888,
    endsIn: "2 days",
    quorum: 75
  },
  {
    id: "OXAI-1",
    title: "Treasury Management Framework",
    description: "Modify the fee distribution model to allocate 30% to development fund",
    status: "Active",
    votesFor: 2876888,
    votesAgainst: 2876888,
    endsIn: "2 days",
    quorum: 45
  },
  {
    id: "OXAI-1",
    title: "Integration Partner Selection",
    description: "Modify the fee distribution model to allocate 30% to development fund",
    status: "Active",
    votesFor: 2876888,
    votesAgainst: 2876888,
    endsIn: "2 days",
    quorum: 60
  }
]

export default function GovernancePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
        <SideMenu />
        <main className="ml-[234px] flex-1 p-12 pt-32">
          {/* Stats Grid - Updated without boxes */}
          <div className="mb-12 grid grid-cols-4 gap-8">
            {GOVERNANCE_STATS.map((stat, index) => (
              <div key={index}>
                <div className="text-sm font-normal text-gray-400">{stat.label}</div>
                <div className="mt-1 text-[32px] font-medium text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* Active Proposals */}
            <div className="col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-white">Active Proposals</h2>
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
                    className="rounded-xl bg-[#1F2021] p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{proposal.id}</span>
                          <h3 className="text-lg font-medium text-white">{proposal.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{proposal.description}</p>
                      </div>
                      <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3">
                        <span className="font-inter text-[16px] font-light text-[#4CFF46]">
                          {proposal.endsIn}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Quorum Progress</span>
                        <span className="text-white">{proposal.quorum}%</span>
                      </div>
                      <Progress 
                        value={proposal.quorum} 
                        className="h-2 bg-[#1a1f2e] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:to-[#122BEA]" 
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <Button 
                        className="flex-1 bg-[#4CFF46] text-white hover:bg-[#4CFF46]/90"
                      >
                        Vote For
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
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
              <div className="rounded-xl bg-[#1F2021] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Your Voting Power</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">OPENX Balance</div>
                    <div className="text-2xl font-medium text-white">2,846</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Delegated to You</div>
                    <div className="text-2xl font-medium text-white">0</div>
                  </div>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Delegated Votes
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-xl bg-[#1F2021] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
                    <div>
                      <div className="text-sm text-white">Voting on OXAI-1</div>
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
              <div className="rounded-xl bg-[#1F2021] p-6">
                <h3 className="mb-4 text-lg font-medium text-white">Resources</h3>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Governance documentation
                  </a>
                  <a 
                    href="#" 
                    className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Proposal guidelines
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