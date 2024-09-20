'use client'

import { config, projectId } from '@/config'
import { ReactNode } from 'react'

import { createWeb3Modal } from '@web3modal/wagmi/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true, // Optional - false as default
    themeVariables: {
        '--w3m-color-mix': '#0d0d0d',
        '--w3m-color-mix-strength': 40,
        '--w3m-font-family': 'Helvetica',
        '--w3m-font-size-master': '16px',
        '--w3m-border-radius-master': '10px',
    }
})

export default function Web3ModalProvider({
    children,
    initialState
}: {
    children: ReactNode
    initialState?: State
}) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
