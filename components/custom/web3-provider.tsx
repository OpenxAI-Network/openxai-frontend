"use client"

import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import {
  cookieStorage,
  createStorage,
  fallback,
  http,
  WagmiProvider,
} from "wagmi"
import { base, baseSepolia } from "wagmi/chains"

import { siteConfig } from "@/config/site"

export const chains = process.env.NEXT_PUBLIC_TESTNET
  ? ([baseSepolia] as const)
  : ([base] as const)
export const defaultChain = process.env.NEXT_PUBLIC_TESTNET ? baseSepolia : base

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "https://dashboard.openxai.org/icon.png" as const
const appUrl = "https://dashboard.openxai.org" as const
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
}

const projectId = "2bba2b51ffe8712d1e91e599edb7b484" as const // WalletConnect
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: fallback([
      http("https://base-rpc.publicnode.com"),
      http("https://base.drpc.org"),
      http("https://base.llamarpc.com"),
    ]),
    [baseSepolia.id]: fallback([
      http("https://base-sepolia-rpc.publicnode.com"),
      http("https://base-sepolia.drpc.org"),
    ]),
  },
  auth: {
    email: false,
  },
})

// Client component to ensure Web3Modal is only created on the client side
function Web3ModalInitializer() {
  useEffect(() => {
    try {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
      })
    } catch (error) {
      console.error("Failed to initialize Web3Modal:", error)
    }
  }, [])

  return null
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const [isMounted, setIsMounted] = useState(false)

  // Only render children after component has mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ModalInitializer />
        {isMounted ? children : null}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
