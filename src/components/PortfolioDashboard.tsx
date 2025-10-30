/** @format */
"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
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
} from "lucide-react";

// Mock portfolio data - in real app, you'd fetch from DeFi protocols
const mockPortfolioData = {
	totalValue: 15432.67,
	change24h: 2.34,
	assets: [
		{
			symbol: "ETH",
			balance: 3.2,
			value: 8640.25,
			change24h: 1.8,
			price: 2700.08,
		},
		{
			symbol: "MATIC",
			balance: 1250.5,
			value: 1250.5,
			change24h: -0.5,
			price: 1.0,
		},
		{
			symbol: "USDC",
			balance: 2500,
			value: 2500.0,
			change24h: 0.0,
			price: 1.0,
		},
		{ symbol: "ARB", balance: 850, value: 850.92, change24h: 3.2, price: 1.0 },
		{ symbol: "OP", balance: 1200, value: 2191.0, change24h: 5.1, price: 1.83 },
	],
	chains: {
		ethereum: 8640.25,
		polygon: 1250.5,
		arbitrum: 850.92,
		optimism: 2191.0,
		base: 500.0,
	},
};

export function PortfolioDashboard() {
	const { address, isConnected } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	const [timeRange, setTimeRange] = useState("1D");

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

	const { totalValue, change24h, assets, chains } = mockPortfolioData;
	const isPositive = change24h >= 0;

	return (
		<div className="space-y-6">
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
							{assets[0].symbol}
						</span>
						<span
							className={`ml-2 text-sm ${
								assets[0].change24h >= 0 ? "text-green-400" : "text-red-400"
							}`}>
							{assets[0].change24h >= 0 ? "+" : ""}
							{assets[0].change24h}%
						</span>
					</div>
					<p className="text-gray-400 text-sm">
						${assets[0].value.toLocaleString()}
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
					<h3 className="text-lg font-semibold text-white mb-4">
						Asset Allocation
					</h3>
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
								{assets.map((asset, index) => (
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
													<div className="text-gray-400 text-xs">Token</div>
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
													maximumFractionDigits: 2,
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
					<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium">
						Add Funds
					</button>
					<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium">
						Swap Tokens
					</button>
					<button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium">
						Stake Assets
					</button>
					<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer font-medium">
						View Analytics
					</button>
				</div>
			</div>
		</div>
	);
}
