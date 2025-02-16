"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import { Header } from "@/components/Header"
import Link from "next/link"

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
              <h2 className="font-inter text-[20px] font-bold text-white">Stake $OPENX</h2>
            </div>
            
            <div className="flex items-center justify-between rounded-xl bg-[#1F2021] p-8">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-inter text-[60px] font-medium text-white">0</h3>
                <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3">
                  <span className="font-inter text-[16px] font-light text-[#4CFF46]">5.7% APR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gov NFT Staking Section */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-inter text-[20px] font-bold text-white">Stake GovNFT</h2>
            </div>
            
            <div className="relative rounded-xl bg-[#1F2021] p-8">
              {/* Gradient Overlay - updated with correct opacity values */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#414141] to-[#1F2136] opacity-100" />
              
              <div className="relative flex w-full items-center justify-between">
                <h3 className="font-inter text-[60px] font-medium text-white">0</h3>
                <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3">
                  <span className="font-inter text-[16px] font-light text-[#4CFF46]">5.7% APR</span>
                </div>
              </div>
              
              <div className="relative mt-6 flex flex-col items-center">
                <p className="font-inter text-[30px] font-medium text-[#AEAEAE]">
                  You don&apos;t have an NFT
                </p>
                <Link 
                  href="#" 
                  className="font-inter mt-2 text-[20px] font-medium text-[#AFAFAF] underline hover:opacity-80"
                >
                  How to get
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}