"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

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
  const [isHighlighted, setIsHighlighted] = React.useState(false);

  React.useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <MobileResponsiveWrapper>
      {/* Banner notification */}
      <div className={`mb-6 rounded-lg bg-blue-900/30 p-4 text-center transition-all duration-300 ${isHighlighted ? 'ring-1 ring-white' : ''}`}>
        <span className="text-sm text-white md:text-base">
          OpenxAI DAO Governance will be going live after Genesis! Learn more at our{' '}
          <a 
            href="https://docs.openxai.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:text-blue-300"
          >
            Docs site
          </a>
          .
        </span>
      </div>

      {/* Disable interactions but without visual overlay */}
      <div className="pointer-events-none" style={{ backgroundColor: 'transparent' }}>
        <div className="[@media(max-width:960px)]:mt-16">
          <div className="flex min-h-screen p-0">
            <main className="flex-1 p-12 pt-16 [@media(max-width:960px)]:p-4 [@media(max-width:960px)]:pt-32">
              {/* Stats Grid - Responsive */}
              <div className="mb-12 grid grid-cols-4 gap-8 [@media(max-width:650px)]:grid-cols-1 [@media(max-width:960px)]:grid-cols-2">
                {GOVERNANCE_STATS.map((stat, index) => (
                  <div key={index}>
                    <div className="text-sm font-normal text-gray-400 [@media(max-width:650px)]:text-xs">{stat.label}</div>
                    <div className="mt-1 text-[32px] font-medium text-white [@media(max-width:650px)]:text-[20px] [@media(max-width:960px)]:text-[24px]">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid - Responsive */}
              <div className="grid grid-cols-3 gap-8 [@media(max-width:960px)]:grid-cols-1">
                {/* Active Proposals */}
                <div className="col-span-2 space-y-6">
                  <div className="flex items-center justify-between [@media(max-width:650px)]:flex-col [@media(max-width:650px)]:items-start [@media(max-width:650px)]:gap-4">
                    <h2 className="text-xl font-medium text-white [@media(max-width:650px)]:text-lg">Active Proposals</h2>
                    <Button 
                      className="bg-blue-600 text-white hover:bg-blue-700 [@media(max-width:650px)]:w-full"
                    >
                      Create Proposal
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {ACTIVE_PROPOSALS.map((proposal) => (
                      <div 
                        key={proposal.id}
                        className="rounded-xl bg-[#1F2021] p-6 [@media(max-width:650px)]:p-4"
                      >
                        <div className="mb-4 flex items-center justify-between [@media(max-width:650px)]:flex-col [@media(max-width:650px)]:items-start [@media(max-width:650px)]:gap-3">
                          <div>
                            <div className="flex items-center gap-3 [@media(max-width:650px)]:flex-wrap">
                              <span className="text-sm text-gray-400 [@media(max-width:650px)]:text-xs">{proposal.id}</span>
                              <h3 className="text-lg font-medium text-white [@media(max-width:650px)]:text-base">{proposal.title}</h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-400 [@media(max-width:650px)]:text-xs">{proposal.description}</p>
                          </div>
                          <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3 [@media(max-width:650px)]:h-[24px]">
                            <span className="font-inter text-[16px] font-light text-[#4CFF46] [@media(max-width:650px)]:text-sm">
                              {proposal.endsIn}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm [@media(max-width:650px)]:text-xs">
                            <span className="text-gray-400">Quorum Progress</span>
                            <span className="text-white">{proposal.quorum}%</span>
                          </div>
                          <Progress 
                            value={proposal.quorum} 
                            className="h-2 bg-[#1a1f2e] [&>div]:bg-gradient-to-r [&>div]:from-white [&>div]:to-[#122BEA]" 
                          />
                        </div>

                        <div className="mt-4 flex items-center gap-4 [@media(max-width:650px)]:flex-col">
                          <Button 
                            className="flex-1 bg-[#4CFF46] text-white hover:bg-[#4CFF46]/90 [@media(max-width:650px)]:w-full"
                          >
                            Vote For
                          </Button>
                          <Button 
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 [@media(max-width:650px)]:w-full"
                          >
                            Vote Against
                          </Button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm [@media(max-width:650px)]:text-xs">
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

                {/* Sidebar - Becomes full width on mobile */}
                <div className="space-y-6">
                  {/* Voting Power */}
                  <div className="rounded-xl bg-[#1F2021] p-6 [@media(max-width:650px)]:p-4">
                    <h3 className="mb-4 text-lg font-medium text-white [@media(max-width:650px)]:text-base">Your Voting Power</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 [@media(max-width:650px)]:text-xs">OPENX Balance</div>
                        <div className="text-2xl font-medium text-white [@media(max-width:650px)]:text-xl">2,846</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 [@media(max-width:650px)]:text-xs">Delegated to You</div>
                        <div className="text-2xl font-medium text-white [@media(max-width:650px)]:text-xl">0</div>
                      </div>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 [@media(max-width:650px)]:text-sm">
                        Delegated Votes
                      </Button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl bg-[#1F2021] p-6 [@media(max-width:650px)]:p-4">
                    <h3 className="mb-4 text-lg font-medium text-white [@media(max-width:650px)]:text-base">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
                        <div>
                          <div className="text-sm text-white [@media(max-width:650px)]:text-xs">Voting on OXAI-1</div>
                          <div className="text-xs text-gray-400 [@media(max-width:650px)]:text-[10px]">2 hours ago</div>
                        </div>
                        <ChevronRight className="text-gray-400 [@media(max-width:650px)]:size-4" />
                      </div>
                      <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5">
                        <div>
                          <div className="text-sm text-white [@media(max-width:650px)]:text-xs">Delegated 1000 OPENX</div>
                          <div className="text-xs text-gray-400 [@media(max-width:650px)]:text-[10px]">1 day ago</div>
                        </div>
                        <ChevronRight className="text-gray-400 [@media(max-width:650px)]:size-4" />
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="rounded-xl bg-[#1F2021] p-6 [@media(max-width:650px)]:p-4">
                    <h3 className="mb-4 text-lg font-medium text-white [@media(max-width:650px)]:text-base">Resources</h3>
                    <div className="space-y-2">
                      <a 
                        href="#" 
                        className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white [@media(max-width:650px)]:text-xs"
                      >
                        Governance documentation
                      </a>
                      <a 
                        href="#" 
                        className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white [@media(max-width:650px)]:text-xs"
                      >
                        Proposal guidelines
                      </a>
                      <a 
                        href="#" 
                        className="block rounded-lg p-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white [@media(max-width:650px)]:text-xs"
                      >
                        Voting FAQ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}