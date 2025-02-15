"use client"
import React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFlag,
  faFlagCheckered,
  faCoins,
  faDollarSign,
  faScaleBalanced
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"
import { useWeb3Modal } from "@web3modal/wagmi/react"


export interface SideMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SIDE_MENU_ITEMS = [
  { 
    name: "Genesis", 
    href: "/genesis", 
    icon: <FontAwesomeIcon icon={faFlag} className="size-4" />
  },
  { 
    name: "Claims", 
    href: "/claims", 
    icon: <FontAwesomeIcon icon={faFlagCheckered} className="size-4" />
  },
  { 
    name: "Stake", 
    href: "/stake", 
    icon: <FontAwesomeIcon icon={faCoins} className="size-4" />
  },
  { 
    name: "Earn", 
    href: "/earn", 
    icon: <FontAwesomeIcon icon={faDollarSign} className="size-4" />
  },
  { 
    name: "Governance", 
    href: "/governance", 
    icon: <FontAwesomeIcon icon={faScaleBalanced} className="size-4" />
  },
]

export function SideMenu({ className, ...props }: SideMenuProps) {
  const pathname = usePathname()
  const { open } = useWeb3Modal()
  const isConnected = false // todo add wallet state

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-[234px] bg-[#2C2626] p-4",
        className
      )}
      {...props}
    >
      {/* Wallet Connect Card */}
      <div className="relative mb-10 mt-24 h-[107px] w-full rounded-lg">
        {/* Content */}
        <div className="relative flex h-full flex-col justify-end rounded-lg bg-[#1F2021] p-4">
          {!isConnected ? (
            <>
              {/* Disconnected State */}
              <div className="relative">
                {/* Balance Display - Bottom Aligned */}
                <div className="flex items-end justify-between">
                  <span className="text-[50px] font-light leading-none text-white/30">0</span>
                  <span className="text-[13px] font-normal text-white/30">OPENX</span>
                </div>

                {/* Semi-transparent overlay with Connect Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => open()}
                    className="-mt-8 whitespace-nowrap text-center text-[18px] font-bold text-white hover:text-gray-200"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Connected State */}
              <div className="flex items-end justify-between">
                <span className="text-[50px] font-light leading-none text-white">13.30</span>
                <span className="text-[13px] font-normal text-white">OPENX</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_ITEMS.map((item) => (
        <NextLink
          key={item.name}
          href={item.href}
          className={`mb-4 flex items-center space-x-3 rounded-lg p-2 text-white hover:bg-gray-800 ${
            pathname === item.href ? "bg-blue-600" : ""
          }`}
        >
          <span className="text-gray-400">{item.icon}</span>
          <span>{item.name}</span>
        </NextLink>
      ))}
    </div>
  )
}