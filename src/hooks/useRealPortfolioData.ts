/** @format */

"use client";

import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

// Common ERC-20 tokens with their contracts
const POPULAR_TOKENS = {
	ETH: { symbol: "ETH", name: "Ethereum", decimals: 18 },
	MATIC: {
		symbol: "MATIC",
		name: "Polygon",
		decimals: 18,
		address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
	},
	USDC: {
		symbol: "USDC",
		name: "USD Coin",
		decimals: 6,
		address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	},
	USDT: {
		symbol: "USDT",
		name: "Tether",
		decimals: 6,
		address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	},
	LINK: {
		symbol: "LINK",
		name: "Chainlink",
		decimals: 18,
		address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
	},
	UNI: {
		symbol: "UNI",
		name: "Uniswap",
		decimals: 18,
		address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
	},
	AAVE: {
		symbol: "AAVE",
		name: "Aave",
		decimals: 18,
		address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
	},
};

export function useRealPortfolioData() {
	const { address, isConnected, chain } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	const { data: blockNumber } = useBlockNumber({ watch: true });
	const [portfolioData, setPortfolioData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [prices, setPrices] = useState<any>({});

	// Fetch crypto prices
	useEffect(() => {
		fetchPrices();
	}, []);

	// Fetch portfolio data when address or block changes
	useEffect(() => {
		if (isConnected && address) {
			fetchPortfolioData();
		} else {
			setLoading(false);
		}
	}, [isConnected, address, blockNumber]);

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			if (isConnected && address) {
				fetchPortfolioData();
			}
		}, 30000); // 30 seconds

		return () => clearInterval(interval);
	}, [isConnected, address]);

	const fetchPrices = async () => {
		try {
			const response = await fetch("/api/crypto-prices");
			const data = await response.json();
			if (data.success) {
				setPrices(data.prices);
			}
		} catch (error) {
			console.error("Error fetching prices:", error);
		}
	};

	const fetchPortfolioData = async () => {
		if (!address) return;

		setLoading(true);
		try {
			// In a real app, you'd fetch from multiple chains and protocols
			// For now, we'll simulate multi-chain data
			const simulatedData = await simulatePortfolioData(address);
			setPortfolioData(simulatedData);
		} catch (error) {
			console.error("Error fetching portfolio data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Simulate portfolio data - replace with real API calls
	const simulatePortfolioData = async (walletAddress: string) => {
		// Mock data that will be replaced with real APIs
		const mockAssets = [
			{
				symbol: "ETH",
				name: "Ethereum",
				balance: nativeBalance
					? parseFloat(formatEther(nativeBalance.value))
					: 0,
				value: nativeBalance
					? parseFloat(formatEther(nativeBalance.value)) *
					  (prices.eth?.price || 2700)
					: 0,
				change24h: prices.eth?.change24h || 1.8,
				price: prices.eth?.price || 2700,
				chain: "ethereum",
			},
			{
				symbol: "MATIC",
				name: "Polygon",
				balance: 1250.5,
				value: 1250.5 * (prices.matic?.price || 1.0),
				change24h: prices.matic?.change24h || -0.5,
				price: prices.matic?.price || 1.0,
				chain: "polygon",
			},
			{
				symbol: "USDC",
				name: "USD Coin",
				balance: 2500.0,
				value: 2500.0,
				change24h: 0.0,
				price: 1.0,
				chain: "ethereum",
			},
			{
				symbol: "ARB",
				name: "Arbitrum",
				balance: 850.0,
				value: 850.0 * (prices.arb?.price || 1.2),
				change24h: prices.arb?.change24h || 3.2,
				price: prices.arb?.price || 1.2,
				chain: "arbitrum",
			},
			{
				symbol: "OP",
				name: "Optimism",
				balance: 1200.0,
				value: 1200.0 * (prices.op?.price || 1.83),
				change24h: prices.op?.change24h || 5.1,
				price: prices.op?.price || 1.83,
				chain: "optimism",
			},
		];

		// Calculate totals
		const totalValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
		const totalChange24h = mockAssets.reduce((sum, asset) => {
			return sum + asset.value * (asset.change24h / 100);
		}, 0);
		const percentageChange24h =
			totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

		// Group by chain
		const chains = mockAssets.reduce((acc: any, asset) => {
			if (!acc[asset.chain]) acc[asset.chain] = 0;
			acc[asset.chain] += asset.value;
			return acc;
		}, {});

		return {
			totalValue,
			change24h: percentageChange24h,
			assets: mockAssets,
			chains,
			lastUpdated: new Date().toISOString(),
		};
	};

	return {
		portfolioData,
		loading,
		prices,
		refetch: fetchPortfolioData,
		isConnected,
		address,
	};
}
