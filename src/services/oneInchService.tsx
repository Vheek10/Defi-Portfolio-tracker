/** @format */

// services/oneInchService.ts
import { Token, SwapQuote, SwapParams } from "@/types/swap";

const ONE_INCH_BASE_URL = "https://api.1inch.io/v5.0";

export class OneInchService {
	private chainId: number;

	constructor(chainId: number = 1) {
		this.chainId = chainId;
	}

	// Get supported tokens
	async getTokens(): Promise<{ [address: string]: Token }> {
		try {
			const response = await fetch(
				`${ONE_INCH_BASE_URL}/${this.chainId}/tokens`,
			);
			const data = await response.json();
			return data.tokens;
		} catch (error) {
			console.error("Error fetching tokens:", error);
			return {};
		}
	}

	// Get swap quote
	async getQuote(params: {
		fromTokenAddress: string;
		toTokenAddress: string;
		amount: string;
	}): Promise<SwapQuote | null> {
		try {
			const { fromTokenAddress, toTokenAddress, amount } = params;

			const response = await fetch(
				`${ONE_INCH_BASE_URL}/${this.chainId}/quote?` +
					`fromTokenAddress=${fromTokenAddress}` +
					`&toTokenAddress=${toTokenAddress}` +
					`&amount=${amount}`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch quote");
			}

			const data = await response.json();

			return {
				fromToken: data.fromToken,
				toToken: data.toToken,
				fromTokenAmount: data.fromTokenAmount,
				toTokenAmount: data.toTokenAmount,
				estimatedGas: data.estimatedGas,
				gasPrice: data.gasPrice,
			};
		} catch (error) {
			console.error("Error fetching quote:", error);
			return null;
		}
	}

	// Get swap transaction data
	async getSwapTransaction(params: {
		fromTokenAddress: string;
		toTokenAddress: string;
		amount: string;
		fromAddress: string;
		slippage: number;
	}) {
		try {
			const {
				fromTokenAddress,
				toTokenAddress,
				amount,
				fromAddress,
				slippage,
			} = params;

			const response = await fetch(
				`${ONE_INCH_BASE_URL}/${this.chainId}/swap?` +
					`fromTokenAddress=${fromTokenAddress}` +
					`&toTokenAddress=${toTokenAddress}` +
					`&amount=${amount}` +
					`&fromAddress=${fromAddress}` +
					`&slippage=${slippage}`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch swap transaction");
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching swap transaction:", error);
			return null;
		}
	}

	// Get supported chains
	getSupportedChains() {
		return [
			{ id: 1, name: "Ethereum", symbol: "ETH" },
			{ id: 137, name: "Polygon", symbol: "MATIC" },
			{ id: 56, name: "Binance Smart Chain", symbol: "BNB" },
			{ id: 42161, name: "Arbitrum", symbol: "ETH" },
			{ id: 10, name: "Optimism", symbol: "ETH" },
			{ id: 8453, name: "Base", symbol: "ETH" },
		];
	}
}
