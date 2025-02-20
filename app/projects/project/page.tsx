"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"
import projects from "@/data/projects.json"
import ReactMarkdown from 'react-markdown'
import { ExternalLink } from "lucide-react"
import Link from "next/link"

function ProjectContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const project = projects.find(p => p.id === id)

  if (!project) return <div>Project not found</div>

  return (
    <MobileResponsiveWrapper>
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">{project.name}</h1>
      </div>

      {/* Project Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {/* Left Column - Project Details */}
        <div className="space-y-4 rounded-lg border border-[#454545] bg-[#1F2021] p-6">
          <h2 className="text-xl font-bold text-white">Project Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Funding Goal</span>
              <span className="text-white">
                ${Number(project.fundingGoal).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Deadline</span>
              <span className="text-white">{project.deadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Reward APY</span>
              <span className="text-white">{project.rewardAPY}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Status</span>
              <span className={`bg-gradient-to-r from-white ${project.status === "Completed" ? "to-green-500" : "to-blue-500"} bg-clip-text text-transparent`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Rewards Info */}
        <div className="space-y-4 rounded-lg border border-[#454545] bg-[#1F2021] p-6">
          <h2 className="text-xl font-bold text-white">Rewards</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Backers Rewards</span>
              <span className="text-white">
                {Number(project.backersRewards).toLocaleString()} OPENX
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Flash Bonus</span>
              <span className="text-white">
                {Number(project.flashBonus).toLocaleString()} OPENX
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6A6A6A]">Escrow</span>
              {project.escrow && (
                <a 
                  href={`https://etherscan.io/address/${project.escrow}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
                >
                  <span>{project.escrow.slice(0, 6)}...{project.escrow.slice(-4)}</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="mb-4 rounded-lg border border-[#454545] bg-[#1F2021] p-6">
        <ReactMarkdown 
          className="prose prose-invert max-w-none"
          components={{
            h2: ({node, ...props}) => <h2 className="mb-6 text-2xl font-bold text-white" {...props} />,
            p: ({node, ...props}) => <p className="mb-4 text-base text-[#6A6A6A]" {...props} />,
            ul: ({node, ...props}) => <ul className="mb-4 list-disc pl-4" {...props} />,
            li: ({node, ...props}) => <li className="mb-2 text-base text-[#6A6A6A]" {...props} />
          }}
        >
          {project.description}
        </ReactMarkdown>
      </div>

      {/* Back Link */}
      <Link 
        href="/projects" 
        className="text-white transition-colors hover:text-gray-300"
      >
        Back to Projects page
      </Link>
    </MobileResponsiveWrapper>
  )
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectContent />
    </Suspense>
  )
}