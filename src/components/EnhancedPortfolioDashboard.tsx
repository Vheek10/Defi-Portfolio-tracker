/** @format */

"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useEnhancedPortfolioData } from "@/hooks/useEnhancedPortfolioData";
import { useAlertManager } from "@/hooks/useAlertManager";
import { AlertCenter } from "@/components/AlertCenter";
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics";
import { SwapInterface } from "@/components/SwapInterface";
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
	BarChart3,
	ArrowDownUp,
	Shield,
	Globe,
} from "lucide-react";
import { formatEther } from "viem";

export function EnhancedPortfolioDashboard({
	initialView = "overview",
}: {
	initialView?: "overview" | "analytics" | "defi" | "yield";
}) {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const { data: nativeBalance } = useBalance({ address });
	const {
		portfolioData,
		loading,
		error,
		refetch,
		realPortfolioValue,
		realBalances,
		defiOpportunities,
		chainBreakdown,
		uniswapPositions,
	} = useEnhancedPortfolioData();

	const alertManager = useAlertManager();
	const [lastUpdate, setLastUpdate] = useState<string>("");
	const [activeView, setActiveView] = useState<
		"overview" | "analytics" | "defi" | "yield"
	>(initialView);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedChain, setSelectedChain] = useState("all");
	const [showSwap, setShowSwap] = useState(false);

	useEffect(() => {
		if (portfolioData?.lastUpdated) {
			setLastUpdate(new Date(portfolioData.lastUpdated).toLocaleTimeString());
		}
	}, [portfolioData]);

	// Error alert effect
	useEffect(() => {
		if (error) {
			alertManager.addAlert({
				type: "security",
				title: "Data Loading Error",
				message: `Failed to load portfolio data: ${error.message}`,
				severity: "critical",
				triggered: false,
				active: true,
				data: { error: error.message },
			});
		}
	}, [error, alertManager]);

	// Check for alerts when data updates
	useEffect(() => {
		if (realBalances.length > 0 && realPortfolioValue > 0) {
			const currentPrices = realBalances.reduce((acc, token) => {
				if (token.balance > 0) {
					acc[token.contract_ticker_symbol] =
						token.quote / parseFloat(token.balance);
				}
				return acc;
			}, {} as { [key: string]: number });

			alertManager.checkPriceAlerts(currentPrices);
			alertManager.checkYieldAlerts(defiOpportunities);
		}
	}, [realBalances, realPortfolioValue, defiOpportunities, alertManager]);

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

	// Calculate real metrics from wallet data
	const calculateMetrics = () => {
		const totalValue = realPortfolioValue;
		const activeChains = Object.keys(chainBreakdown).length;
		const totalAssets = realBalances.length;

		// Calculate 24h performance from real data
		const twentyFourHourChange = realBalances.reduce((total, token) => {
			if (token.quote_24h) {
				return total + (token.quote - token.quote_24h);
			}
			return total;
		}, 0);

		const performancePercentage =
			totalValue > 0 ? (twentyFourHourChange / totalValue) * 100 : 0;

		return {
			totalValue,
			activeChains,
			totalAssets,
			performancePercentage,
			twentyFourHourChange,
		};
	};

	const metrics = calculateMetrics();

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
						Fetching real-time balances from your wallet
					</div>
				</div>
			</div>
		);
	}

	if (!isConnected || !address) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
				<Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-white mb-3">
					Wallet Not Connected
				</h3>
				<p className="text-gray-400 mb-6 max-w-md mx-auto">
					Connect your wallet to view your real portfolio data across all chains
				</p>
				<div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
				<div className="text-sm text-gray-500">
					Supports Ethereum, Polygon, Arbitrum, Optimism, and more
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-900/20 border border-red-700 rounded-2xl p-8 text-center">
				<AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-white mb-3">
					Data Loading Error
				</h3>
				<p className="text-gray-400 mb-6">{error.message}</p>
				<button
					onClick={refetch}
					className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105">
					Retry Loading Data
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Swap Interface Modal */}
			{showSwap && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="relative max-w-md w-full">
						<SwapInterface onClose={() => setShowSwap(false)} />
					</div>
				</div>
			)}

			{/* Header with View Toggle */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
						Portfolio Overview
					</h2>
					<p className="text-gray-400 mt-1">
						Real-time multi-chain assets & DeFi positions
						{lastUpdate && (
							<span className="text-blue-400 ml-2">• Updated {lastUpdate}</span>
						)}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					{/* View Toggle */}
					<div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">
						{[
							{ id: "overview", label: "Overview", icon: PieChart },
							{ id: "analytics", label: "Analytics", icon: BarChart3 },
							{ id: "defi", label: "DeFi", icon: Network },
							{ id: "yield", label: "Yield", icon: Zap },
						].map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() => setActiveView(id as any)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
									activeView === id
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
										: "text-gray-400 hover:text-white hover:bg-gray-700/50"
								}`}>
								<Icon className="h-4 w-4" />
								{label}
							</button>
						))}
					</div>

					{/* Quick Actions */}
					<div className="flex items-center gap-3">
						<AlertCenter />
						<button
							onClick={() => setShowSwap(true)}
							className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-green-500/25">
							<ArrowDownUp className="h-4 w-4" />
							<span>Quick Swap</span>
						</button>
						<button
							onClick={refetch}
							disabled={loading}
							className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 border border-gray-700">
							<RefreshCw
								className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
							/>
							Refresh
						</button>
					</div>
				</div>
			</div>

			{/* Overview View */}
			{activeView === "overview" && (
				<div className="space-y-6">
					{/* Portfolio Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									Total Portfolio Value
								</h3>
								<Wallet className="h-5 w-5 text-blue-400" />
							</div>
							<div className="mb-2">
								<span className="text-3xl font-bold text-white">
									$
									{metrics.totalValue.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</span>
							</div>
							<p className="text-gray-400 text-sm">
								Across all chains & protocols
							</p>
						</div>

						<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									Active Networks
								</h3>
								<Globe className="h-5 w-5 text-purple-400" />
							</div>
							<div className="mb-2">
								<span className="text-3xl font-bold text-white">
									{metrics.activeChains}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Blockchains with assets</p>
						</div>

						<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									Digital Assets
								</h3>
								<Coins className="h-5 w-5 text-yellow-400" />
							</div>
							<div className="mb-2">
								<span className="text-3xl font-bold text-white">
									{metrics.totalAssets}
								</span>
							</div>
							<p className="text-gray-400 text-sm">Tokens & positions</p>
						</div>

						<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-gray-400 text-sm font-medium">
									24h Performance
								</h3>
								<Activity className="h-5 w-5 text-green-400" />
							</div>
							<div className="flex items-baseline gap-2 mb-2">
								<span
									className={`text-3xl font-bold ${
										metrics.performancePercentage >= 0
											? "text-green-400"
											: "text-red-400"
									}`}>
									{metrics.performancePercentage >= 0 ? "+" : ""}
									{metrics.performancePercentage.toFixed(2)}%
								</span>
								{metrics.performancePercentage >= 0 ? (
									<ArrowUpRight className="h-5 w-5 text-green-400" />
								) : (
									<ArrowDownRight className="h-5 w-5 text-red-400" />
								)}
							</div>
							<p className="text-gray-400 text-sm">
								$
								{Math.abs(metrics.twentyFourHourChange).toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									},
								)}{" "}
								{metrics.twentyFourHourChange >= 0 ? "gained" : "lost"}
							</p>
						</div>
					</div>

					{/* Chain Distribution & Assets */}
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						{/* Chain Distribution */}
						<div className="xl:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
							<h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
								<Globe className="h-5 w-5 text-blue-400" />
								Network Allocation
							</h3>
							<div className="space-y-4">
								{Object.entries(chainBreakdown).map(([chain, value]) => {
									const percentage =
										metrics.totalValue > 0
											? ((value as number) / metrics.totalValue) * 100
											: 0;
									return (
										<div
											key={chain}
											className="space-y-3">
											<div className="flex justify-between text-sm">
												<span className="text-gray-300 capitalize font-medium">
													{chain.replace("-mainnet", "")}
												</span>
												<span className="text-white font-bold">
													{percentage.toFixed(1)}%
												</span>
											</div>
											<div className="w-full bg-gray-700 rounded-full h-2.5">
												<div
													className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
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
						<div className="xl:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
								<h3 className="text-lg font-semibold text-white flex items-center gap-2">
									<Shield className="h-5 w-5 text-green-400" />
									Your Digital Assets
								</h3>
								<div className="flex items-center gap-3">
									<button
										onClick={() => setShowSwap(true)}
										className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105">
										<ArrowDownUp className="h-4 w-4" />
										Swap Assets
									</button>
								</div>
							</div>

							{/* Search and Filter */}
							<div className="flex flex-col sm:flex-row gap-4 mb-6">
								<div className="flex-1 relative">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
									<input
										type="text"
										placeholder="Search tokens, protocols..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
									/>
								</div>
								<select
									value={selectedChain}
									onChange={(e) => setSelectedChain(e.target.value)}
									className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
									<option value="all">All Networks</option>
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
											<th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
												Asset
											</th>
											<th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
												Network
											</th>
											<th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
												Balance
											</th>
											<th className="text-left py-4 px-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
												24h Change
											</th>
											<th className="text-right py-4 px-4 text-gray-400 font-semibold text-sm uppercase tracking-wider">
												Value
											</th>
										</tr>
									</thead>
									<tbody>
										{filteredBalances
											.slice(0, 10)
											.map((token: any, index: number) => {
												const priceChange = token.quote_24h
													? ((token.quote - token.quote_24h) /
															token.quote_24h) *
													  100
													: 0;

												return (
													<tr
														key={index}
														className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300 group">
														<td className="py-4 px-4">
															<div className="flex items-center gap-3">
																{token.logo_url ? (
																	<img
																		src={token.logo_url}
																		alt={token.contract_ticker_symbol}
																		className="w-8 h-8 rounded-full"
																	/>
																) : (
																	<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
																		{token.contract_ticker_symbol?.charAt(0) ||
																			"?"}
																	</div>
																)}
																<div>
																	<div className="text-white font-semibold">
																		{token.contract_ticker_symbol}
																	</div>
																	<div className="text-gray-400 text-xs">
																		{token.contract_name}
																	</div>
																</div>
															</div>
														</td>
														<td className="py-4 px-4">
															<div className="flex items-center gap-2">
																<div
																	className={`w-2 h-2 rounded-full ${
																		token.chain.includes("eth")
																			? "bg-green-400"
																			: token.chain.includes("polygon")
																			? "bg-purple-400"
																			: token.chain.includes("arbitrum")
																			? "bg-blue-400"
																			: token.chain.includes("optimism")
																			? "bg-red-400"
																			: "bg-gray-400"
																	}`}
																/>
																<span className="text-gray-300 text-sm font-medium capitalize">
																	{token.chain.replace("-mainnet", "")}
																</span>
															</div>
														</td>
														<td className="py-4 px-4">
															<div className="text-white font-semibold">
																{parseFloat(
																	token.balance_formatted,
																).toLocaleString(undefined, {
																	maximumFractionDigits: 6,
																})}
															</div>
														</td>
														<td className="py-4 px-4">
															<div
																className={`flex items-center gap-1 text-sm font-medium ${
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
														<td className="py-4 px-4 text-right">
															<div className="text-white font-semibold">
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

							{filteredBalances.length === 0 && (
								<div className="text-center py-12 text-gray-400">
									{realBalances.length === 0
										? "No balances found across supported chains"
										: "No tokens match your search criteria"}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Analytics View */}
			{activeView === "analytics" && (
				<PortfolioAnalytics
					realBalances={realBalances}
					realPortfolioValue={realPortfolioValue}
				/>
			)}

			{/* DeFi Yield Opportunities View */}
			{activeView === "yield" && (
				<div className="space-y-6">
					<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold text-white flex items-center gap-3">
								<Zap className="h-6 w-6 text-yellow-400" />
								Yield Opportunities
							</h3>
							<div className="flex items-center gap-2 text-sm text-gray-400">
								<Filter className="h-4 w-4" />
								<span>Sorted by Highest APY</span>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{defiOpportunities
								.slice(0, 6)
								.map((opportunity: any, index: number) => (
									<div
										key={index}
										className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-300 group hover:scale-105">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-2">
												<div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
													{opportunity.symbol?.charAt(0) || "Y"}
												</div>
												<div>
													<div className="text-white font-semibold">
														{opportunity.symbol}
													</div>
													<div className="text-gray-400 text-xs">
														{opportunity.project}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-yellow-400 font-bold text-xl">
													{opportunity.apy?.toFixed(2)}%
												</div>
												<div className="text-gray-400 text-xs">APY</div>
											</div>
										</div>
										<div className="flex justify-between text-sm text-gray-400 mb-3">
											<span>Network: {opportunity.chain}</span>
											<span>
												TVL: ${(opportunity.tvl / 1000000).toFixed(1)}M
											</span>
										</div>
										<div className="flex gap-2">
											<button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
												Stake Now
											</button>
											<button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
												Details
											</button>
										</div>
									</div>
								))}
						</div>
						{defiOpportunities.length === 0 && (
							<div className="text-center py-12 text-gray-400">
								<Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
								<div>Loading yield opportunities...</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* DeFi Protocols View */}
			{activeView === "defi" && (
				<div className="space-y-6">
					<div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
						<h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
							<Network className="h-6 w-6 text-blue-400" />
							DeFi Protocol Positions
						</h3>
						{uniswapPositions.length > 0 ? (
							<div className="space-y-4">
								{uniswapPositions.map((position: any, index: number) => (
									<div
										key={position.id}
										className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
													LP
												</div>
												<div>
													<div className="text-white font-semibold">
														{position.pool.token0.symbol} /{" "}
														{position.pool.token1.symbol}
													</div>
													<div className="text-gray-400 text-sm">
														Uniswap V3 • Fee: {position.pool.feeTier / 10000}%
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-white font-bold text-xl">
													${position.valueUSD?.toFixed(2) || "0.00"}
												</div>
												<div className="text-gray-400 text-sm">
													Position Value
												</div>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4 text-sm mb-3">
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
										<div className="flex gap-2">
											<button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
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
							<div className="text-center py-12 text-gray-400">
								<Network className="h-12 w-12 text-gray-600 mx-auto mb-4" />
								<div>No active DeFi positions found</div>
								<div className="text-sm mt-2">
									Start by providing liquidity to earn fees
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
