/** @format */

// config/chains.ts
export const SUPPORTED_CHAINS: { [key: number]: Chain } = {
	1: {
		id: 1,
		name: "Ethereum",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://eth.llamarpc.com"],
		blockExplorerUrls: ["https://etherscan.io"],
	},
	137: {
		id: 137,
		name: "Polygon",
		nativeCurrency: {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18,
		},
		rpcUrls: ["https://polygon-rpc.com"],
		blockExplorerUrls: ["https://polygonscan.com"],
	},
	42161: {
		id: 42161,
		name: "Arbitrum",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://arb1.arbitrum.io/rpc"],
		blockExplorerUrls: ["https://arbiscan.io"],
	},
	10: {
		id: 10,
		name: "Optimism",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://mainnet.optimism.io"],
		blockExplorerUrls: ["https://optimistic.etherscan.io"],
	},
	8453: {
		id: 8453,
		name: "Base",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://mainnet.base.org"],
		blockExplorerUrls: ["https://basescan.org"],
	},
};
