/** @format */

"use client";

import { useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";

export function useNetworkHandler() {
	const { chain, isConnected } = useAccount();
	const { switchChain } = useSwitchChain();

	// Auto-switch to Ethereum if connected to unsupported network
	useEffect(() => {
		if (isConnected && chain && !isSupportedChain(chain.id)) {
			console.warn(`Unsupported chain: ${chain.name} (ID: ${chain.id})`);
			// You could show a toast notification here
			// toast.error(`Unsupported network: ${chain.name}. Switching to Ethereum.`);

			// Auto-switch to Ethereum (optional)
			// switchChain({ chainId: 1 });
		}
	}, [chain, isConnected, switchChain]);

	const isSupportedChain = (chainId: number) => {
		const supportedChainIds = [1, 137, 42161, 10, 8453, 56, 43114];
		return supportedChainIds.includes(chainId);
	};

	return { isSupportedChain };
}

// Helper function to get network info
export function getNetworkInfo(chainId: number) {
	const networks = {
		1: { name: "Ethereum", color: "#627eea", explorer: "https://etherscan.io" },
		137: {
			name: "Polygon",
			color: "#8247e5",
			explorer: "https://polygonscan.com",
		},
		42161: {
			name: "Arbitrum",
			color: "#28a0f0",
			explorer: "https://arbiscan.io",
		},
		10: {
			name: "Optimism",
			color: "#ff0420",
			explorer: "https://optimistic.etherscan.io",
		},
		8453: { name: "Base", color: "#0052ff", explorer: "https://basescan.org" },
		56: {
			name: "BNB Chain",
			color: "#f0b90b",
			explorer: "https://bscscan.com",
		},
		43114: {
			name: "Avalanche",
			color: "#e84142",
			explorer: "https://snowtrace.io",
		},
	};

	return (
		networks[chainId as keyof typeof networks] || {
			name: "Unknown",
			color: "#6b7280",
			explorer: "",
		}
	);
}
