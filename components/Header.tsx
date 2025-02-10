"use client"

import { Button } from "@/components/ui/button"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MENU_ITEMS = [
  { name: "Vision", href: "/vision" },
  { name: "Models", href: "https://studio.openxai.org/app-store" },
  { name: "Community", href: "https://openxai.discourse.group/" },
  { name: "Contribute & Earn", href: "/contribute" },
  { name: "DAO", href: "/dao" },
  { name: "Doc", href: "https://openxai-docs.vercel.app/" },
  { name: "Genesis", href: "/genesis" },
]

export function Header() {
  const pathname = usePathname()
  const isGenesisPage = pathname === "/genesis"
  const {open} = useWeb3Modal();

  return (
    <header className="fixed top-0 z-50 w-full bg-white py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-16 text-xl font-bold text-black">
            OpenXAI
          </Link>
          <nav className="flex items-center space-x-12">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {isGenesisPage ? (
          <Button
            className="bg-[#4776E6] hover:bg-[#3665D5]"
            onClick={() => open()}
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            className="bg-[#4776E6] hover:bg-[#3665D5]"
            asChild
          >
            <Link href="/genesis">Genesis</Link>
          </Button>
        )}
      </div>
    </header>
  )
} 