"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const MENU_ITEMS = [
  { name: "Vision", href: "/vision" },
  { name: "Model Studio", href: "/models" },
  { name: "Community", href: "/community" },
  { name: "Contribute & Earn", href: "/contribute" },
  { name: "DAO", href: "/dao" },
  { name: "Docs", href: "/docs" },
]

const SOCIAL_ITEMS = [
  { 
    name: "X",
    href: "https://x.com/OpenxAINetwork",
    icon: (
      <svg className="size-5 text-gray-600 hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: "Telegram",
    href: "https://t.me/OpenxAINetwork",
    icon: (
      <svg className="size-5 text-gray-600 hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.93 3.24l-3.35 17.52A1.51 1.51 0 0117.12 22a1.53 1.53 0 01-1.09-.45l-6.9-6.89-3.35 3.35a.49.49 0 01-.35.15.5.5 0 01-.5-.5v-4.29l12.45-12.46a.5.5 0 01-.7.71L4.55 13.75l-2.85-1a1.51 1.51 0 01.1-2.89l18.59-7.15a1.51 1.51 0 011.54 2.53z"/>
      </svg>
    )
  }
]

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full bg-white py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex-1 lg:flex-none">
          <Link href="/" className="text-xl font-bold text-black">
            OpenxAI
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-12">
          <nav className="flex items-center space-x-12">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[18px] text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {SOCIAL_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <Button
            className="bg-[#4776E6] text-[18px] hover:bg-[#3665D5]"
            asChild
          >
            <Link href="/genesis">Genesis</Link>
          </Button>

          <button
            className="ml-4 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full bg-white py-6 shadow-lg lg:hidden">
            <nav className="flex flex-col items-center space-y-6">
              {MENU_ITEMS.map((item, index) => (
                <div key={item.name} className="w-full text-center">
                  <Link
                    href={item.href}
                    className="text-base text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {index < MENU_ITEMS.length - 1 && (
                    <div className="mx-auto mt-6 h-px w-4/5 bg-[#CCCCCC]" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}