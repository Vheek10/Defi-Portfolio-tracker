/** @format */

"use client";

import { useState, useEffect } from "react";
import { useEnhancedPortfolioData } from "@/hooks/useEnhancedPortfolioData";
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
	Network,
	Zap,
	AlertCircle,
	Search,
	Filter,
} from "lucide-react";

export function EnhancedPortfolioDashboard() {
	const {
		portfolioData,
		loading,
		error,
		refetch,
		isConnected,
		address,
		realPortfolioValue,
		realBalances,
		defiOpportunities,
		chainBreakdown,
		uniswapPositions,
	} = useEnhancedPortfolioData();

	const [lastUpdate, setLastUpdate] = useState<string>("");
	const [activeView, setActiveView] = useState<"overview" | "defi" | "yield">(
		"overview",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedChain, setSelectedChain] = useState("all");

	useEffect(() => {
		if (portfolioData?.lastUpdated) {
			setLastUpdate(new Date(portfolioData.lastUpdated).toLocaleTimeString());
		}
	}, [portfolioData]);

	// Filter assets based on search and chain filter
	const filteredBalances = realBalances.filter((token: any) => {
		const matchesSearch =
			token.contract_ticker_symbol
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			token.contract_name?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesChain =
			selectedChain === "all" ||
			token.chain.replace("-mainnet", "") === selectedChain;

		return matchesSearch && matchesChain;
	});

	if (error) {
		return (
			<div className="bg-red-900/20 border border-red-700 rounded-2xl p-8 text-center">
				<AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Error Loading Data
				</h3>
				<p className="text-gray-400 mb-4">{error.message}</p>
				<button
					onClick={refetch}
					className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300">
					Retry Loading Data
				</button>
			</div>
		);
	}

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
						Loading enhanced portfolio data...
					</div>
					<div className="text-gray-400 text-sm mt-2">
						Fetching multi-chain balances & DeFi opportunities
					</div>
				</div>
			</div>
		);
	}

	if (!isConnected || !address) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-white mb-2">
					Connect Your Wallet
				</h3>
				<p className="text-gray-400 mb-6">
					Connect your wallet to view your enhanced DeFi portfolio with real
					multi-chain data
				</p>
				<div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with View Toggle */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Enhanced Portfolio</h2>
					<p className="text-gray-400">
						Multi-chain balances & DeFi opportunities{" "}
						{lastUpdate && `• Updated ${lastUpdate}`}
					</p>
				</div>

				<div className="flex items-center gap-4">
					{/* View Toggle */}
					<div className="flex bg-gray-800 rounded-lg p-1">
						{[
							{ id: "overview", label: "Overview", icon: PieChart },
							{ id: "defi", label: "DeFi", icon: Network },
							{ id: "yield", label: "Yield", icon: Zap },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() => setActiveView(id as any)}
								className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
									activeView === id
										? "bg-blue-500 text-white shadow-lg"
										: "text-gray-400 hover:text-white"
								}`}>
								<Icon className="h-4 w-4" />
								{label}
							</button>
						))}
					</div>

					<button
						onClick={refetch}
						disabled={loading}
						className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50">
						<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
						Refresh
					</button>
				</div>
			</div>

			{/* Overview View */}
			{activeView === "overview" && (
				<div className="space-y-6">
					{/* Portfolio Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									Total Value
								</h3>
								<Wallet className="h-5 w-5 text-blue-400" />
							</div>
							<div className="mb-2">
								<span className="text-2xl font-bold text-white">
									$
									{realPortfolioValue.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Across all chains</p>
						</div>

						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									Active Chains
								</h3>
								<Network className="h-5 w-5 text-purple-400" />
							</div>
							<div className="mb-2">
								<span className="text-2xl font-bold text-white">
									{Object.keys(chainBreakdown).length}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Networks with assets</p>
						</div>

						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">Assets</h3>
								<Coins className="h-5 w-5 text-yellow-400" />
							</div>
							<div className="mb-2">
								<span className="text-2xl font-bold text-white">
									{realBalances.length}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Different tokens</p>
						</div>

						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									24h Performance
								</h3>
								<Activity className="h-5 w-5 text-green-400" />
							</div>
							<div className="flex items-baseline gap-2 mb-2">
								<span className="text-2xl font-bold text-green-400">+2.3%</span>
								<ArrowUpRight className="h-4 w-4 text-green-400" />
							</div>
							<p className="text-gray-400 text-sm">$342.50 gained</p>
						</div>

						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									DeFi Yield
								</h3>
								<Zap className="h-5 w-5 text-green-400" />
							</div>
							<div className="mb-2">
								<span className="text-2xl font-bold text-white">
									{defiOpportunities.length}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Opportunities</p>
						</div>
					</div>

					{/* Chain Distribution & Assets */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Chain Distribution */}
						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<h3 className="text-lg font-semibold text-white mb-4">
								Chain Distribution
							</h3>
							<div className="space-y-4">
								{Object.entries(chainBreakdown).map(([chain, value]) => {
									const percentage =
										realPortfolioValue > 0
											? ((value as number) / realPortfolioValue) * 100
											: 0;
									return (
										<div
											key={chain}
											className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-gray-300 capitalize">
													{chain.replace("-mainnet", "")}
												</span>
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

						{/* Real Balances Table */}
						<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-white">
									Your Assets
								</h3>
								<div className="flex items-center gap-3">
									{/* Quick Actions */}
									<button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-sm">
										<Zap className="h-3 w-3" />
										Quick Stake
									</button>
									<button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-sm">
										<Activity className="h-3 w-3" />
										Swap
									</button>
								</div>
							</div>

							{/* Search and Filter */}
							<div className="flex gap-4 mb-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search tokens..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
									/>
								</div>
								<select
									value={selectedChain}
									onChange={(e) => setSelectedChain(e.target.value)}
									className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
									<option value="all">All Chains</option>
									<option value="eth">Ethereum</option>
									<option value="polygon">Polygon</option>
									<option value="arbitrum">Arbitrum</option>
									<option value="optimism">Optimism</option>
									<option value="base">Base</option>
								</select>
							</div>

							<div className="overflow-x-auto no-scrollbar">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-700">
											<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
												Asset
											</th>
											<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
												Chain
											</th>
											<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
												Balance
											</th>
											<th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
												24h Change
											</th>
											<th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
												Value
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredBalances
											.slice(0, 8)
											.map((token: any, index: number) => {
												const priceChange = token.quote_24h
													? ((token.quote - token.quote_24h) /
															token.quote_24h) *
													  100
													: 0;

												return (
													<tr
														key={index}
														className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
														<td className="py-3 px-4">
															<div className="flex items-center gap-3">
																{token.logo_url ? (
																	<img
																		src={token.logo_url}
																		alt={token.contract_ticker_symbol}
																		className="w-6 h-6 rounded-full"
																	/>
																) : (
																	<div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
																		{token.contract_ticker_symbol?.charAt(0) ||
																			"?"}
																	</div>
																)}
																<div>
																	<div className="text-white font-medium">
																		{token.contract_ticker_symbol}
																	</div>
																	<div className="text-gray-400 text-xs">
																		{token.contract_name}
																	</div>
																</div>
															</div>
														</td>
														<td className="py-3 px-4">
															<div className="text-gray-300 text-sm capitalize">
																{token.chain.replace("-mainnet", "")}
															</div>
														</td>
														<td className="py-3 px-4">
															<div className="text-white font-medium">
																{parseFloat(
																	token.balance_formatted,
																).toLocaleString()}
															</div>
														</td>
														<td className="py-3 px-4">
															<div
																className={`flex items-center gap-1 text-sm ${
																	priceChange >= 0
																		? "text-green-400"
																		: "text-red-400"
																}`}>
																{priceChange >= 0 ? (
																	<ArrowUpRight className="h-3 w-3" />
																) : (
																	<ArrowDownRight className="h-3 w-3" />
																)}
																{Math.abs(priceChange).toFixed(2)}%
															</div>
														</td>
														<td className="py-3 px-4 text-right">
															<div className="text-white font-medium">
																$
																{token.quote?.toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																}) || "0.00"}
															</div>
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							{filteredBalances.length > 8 && (
								<div className="flex justify-center mt-4">
									<div className="flex gap-2">
										<button className="px-3 py-1 bg-gray-800 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors">
											Previous
										</button>
										<button className="px-3 py-1 bg-blue-500 rounded-lg text-white cursor-pointer">
											1
										</button>
										<button className="px-3 py-1 bg-gray-800 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors">
											2
										</button>
										<button className="px-3 py-1 bg-gray-800 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors">
											Next
										</button>
									</div>
								</div>
							)}

							{filteredBalances.length === 0 && (
								<div className="text-center py-8 text-gray-400">
									{realBalances.length === 0
										? "No balances found across supported chains"
										: "No tokens match your search criteria"}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* DeFi Yield Opportunities View */}
			{activeView === "yield" && (
				<div className="space-y-6">
					<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-white">
								DeFi Yield Opportunities
							</h3>
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<Filter className="h-4 w-4" />
								<span>Sorted by Highest APY</span>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{defiOpportunities
								.slice(0, 9)
								.map((opportunity: any, index: number) => (
									<div
										key={index}
										className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-300 group">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
													{opportunity.symbol?.charAt(0) || "Y"}
												</div>
												<div>
													<div className="text-white font-medium">
														{opportunity.symbol}
													</div>
													<div className="text-gray-400 text-xs">
														{opportunity.project}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-green-400 font-bold text-lg">
													{opportunity.apy?.toFixed(2)}%
												</div>
												<div className="text-gray-400 text-xs">APY</div>
											</div>
										</div>
										<div className="flex justify-between text-sm text-gray-400 mb-3">
											<span>Chain: {opportunity.chain}</span>
											<span>
												TVL: ${(opportunity.tvl / 1000000).toFixed(1)}M
											</span>
										</div>
										<div className="flex gap-2">
											<button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer group-hover:scale-105">
												Explore
											</button>
											<button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
												Details
											</button>
										</div>
									</div>
								))}
						</div>
						{defiOpportunities.length === 0 && (
							<div className="text-center py-8 text-gray-400">
								Loading yield opportunities...
							</div>
						)}
					</div>
				</div>
			)}

			{/* DeFi Protocols View */}
			{activeView === "defi" && (
				<div className="space-y-6">
					<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
						<h3 className="text-lg font-semibold text-white mb-4">
							DeFi Protocol Positions
						</h3>
						{uniswapPositions.length > 0 ? (
							<div className="space-y-4">
								{uniswapPositions.map((position: any, index: number) => (
									<div
										key={position.id}
										className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all duration-300">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
													LP
												</div>
												<div>
													<div className="text-white font-medium">
														{position.pool.token0.symbol} /{" "}
														{position.pool.token1.symbol}
													</div>
													<div className="text-gray-400 text-sm">
														Uniswap V3 • Fee: {position.pool.feeTier / 10000}%
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-white font-bold text-lg">
													${position.valueUSD?.toFixed(2) || "0.00"}
												</div>
												<div className="text-gray-400 text-sm">
													Position Value
												</div>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<div className="text-gray-400">Token 0 Deposited</div>
												<div className="text-white font-medium">
													{parseFloat(position.depositedToken0).toFixed(4)}{" "}
													{position.pool.token0.symbol}
												</div>
											</div>
											<div>
												<div className="text-gray-400">Token 1 Deposited</div>
												<div className="text-white font-medium">
													{parseFloat(position.depositedToken1).toFixed(4)}{" "}
													{position.pool.token1.symbol}
												</div>
											</div>
										</div>
										<div className="flex gap-2 mt-3">
											<button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
												Add Liquidity
											</button>
											<button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
												View on Explorer
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-400">
								No active DeFi positions found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
