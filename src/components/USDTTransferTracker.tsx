"use client";

import React, { useEffect, useState } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { mainnet } from "viem/chains";

// 实时采集并打印最新 USDT Token（0xdac17f958d2ee523a2206206994597c13d831ec7） Transfer 流水
// 如在 20329474 区块 0xe52ff...7ddcf 交易中从 0x65eDc7E1...5518AeF12 转账 50 USDT 到 0xa2D30559...30348f472
export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http("https://rpc.particle.network/evm-chain?chainId=1&projectUuid=959c33dd-7ef2-463b-a6b8-8f90f07ea711&projectKey=cwetJWjHZYkepjxaQTIH2FaKNgr2HeDujz5cEu5S")
});

const usdtTokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT 代币合约地址

const usdtTokenABI = parseAbiItem(
    "event Transfer(address indexed from, address indexed to, uint256 value)"
);

const get_filter = async (fromBlock: bigint, toBlock: bigint): Promise<any> => {
    const filter = await publicClient.createEventFilter({
        address: usdtTokenAddress,
        event: usdtTokenABI,
        fromBlock: fromBlock,
        toBlock: toBlock,
        strict: true,
    });
    return filter;
};

const USDTTransferTracker: React.FC = () => {
    const [latestBlockNumber, setLatestBlockNumber] = useState<number>();
    const [latestTransferInfo, setLatestTransferInfo] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 100;

    // https://viem.sh/docs/actions/public/watchBlockNumber
    useEffect(() => {
        const trackTransfers = async () => {
            publicClient.watchBlockNumber({
                emitOnBegin: true,
                pollingInterval: 12_000,
                poll: true,
                onBlockNumber: async (blockNumber) => {
                    try {
                        setLatestBlockNumber(Number(blockNumber));
                        const fromBlock: bigint = BigInt(blockNumber) - BigInt(100);
                        const toBlock: bigint = BigInt(blockNumber);

                        const filter = await get_filter(fromBlock, toBlock);

                        const logs = await publicClient.getFilterLogs({ filter });

                        console.log(`找到 ${logs.length} 条转账记录`);


                        if (logs.length > 0) {
                            setLatestTransferInfo(logs);
                        } else {
                            console.log("没有找到转账记录");
                            setLatestTransferInfo([]);
                        }
                    } catch (e) {
                        console.error(`获取转账记录失败: ${e}`);
                    }
                },
            });
        };
        trackTransfers();
    }, [latestTransferInfo]);

    // 计算当前页的转账信息
    const indexOfLastItem: number = currentPage * itemsPerPage;
    const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
    const currentItems: any[] = latestTransferInfo.slice(indexOfFirstItem, indexOfLastItem);

    // 改变页码
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">最新 USDT 转账信息</h2>
                {currentItems.map((log: any, index: number) => (
                    <div key={index} className="border rounded p-4 mb-2">
                        <p>address: {log.address}</p>
                        <p>区块号: {log.blockNumber.toString()}</p>
                        <p>交易哈希: {log.transactionHash}</p>
                        <p>发送者: {log.args?.from}</p>
                        <p>接收者: {log.args?.to}</p>
                        <p>数量: {log.args?.value.toString()}</p>
                    </div>
                ))}

                {/* 分页控件 */}
                <div className="mt-4 flex justify-center">
                    {[...Array(Math.ceil(latestTransferInfo.length / itemsPerPage)).keys()].map((number) => (
                        <button
                            key={number + 1}
                            className={`mx-2 px-4 py-2 rounded ${number + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => paginate(number + 1)}
                        >
                            {number + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* {latestTransferInfo.map((log: any, index: number) => (
                <div key={index}>
                    <p>
                        在 {log.blockNumber.toString()} 区块 {log.transactionHash} 交易中从
                        {log.args.from} 转账 {log.args.value.toString().slice(0, 10)} USDT 到 {log.args.to}

                    </p>
                </div>
            ))} */}
        </div>
    );
};

export default USDTTransferTracker;
