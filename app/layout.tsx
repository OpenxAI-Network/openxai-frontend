import "@/styles/globals.css"

import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Web3Provider } from "@/components/custom/web3-provider"
import { V10SidebarStandalone } from "@/components/V10SidebarStandalone"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/openxai-logo.png",
    shortcut: "/openxai-logo.png",
    apple: "/openxai-logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
        <head />
        <body
          className={cn(
            "min-h-screen bg-black font-sans antialiased",
            inter.variable
          )}
        >
          {/* Global V10 Identity Strip */}
          <div className="fixed top-0 left-0 bottom-0 w-1 bg-blue-600 z-[9999] shadow-[0_0_20px_rgba(37,99,235,0.8)]" />

          <Web3Provider>
            <div className="relative flex min-h-screen">
              <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
                
                :root {
                  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
                }

                body {
                  font-family: var(--font-sans) !important;
                  background-color: black !important;
                  color: white !important;
                }

                header.fixed.top-0 { display: none !important; }
                main { pt-0 !important; }
              `}} />
              <V10SidebarStandalone />
              <main className="flex-1 lg:pl-[234px]">
                {children}
              </main>
            </div>
            <Toaster />
            <TailwindIndicator />
          </Web3Provider>
        </body>
      </html>
    </>
  )
}
