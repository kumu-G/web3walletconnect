"use client";

import React, { useEffect, useState } from "react";
import {
    Address,
    createPublicClient,
    encodePacked,
    fromHex,
    http,
    keccak256,
    toHex,
} from "viem";
import { sepolia } from "viem/chains";

// https://sepolia.etherscan.io/address/0x14385ee5b58ef54fd459b4011a5c231c5e980bdb#code
// https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat
/**
 * 
 * 使用你熟悉的语言利用 eth
_getStorageAt RPC API 从链上读取 _locks 数组中的所有元素值，或者从另一个合约中设
法读取esRNT中私有数组 _locks 元素数据，并打印出如下内容：
locks[0]: user:……
,startTime:……,amount:……

    struct LockInfo{
        address user;  20
        uint64 startTime;  8
        uint256 amount; 32
    }
 */

//
const esRNTContractAddress: Address =
    "0x14385ee5b58Ef54Fd459B4011A5c231c5E980bDb";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

interface LockInfo {
    user: string;
    startTime: string;
    amount: bigint;
}

const EsRNT: React.FC = () => {
    // const esRNTContractAddress = process.env.NEXT_esRNTContractAddress as Address;

    const [locks, setLocks] = useState<LockInfo[]>([]);


    const firstLockSlot = toHex(0); // 这里需要替换为正确的存储槽位置

    useEffect(() => {
        const getLocks = async () => {
            try {
                const lockData = await publicClient.getStorageAt({
                    address: esRNTContractAddress,
                    slot: firstLockSlot, // 确保这是正确的存储槽位置
                });
                console.log(lockData, "Lock data from storage");
                if (!lockData || lockData.length === 0) return;
                // https://viem.sh/docs/utilities/keccak256#keccak256
                // const storageValueDecimal = parseInt(lockData, 16);
                // https://viem.sh/docs/utilities/fromHex#fromhex
                const num = fromHex(lockData, "number");

                //
                const baseSlot = keccak256(encodePacked(["uint256"], [BigInt(0)]));
                const locksData: LockInfo[] = [];
                for (let i = 0; i < num; i++) {
                    // https://viem.sh/docs/abi/encodePacked#types
                    const userAndTimeSlot = BigInt(baseSlot) + BigInt(i) * BigInt(2);
                    const userAndStartTimeSlotData = await publicClient.getStorageAt({
                        address: esRNTContractAddress,
                        slot: toHex(userAndTimeSlot),
                    });
                    const user = "0x" + userAndStartTimeSlotData?.slice(0, 42); // 需要根据实际数据解析
                    const startTime = new Date(
                        parseInt(userAndStartTimeSlotData!.slice(10, 26), 16) * 1000
                    ).toLocaleString(); // 取前 16 位字符（时间戳）

                    console.log(user, "user");
                    console.log(startTime, "startTime");
                    const amountSlot = userAndTimeSlot + BigInt(1);
                    const amountSlotData = await publicClient.getStorageAt({
                        address: esRNTContractAddress,
                        slot: toHex(amountSlot),
                    });

                    const amount = BigInt(amountSlotData!); // 需要根据实际数据解析
                    // const amount = amountSlotData; // 需要根据实际数据解析
                    // const amount = BigInt(1); // 需要根据实际数据解析

                    locksData.push({ user, startTime, amount });
                }

                setLocks(locksData);
            } catch (error) {
                console.error("Error fetching locks data:", error);
            }
        };

        getLocks();
    }, []); // 依赖数组，确保只有地址变化时才重新获取

    return (
        <div>
            <h1>EsRNT</h1>
            <p>EsRNT contract address: {esRNTContractAddress}</p>
            {locks.map((lock, index) => (
                <div key={index} className="flex flex-col space-y-1"> {/* 使用 flex 布局和减少空间 */}
                    <p className="text-sm font-medium">{`Lock ${index + 1}:`}</p>
                    <p className="text-sm">{`User: ${lock.user}`}</p>
                    <p className="text-sm">{`Start Time: ${lock.startTime}`}</p>
                    <p className="text-sm">{`Amount: ${lock.amount.toString()}`}</p>
                </div>
            ))}

        </div>
    );
};

export default EsRNT;
