"use client"

import React from "react"
import { SideMenu } from "@/components/genesis/SideMenu"
import Link from "next/link"
import { MobileResponsiveWrapper } from "@/components/layouts/MobileResponsiveWrapper"

export default function StakePage() {
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
          Staking will be going live after the{' '}
          <a 
            href="/genesis" 
            className="pointer-events-auto font-bold underline hover:text-blue-300"
          >
            $OPENX Token Genesis Event
          </a>!
        </span>
      </div>

      {/* Disable interactions but without visual overlay */}
      <div className="pointer-events-none" style={{ backgroundColor: 'transparent' }}>
        <div className="flex min-h-screen p-0">
          <main className="flex-1 p-12 pt-16 [@media(max-width:960px)]:p-4 [@media(max-width:960px)]:pt-32">
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
                        4% APR
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
                  
                  <div className="relative flex w-full flex-col">
                    {/* First row: 0 and APR */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-inter text-[60px] font-medium text-white [@media(max-width:400px)]:text-[32px] [@media(max-width:650px)]:text-[40px]">
                        0
                      </h3>
                      <div className="flex h-[30px] items-center justify-center rounded-lg border border-green-500/30 px-3 [@media(max-width:400px)]:h-[20px] [@media(max-width:650px)]:h-[24px]">
                        <span className="font-inter text-[16px] font-light text-[#4CFF46] [@media(max-width:400px)]:text-xs [@media(max-width:650px)]:text-sm">
                          4% APR
                        </span>
                      </div>
                    </div>
                  
                    {/* Second row: NFT status and link */}
                    <div className="mt-6 flex flex-col items-center">
                      <p className="font-inter text-[30px] font-medium text-[#AEAEAE] [@media(max-width:400px)]:text-[20px] [@media(max-width:650px)]:text-[24px]">
                        You don&apos;t have an NFT
                      </p>
                      <Link 
                        href="https://docs.openxai.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-inter pointer-events-auto mt-2 text-[20px] font-medium text-[#AFAFAF] underline hover:text-blue-300 [@media(max-width:400px)]:text-sm [@media(max-width:650px)]:text-base"
                      >
                        Learn how to get yours
                      </Link>
                    </div>
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