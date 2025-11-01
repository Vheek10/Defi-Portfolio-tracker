/** @format */
"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";
import {
	TrendingUp,
	TrendingDown,
	Wallet,
	Coins,
	PieChart,
	Activity,
	ArrowUpRight,
	ArrowDownRight,
	RefreshCw,
	ExternalLink,
} from "lucide-react";

// Types for our portfolio data
interface PortfolioAsset {
	symbol: string;
	balance: number;
	value: number;
	change24h: number;
	price: number;
	contractAddress?: string;
	chain: string;
}

interface PortfolioData {
	totalValue: number;
	change24h: number;
	assets: PortfolioAsset[];
	chains: {
		[chain: string]: number;
	};
}

// Common ERC20 tokens with their contract addresses
const COMMON_TOKENS = {
	1: {
		// Ethereum Mainnet
		USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
	},
	137: {
		// Polygon
		USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
		USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
		DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
		WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
	},
	42161: {
		// Arbitrum
		USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
		USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
		DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
	},
};

export function PortfolioDashboard() {
	const { address, isConnected } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	const chainId = useChainId();

	const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("1D");
	const [refreshing, setRefreshing] = useState(false);

	// Fetch portfolio data
	useEffect(() => {
		if (!isConnected || !address) return;

		const fetchPortfolioData = async () => {
			setLoading(true);
			try {
				// In a real implementation, you would:
				// 1. Fetch token balances from the blockchain
				// 2. Get current prices from CoinGecko/CoinMarketCap API
				// 3. Calculate portfolio value and changes

				const data = await fetchRealPortfolioData(address, chainId);
				setPortfolioData(data);
			} catch (error) {
				console.error("Error fetching portfolio data:", error);
				// Fallback to enhanced mock data
				setPortfolioData(getEnhancedMockData(address, chainId));
			} finally {
				setLoading(false);
			}
		};

		fetchPortfolioData();
	}, [isConnected, address, chainId]);

	const refreshPortfolio = async () => {
		if (!isConnected || !address) return;

		setRefreshing(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const data = await fetchRealPortfolioData(address, chainId);
			setPortfolioData(data);
		} catch (error) {
			console.error("Error refreshing portfolio:", error);
		} finally {
			setRefreshing(false);
		}
	};

	// If not connected, show connect prompt
	if (!isConnected || !address) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Connect Your Wallet
				</h3>
				<p className="text-gray-400 mb-6">
					Connect your wallet to view your DeFi portfolio across all chains
				</p>
				<div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<RefreshCw className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Loading Portfolio...
				</h3>
				<p className="text-gray-400">Fetching your assets across all chains</p>
			</div>
		);
	}

	if (!portfolioData) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<Activity className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					No Assets Found
				</h3>
				<p className="text-gray-400 mb-6">
					We couldn't find any assets in your wallet
				</p>
				<button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
					Add Funds
				</button>
			</div>
		);
	}

	const { totalValue, change24h, assets, chains } = portfolioData;
	const isPositive = change24h >= 0;

	return (
		<div className="space-y-6">
			{/* Header with Refresh */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-white">Portfolio Overview</h1>
					<p className="text-gray-400">
						Your assets across all connected chains
					</p>
				</div>
				<button
					onClick={refreshPortfolio}
					disabled={refreshing}
					className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
					<RefreshCw
						className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
					/>
					{refreshing ? "Refreshing..." : "Refresh"}
				</button>
			</div>

			{/* Portfolio Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Portfolio Value */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">
							Portfolio Value
						</h3>
						<Wallet className="h-5 w-5 text-blue-400" />
					</div>
					<div className="flex items-baseline gap-2 mb-2">
						<span className="text-2xl font-bold text-white">
							$
							{totalValue.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
						<div
							className={`flex items-center gap-1 text-sm ${
								isPositive ? "text-green-400" : "text-red-400"
							}`}>
							{isPositive ? (
								<TrendingUp className="h-4 w-4" />
							) : (
								<TrendingDown className="h-4 w-4" />
							)}
							<span>
								{isPositive ? "+" : ""}
								{change24h}%
							</span>
						</div>
					</div>
					<p className="text-gray-400 text-sm">24h change</p>
				</div>

				{/* Native Balance */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">
							Native Balance
						</h3>
						<Coins className="h-5 w-5 text-yellow-400" />
					</div>
					<div className="mb-2">
						<span className="text-2xl font-bold text-white">
							{nativeBalance
								? parseFloat(formatEther(nativeBalance.value)).toFixed(4)
								: "0.0000"}
						</span>
						<span className="text-gray-400 ml-2">{nativeBalance?.symbol}</span>
					</div>
					<p className="text-gray-400 text-sm">Current chain</p>
				</div>

				{/* Top Asset */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">Top Asset</h3>
						<Activity className="h-5 w-5 text-green-400" />
					</div>
					<div className="mb-2">
						<span className="text-2xl font-bold text-white">
							{assets[0]?.symbol || "N/A"}
						</span>
						{assets[0] && (
							<span
								className={`ml-2 text-sm ${
									assets[0].change24h >= 0 ? "text-green-400" : "text-red-400"
								}`}>
								{assets[0].change24h >= 0 ? "+" : ""}
								{assets[0].change24h}%
							</span>
						)}
					</div>
					<p className="text-gray-400 text-sm">
						${assets[0]?.value.toLocaleString() || "0"}
					</p>
				</div>

				{/* Active Chains */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">Active Chains</h3>
						<PieChart className="h-5 w-5 text-purple-400" />
					</div>
					<div className="mb-2">
						<span className="text-2xl font-bold text-white">
							{Object.keys(chains).length}
						</span>
					</div>
					<p className="text-gray-400 text-sm">Networks with assets</p>
				</div>
			</div>

			{/* Asset Allocation & Assets Table */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Asset Allocation Chart */}
				<div className="lg:col-span-1 bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white">
							Asset Allocation
						</h3>
						<span className="text-gray-400 text-sm">
							{assets.length} assets
						</span>
					</div>
					<div className="space-y-4">
						{Object.entries(chains).map(([chain, value]) => {
							const percentage = (value / totalValue) * 100;
							return (
								<div
									key={chain}
									className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-gray-300 capitalize">{chain}</span>
										<span className="text-white font-medium">
											{percentage.toFixed(1)}%
										</span>
									</div>
									<div className="w-full bg-gray-700 rounded-full h-2">
										<div
											className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
											style={{ width: `${percentage}%` }}></div>
									</div>
									<div className="flex justify-between text-xs text-gray-400">
										<span>
											$
											{value.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
										<span>{percentage.toFixed(1)}%</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Assets Table */}
				<div className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">Your Assets</h3>
						<div className="flex items-center gap-4">
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
								<option value="1D">24H</option>
								<option value="1W">1W</option>
								<option value="1M">1M</option>
								<option value="1Y">1Y</option>
							</select>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
										Asset
									</th>
									<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
										Balance
									</th>
									<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
										Price
									</th>
									<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
										Value
									</th>
									<th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
										24h
									</th>
								</tr>
							</thead>
							<tbody>
								{assets.map((asset, index) => (
									<tr
										key={`${asset.symbol}-${asset.chain}-${index}`}
										className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
										<td className="py-3 px-4">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
													{asset.symbol.charAt(0)}
												</div>
												<div>
													<div className="text-white font-medium">
														{asset.symbol}
													</div>
													<div className="text-gray-400 text-xs capitalize">
														{asset.chain}
													</div>
												</div>
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white font-medium">
												{asset.balance.toLocaleString(undefined, {
													maximumFractionDigits: 6,
												})}
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white">
												$
												{asset.price.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: asset.price < 1 ? 6 : 2,
												})}
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white font-medium">
												$
												{asset.value.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</div>
										</td>
										<td className="py-3 px-4 text-right">
											<div
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
													asset.change24h >= 0
														? "bg-green-500/20 text-green-400"
														: "bg-red-500/20 text-red-400"
												}`}>
												{asset.change24h >= 0 ? (
													<ArrowUpRight className="h-3 w-3" />
												) : (
													<ArrowDownRight className="h-3 w-3" />
												)}
												{asset.change24h >= 0 ? "+" : ""}
												{asset.change24h}%
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Summary */}
					<div className="mt-6 pt-6 border-t border-gray-700">
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Total Portfolio Value</span>
							<div className="text-right">
								<div className="text-white font-bold text-lg">
									$
									{totalValue.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</div>
								<div
									className={`text-sm ${
										isPositive ? "text-green-400" : "text-red-400"
									}`}>
									{isPositive ? "+" : ""}
									{change24h}% (24h)
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
				<h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<Wallet className="h-4 w-4" />
						Add Funds
					</button>
					<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<RefreshCw className="h-4 w-4" />
						Swap Tokens
					</button>
					<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<TrendingUp className="h-4 w-4" />
						Stake Assets
					</button>
					<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<ExternalLink className="h-4 w-4" />
						View Analytics
					</button>
				</div>
			</div>
		</div>
	);
}

// Enhanced mock data generator
function getEnhancedMockData(address: string, chainId: number): PortfolioData {
	const baseData = {
		totalValue: 15432.67,
		change24h: 2.34,
		assets: [
			{
				symbol: "ETH",
				balance: 3.2,
				value: 8640.25,
				change24h: 1.8,
				price: 2700.08,
				chain: "ethereum",
			},
			{
				symbol: "MATIC",
				balance: 1250.5,
				value: 1250.5,
				change24h: -0.5,
				price: 1.0,
				chain: "polygon",
			},
			{
				symbol: "USDC",
				balance: 2500,
				value: 2500.0,
				change24h: 0.0,
				price: 1.0,
				chain: "ethereum",
			},
			{
				symbol: "ARB",
				balance: 850,
				value: 850.92,
				change24h: 3.2,
				price: 1.0,
				chain: "arbitrum",
			},
			{
				symbol: "OP",
				balance: 1200,
				value: 2191.0,
				change24h: 5.1,
				price: 1.83,
				chain: "optimism",
			},
		],
		chains: {
			ethereum: 11140.25,
			polygon: 1250.5,
			arbitrum: 850.92,
			optimism: 2191.0,
		},
	};

	// Add some randomness to make it feel live
	return {
		...baseData,
		totalValue: baseData.totalValue * (0.99 + Math.random() * 0.02),
		change24h: baseData.change24h + (Math.random() - 0.5) * 2,
		assets: baseData.assets.map((asset) => ({
			...asset,
			price: asset.price * (0.99 + Math.random() * 0.02),
			change24h: asset.change24h + (Math.random() - 0.5) * 2,
		})),
	};
}

// Real data fetcher (placeholder for actual implementation)
async function fetchRealPortfolioData(
	address: string,
	chainId: number,
): Promise<PortfolioData> {
	// This would be replaced with actual API calls to:
	// 1. Alchemy/Moralis for token balances
	// 2. CoinGecko for prices
	// 3. DeFi Llama for protocol positions

	// For now, return enhanced mock data
	return getEnhancedMockData(address, chainId);
}
