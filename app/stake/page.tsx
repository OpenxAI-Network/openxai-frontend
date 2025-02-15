"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"

export default function StakePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center_top,_rgba(27,37,56,0.9)_0%,_#151516_100%)]">
        <SideMenu />
        <main className="ml-[234px] flex-1 p-8 pt-24">
          {/* SPENX Staking Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Stake $OPENX</h2>
              <div className="rounded-lg border border-green-500/30 px-3 py-1">
                <span className="text-sm text-green-500">5.7% APR</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between rounded-xl bg-[#1F2021] p-8">
              <div>
                <h3 className="text-6xl font-bold text-white">0</h3>
              </div>
            </div>
          </div>

          {/* Gov NFT Staking Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Stake GovNFT</h2>
              <div className="rounded-lg border border-green-500/30 px-3 py-1">
                <span className="text-sm text-green-500">5.7% APR</span>
              </div>
            </div>
            
            <div className="rounded-xl bg-[#1F2021] p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-6xl font-bold text-white">0</h3>
                </div>
              </div>
              <div className="mt-6 text-center text-gray-400">
                You don&apos;t have An NFT
                <a href="#" className="ml-2 text-blue-500 hover:underline">
                  How to get
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}