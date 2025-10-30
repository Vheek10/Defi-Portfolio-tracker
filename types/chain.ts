/** @format */

// types/chain.ts
export interface Chain {
	id: number;
	name: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	rpcUrls: string[];
	blockExplorerUrls: string[];
}

export interface TokenBalance {
	chainId: number;
	contractAddress: string | null; // null for native tokens
	name: string;
	symbol: string;
	decimals: number;
	balance: string;
	price?: number;
	valueUSD?: number;
	logo?: string;
}

export interface Portfolio {
	totalValueUSD: number;
	chains: {
		[chainId: number]: {
			chain: Chain;
			tokens: TokenBalance[];
			chainValueUSD: number;
		};
	};
}
