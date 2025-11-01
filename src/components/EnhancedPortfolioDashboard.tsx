/** @format */

// components/EnhancedPortfolioDashboard.tsx
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
import {
	useCurrency,
	usePrivacy,
	usePreferences,
} from "@/contexts/SettingsContext";

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

export function EnhancedPortfolioDashboard({
	onNavigateToSwap,
	onNavigateToAnalytics,
}: {
	onNavigateToSwap: () => void;
	onNavigateToAnalytics: () => void;
}) {
	const { address, isConnected } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	const chainId = useChainId();

	const currency = useCurrency();
	const { hideBalances } = usePrivacy();
	const { refreshRate, showTestnets } = usePreferences();

	const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("1D");
	const [refreshing, setRefreshing] = useState(false);

	// Format currency based on settings
	const formatCurrency = (amount: number) => {
		if (hideBalances) return "••••";

		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

		return formatter.format(amount);
	};

	// Format crypto amounts
	const formatCrypto = (amount: number, symbol: string) => {
		if (hideBalances) return `•••• ${symbol}`;

		const formatter = new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 4,
			maximumFractionDigits: 8,
		});

		return `${formatter.format(amount)} ${symbol}`;
	};

	// Fetch portfolio data
	useEffect(() => {
		if (!isConnected || !address) return;

		const fetchPortfolioData = async () => {
			setLoading(true);
			try {
				const data = await fetchRealPortfolioData(
					address,
					chainId,
					showTestnets,
				);
				setPortfolioData(data);
			} catch (error) {
				console.error("Error fetching portfolio data:", error);
				setPortfolioData(getEnhancedMockData(address, chainId, showTestnets));
			} finally {
				setLoading(false);
			}
		};

		fetchPortfolioData();

		// Set up auto-refresh based on settings
		const interval = setInterval(fetchPortfolioData, refreshRate * 1000);
		return () => clearInterval(interval);
	}, [isConnected, address, chainId, refreshRate, showTestnets]);

	const refreshPortfolio = async () => {
		if (!isConnected || !address) return;

		setRefreshing(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const data = await fetchRealPortfolioData(address, chainId, showTestnets);
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
				<button
					onClick={onNavigateToSwap}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
					Add Funds
				</button>
			</div>
		);
	}

	const { totalValue, change24h, assets, chains } = portfolioData;
	const isPositive = change24h >= 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-white">Portfolio Overview</h1>
					<p className="text-gray-400">
						Your assets across all connected chains • Auto-refresh:{" "}
						{refreshRate}s{hideBalances && " • Balances hidden"}
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">
							Portfolio Value
						</h3>
						<Wallet className="h-5 w-5 text-blue-400" />
					</div>
					<div className="flex items-baseline gap-2 mb-2">
						<span className="text-2xl font-bold text-white">
							{formatCurrency(totalValue)}
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
								? formatCrypto(
										parseFloat(formatEther(nativeBalance.value)),
										nativeBalance.symbol,
								  )
								: "0.0000 ETH"}
						</span>
					</div>
					<p className="text-gray-400 text-sm">Current chain</p>
				</div>

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
						{assets[0] ? formatCurrency(assets[0].value) : "$0"}
					</p>
				</div>

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

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
										<span>{formatCurrency(value)}</span>
										<span>{percentage.toFixed(1)}%</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

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
												{formatCrypto(asset.balance, asset.symbol)}
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white">
												{formatCurrency(asset.price)}
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white font-medium">
												{formatCurrency(asset.value)}
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

					<div className="mt-6 pt-6 border-t border-gray-700">
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Total Portfolio Value</span>
							<div className="text-right">
								<div className="text-white font-bold text-lg">
									{formatCurrency(totalValue)}
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

			<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
				<h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<button
						onClick={onNavigateToSwap}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<Wallet className="h-4 w-4" />
						Add Funds
					</button>
					<button
						onClick={onNavigateToSwap}
						className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<RefreshCw className="h-4 w-4" />
						Swap Tokens
					</button>
					<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<TrendingUp className="h-4 w-4" />
						Stake Assets
					</button>
					<button
						onClick={onNavigateToAnalytics}
						className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium flex items-center justify-center gap-2">
						<ExternalLink className="h-4 w-4" />
						View Analytics
					</button>
				</div>
			</div>
		</div>
	);
}

// Enhanced mock data generator
function getEnhancedMockData(
	address: string,
	chainId: number,
	showTestnets: boolean,
): PortfolioData {
	const baseAssets = [
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
	];

	// Add testnet assets if enabled
	if (showTestnets) {
		baseAssets.push(
			{
				symbol: "TEST",
				balance: 1000,
				value: 0,
				change24h: 0,
				price: 0,
				chain: "goerli",
			},
			{
				symbol: "TETH",
				balance: 2.5,
				value: 0,
				change24h: 0,
				price: 0,
				chain: "sepolia",
			},
		);
	}

	const baseData = {
		totalValue: 15432.67,
		change24h: 2.34,
		assets: baseAssets,
		chains: {
			ethereum: 11140.25,
			polygon: 1250.5,
			arbitrum: 850.92,
			optimism: 2191.0,
			...(showTestnets && { goerli: 0, sepolia: 0 }),
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
			value: asset.balance * (asset.price * (0.99 + Math.random() * 0.02)),
		})),
	};
}

// Real data fetcher
async function fetchRealPortfolioData(
	address: string,
	chainId: number,
	showTestnets: boolean,
): Promise<PortfolioData> {
	// This would be replaced with actual API calls
	return getEnhancedMockData(address, chainId, showTestnets);
}
