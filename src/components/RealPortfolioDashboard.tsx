/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRealPortfolioData } from "@/hooks/useRealPortfolioData";
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
} from "lucide-react";

export function RealPortfolioDashboard() {
	const { portfolioData, loading, prices, refetch, isConnected, address } =
		useRealPortfolioData();
	const [timeRange, setTimeRange] = useState("1D");
	const [lastUpdate, setLastUpdate] = useState<string>("");

	useEffect(() => {
		if (portfolioData?.lastUpdated) {
			setLastUpdate(new Date(portfolioData.lastUpdated).toLocaleTimeString());
		}
	}, [portfolioData]);

	// Show loading state
	if (loading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm animate-pulse">
							<div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
							<div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
							<div className="h-3 bg-gray-700 rounded w-1/3"></div>
						</div>
					))}
				</div>
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 text-center">
					<RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
					<div className="text-white font-medium">
						Loading portfolio data...
					</div>
					<div className="text-gray-400 text-sm mt-2">
						Fetching real-time prices and balances
					</div>
				</div>
			</div>
		);
	}

	// Show connect wallet prompt
	if (!isConnected || !address) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Connect Your Wallet
				</h3>
				<p className="text-gray-400 mb-6">
					Connect your wallet to view your real-time DeFi portfolio across all
					chains
				</p>
				<div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
			</div>
		);
	}

	// Show portfolio data
	const { totalValue, change24h, assets, chains } = portfolioData || {
		totalValue: 0,
		change24h: 0,
		assets: [],
		chains: {},
	};

	const isPositive = change24h >= 0;

	return (
		<div className="space-y-6">
			{/* Header with Refresh */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Live Portfolio</h2>
					<p className="text-gray-400">
						Real-time prices and balances{" "}
						{lastUpdate && `• Updated ${lastUpdate}`}
					</p>
				</div>
				<button
					onClick={refetch}
					disabled={loading}
					className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50">
					<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
					Refresh
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
								{change24h.toFixed(2)}%
							</span>
						</div>
					</div>
					<p className="text-gray-400 text-sm">24h change</p>
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

				{/* Total Assets */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">Total Assets</h3>
						<Coins className="h-5 w-5 text-yellow-400" />
					</div>
					<div className="mb-2">
						<span className="text-2xl font-bold text-white">
							{assets.length}
						</span>
					</div>
					<p className="text-gray-400 text-sm">Different tokens</p>
				</div>

				{/* Live Prices */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-gray-400 text-sm font-medium">Market Status</h3>
						<Activity className="h-5 w-5 text-green-400" />
					</div>
					<div className="mb-2">
						<span className="text-2xl font-bold text-white">Live</span>
					</div>
					<p className="text-gray-400 text-sm">Real-time data</p>
				</div>
			</div>

			{/* Asset Allocation & Assets Table */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Asset Allocation Chart */}
				<div className="lg:col-span-1 bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
					<h3 className="text-lg font-semibold text-white mb-4">
						Asset Allocation
					</h3>
					<div className="space-y-4">
						{Object.entries(chains).map(([chain, value]) => {
							const percentage =
								totalValue > 0 ? ((value as number) / totalValue) * 100 : 0;
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
											{(value as number).toLocaleString(undefined, {
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
								{assets.map((asset: any, index: number) => (
									<tr
										key={asset.symbol}
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
													<div className="text-gray-400 text-xs">
														{asset.name}
													</div>
												</div>
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white font-medium">
												{asset.balance.toLocaleString()}
											</div>
										</td>
										<td className="py-3 px-4">
											<div className="text-white">
												$
												{asset.price.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 4,
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
												{asset.change24h.toFixed(2)}%
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
									{change24h.toFixed(2)}% (24h)
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
