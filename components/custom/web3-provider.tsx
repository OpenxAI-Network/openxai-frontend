"use client"

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
import { mainnet, sepolia } from "wagmi/chains"
import { useEffect, useState } from "react"

import { siteConfig } from "@/config/site"

export const chains = process.env.NEXT_PUBLIC_TESTNET
  ? ([sepolia] as const)
  : ([mainnet] as const)
export const defaultChain = process.env.NEXT_PUBLIC_TESTNET ? sepolia : mainnet

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "https://openxai.org/icon.png" as const
const appUrl = "https://openxai.org" as const
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
    [mainnet.id]: fallback([
      http("https://cloudflare-eth.com"),
      http("https://eth.drpc.org"),
      http("https://eth.llamarpc.com"),
      http("https://rpc.ankr.com/eth"),
    ]),
    [sepolia.id]: fallback([
      http("https://sepolia.drpc.org"),
      http("https://rpc.ankr.com/eth_sepolia"),
    ]),
  },
  auth: {
    email: false,
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Web3Modal on the client side only
  useEffect(() => {
    if (!isInitialized) {
      try {
        createWeb3Modal({
          wagmiConfig: config,
          projectId,
        })
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize Web3Modal:", error)
      }
    }
  }, [isInitialized])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
