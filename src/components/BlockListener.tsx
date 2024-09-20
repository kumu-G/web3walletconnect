"use client"

import React, { useEffect, useState } from 'react'

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
})

// 监听新区块，打印区块高度和区块哈稀值
// 20329474(0x662022f0...cc0dea26)
// https://viem.sh/docs/actions/public/getBlock

const BlockListener: React.FC = () => {
    const [blockHeight, setBlockHeight] = useState<number>(0)
    const [blockHash, setBlockHash] = useState<string>("")

    useEffect(() => {
        const fetchBlockData = async () => {
            try {
                const latestBlock = await publicClient.getBlock({ blockTag: 'latest' });
                setBlockHeight(Number(latestBlock.number));
                setBlockHash(latestBlock.hash);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const intervalId = setInterval(fetchBlockData, 5000); // 每 5 秒轮询一次

        return () => {
            clearInterval(intervalId); // 组件卸载时清除定时器
        };
    }, []); // 空数组作为第二个参数，表示仅在组件挂载和卸载时执行一次

    return (
        <div>
            <p className='font-sans text-2xl '>Latest Block: {blockHeight} ({blockHash})</p>
        </div>
    )
}

export default BlockListener
