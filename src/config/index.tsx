import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage, http } from 'wagmi'
import { holesky, mainnet, polygon, sepolia } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [mainnet, sepolia, holesky, polygon] as const
export const config = defaultWagmiConfig({
    chains,
    transports: {
        [sepolia.id]: http(),
        [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/wetra8HLzo_m-UswS8UJCnwdzS40X2wN")
    },
    projectId,
    metadata,
    auth: {
        email: true, // default to true
        socials: ['google', 'x', 'github', 'discord', 'apple'],
        showWallets: true, // default to true
        walletFeatures: true // default to true
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    }),
})
