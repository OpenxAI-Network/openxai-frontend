"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import Link from "next/link"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

export default function StakePage() {
  return (
    <MobileResponsiveWrapper>
      {/* Disable interactions but without visual overlay */}
      <div className="pointer-events-none" style={{ backgroundColor: 'transparent' }}>
        <div className="flex min-h-screen p-0">
          <SideMenu />
          <main className="ml-[234px] flex-1 p-12 pt-16 [@media(max-width:960px)]:ml-0 [@media(max-width:960px)]:p-4 [@media(max-width:960px)]:pt-32">
            {/* Content wrapper with mobile spacing */}
            <div className="[@media(max-width:960px)]:mt-16">
              {/* OPENX Staking Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-inter text-[20px] font-bold text-white [@media(max-width:400px)]:text-base [@media(max-width:650px)]:text-lg">
                    Stake $OPENX
                  </h2>
                </div>
                
                <div className="flex items-center justify-between rounded-xl bg-[#1F2021] p-8 [@media(max-width:400px)]:p-4 [@media(max-width:650px)]:p-6">
                  <div className="flex w-full items-center justify-between">
                    <h3 className="font-inter text-[60px] font-medium text-white [@media(max-width:400px)]:text-[32px] [@media(max-width:650px)]:text-[40px]">
                      0
                    </h3>
                    <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3 [@media(max-width:400px)]:h-[20px] [@media(max-width:650px)]:h-[24px]">
                      <span className="font-inter text-[16px] font-light text-[#4CFF46] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">
                        5.7% APR
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gov NFT Staking Section */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-inter text-[20px] font-bold text-white [@media(max-width:400px)]:text-base [@media(max-width:650px)]:text-lg">
                    Stake GovNFT
                  </h2>
                </div>
                
                <div className="relative rounded-xl bg-[#1F2021] p-8 [@media(max-width:400px)]:p-4 [@media(max-width:650px)]:p-6">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#414141] to-[#1F2136] opacity-100" />
                  
                  <div className="relative flex w-full items-center justify-between">
                    <h3 className="font-inter text-[60px] font-medium text-white [@media(max-width:400px)]:text-[32px] [@media(max-width:650px)]:text-[40px]">
                      0
                    </h3>
                    <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3 [@media(max-width:400px)]:h-[20px] [@media(max-width:650px)]:h-[24px]">
                      <span className="font-inter text-[16px] font-light text-[#4CFF46] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">
                        5.7% APR
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative mt-6 flex flex-col items-center">
                    <p className="font-inter mt-[-100px] text-[30px] font-medium text-[#AEAEAE] [@media(max-width:400px)]:mt-[-60px] [@media(max-width:400px)]:text-[20px] [@media(max-width:650px)]:mt-[-80px] [@media(max-width:650px)]:text-[24px]">
                      You don&apos;t have an NFT
                    </p>
                    <Link 
                      href="#" 
                      className="font-inter mt-2 text-[20px] font-medium text-[#AFAFAF] underline hover:opacity-80 [@media(max-width:400px)]:text-sm [@media(max-width:650px)]:text-base"
                    >
                      How to get
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </MobileResponsiveWrapper>
  )
}