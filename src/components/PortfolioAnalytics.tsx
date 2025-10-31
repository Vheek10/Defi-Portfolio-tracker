/** @format */

// components/PortfolioAnalytics.tsx
import { useState } from "react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	AreaChart,
	Area,
} from "recharts";
import {
	TrendingUp,
	TrendingDown,
	Activity,
	Shield,
	PieChart as PieChartIcon,
	Calendar,
	Download,
	BarChart3,
	AlertTriangle,
	Target,
} from "lucide-react";

interface PortfolioAnalyticsProps {
	realBalances: any[];
	realPortfolioValue: number;
}

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82ca9d",
];

export function PortfolioAnalytics({
	realBalances,
	realPortfolioValue,
}: PortfolioAnalyticsProps) {
	const [timeRange, setTimeRange] = useState<"7D" | "1M" | "3M" | "1Y" | "ALL">(
		"1M",
	);

	// Mock historical data for different time ranges
	const historicalData = [
		{ date: "2024-01", value: 12500, benchmark: 12000 },
		{ date: "2024-02", value: 14200, benchmark: 13500 },
		{ date: "2024-03", value: 13800, benchmark: 14000 },
		{ date: "2024-04", value: 15600, benchmark: 14500 },
		{ date: "2024-05", value: 17200, benchmark: 15500 },
		{ date: "2024-06", value: 18900, benchmark: 17000 },
	];

	// Mock performance metrics
	const performanceMetrics = {
		totalReturn: 23.5,
		dailyReturn: 1.2,
		weeklyReturn: 5.8,
		monthlyReturn: 12.3,
		volatility: 45.2,
		sharpeRatio: 1.8,
		maxDrawdown: -15.4,
		sortinoRatio: 2.1,
		alpha: 2.3,
		beta: 1.2,
	};

	// Mock asset allocation
	const assetAllocation = [
		{ name: "Ethereum", value: 45, category: "crypto" },
		{ name: "Bitcoin", value: 25, category: "crypto" },
		{ name: "Stablecoins", value: 15, category: "stablecoin" },
		{ name: "DeFi Tokens", value: 10, category: "defi" },
		{ name: "Polygon", value: 5, category: "crypto" },
	];

	// Mock risk metrics
	const riskMetrics = {
		var95: 850,
		portfolioBeta: 1.2,
		correlation: 0.85,
		expectedShortfall: 1250,
	};

	// Mock sector allocation
	const sectorAllocation = [
		{ sector: "Layer 1", allocation: 40, return: 15.2 },
		{ sector: "DeFi", allocation: 25, return: 8.7 },
		{ sector: "Stablecoins", allocation: 15, return: 0.5 },
		{ sector: "Layer 2", allocation: 12, return: 22.1 },
		{ sector: "NFT/Gaming", allocation: 8, return: -5.3 },
	];

	// Mock drawdown data
	const drawdownData = [
		{ period: "Jan", drawdown: -2.1 },
		{ period: "Feb", drawdown: -8.7 },
		{ period: "Mar", drawdown: -15.4 },
		{ period: "Apr", drawdown: -6.2 },
		{ period: "May", drawdown: -3.8 },
		{ period: "Jun", drawdown: -1.2 },
	];

	const exportData = () => {
		// In a real app, this would generate a CSV or PDF report
		console.log("Exporting portfolio analytics data...");
		alert(
			"Export feature would generate a detailed PDF report in a real application",
		);
	};

	return (
		<div className="space-y-6">
			{/* Header with Export */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
					<p className="text-gray-400">
						Advanced performance metrics and risk analysis
					</p>
				</div>
				<button
					onClick={exportData}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer">
					<Download className="h-4 w-4" />
					Export Report
				</button>
			</div>

			{/* Performance Overview Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-gray-400 text-sm font-medium">Total Return</h3>
						<TrendingUp className="h-4 w-4 text-green-400" />
					</div>
					<div className="text-2xl font-bold text-white">
						{performanceMetrics.totalReturn}%
					</div>
					<div className="text-green-400 text-sm">All Time</div>
				</div>

				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-gray-400 text-sm font-medium">Volatility</h3>
						<Activity className="h-4 w-4 text-yellow-400" />
					</div>
					<div className="text-2xl font-bold text-white">
						{performanceMetrics.volatility}%
					</div>
					<div className="text-yellow-400 text-sm">Annualized</div>
				</div>

				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-gray-400 text-sm font-medium">Sharpe Ratio</h3>
						<Shield className="h-4 w-4 text-blue-400" />
					</div>
					<div className="text-2xl font-bold text-white">
						{performanceMetrics.sharpeRatio}
					</div>
					<div className="text-blue-400 text-sm">Risk Adjusted</div>
				</div>

				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-gray-400 text-sm font-medium">Max Drawdown</h3>
						<TrendingDown className="h-4 w-4 text-red-400" />
					</div>
					<div className="text-2xl font-bold text-white">
						{performanceMetrics.maxDrawdown}%
					</div>
					<div className="text-red-400 text-sm">Worst Case</div>
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Performance Chart */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">
							Portfolio Performance
						</h3>
						<div className="flex gap-1 bg-gray-800 rounded-lg p-1">
							{["7D", "1M", "3M", "1Y", "ALL"].map((range) => (
								<button
									key={range}
									onClick={() => setTimeRange(range as any)}
									className={`px-3 py-1 text-sm rounded-md transition-all ${
										timeRange === range
											? "bg-blue-500 text-white"
											: "text-gray-400 hover:text-white"
									}`}>
									{range}
								</button>
							))}
						</div>
					</div>
					<div className="h-80">
						<ResponsiveContainer
							width="100%"
							height="100%">
							<LineChart data={historicalData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="date"
									stroke="#9CA3AF"
									fontSize={12}
								/>
								<YAxis
									stroke="#9CA3AF"
									fontSize={12}
									tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
								/>
								<Tooltip
									formatter={(value: number) => [
										`$${value.toLocaleString()}`,
										"Value",
									]}
									labelFormatter={(label) => `Date: ${label}`}
									contentStyle={{
										backgroundColor: "#1F2937",
										border: "1px solid #374151",
									}}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="value"
									stroke="#3B82F6"
									strokeWidth={2}
									dot={false}
									name="Your Portfolio"
								/>
								<Line
									type="monotone"
									dataKey="benchmark"
									stroke="#10B981"
									strokeWidth={2}
									strokeDasharray="3 3"
									dot={false}
									name="Market Benchmark"
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Asset Allocation */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">
							Asset Allocation
						</h3>
						<PieChartIcon className="h-5 w-5 text-gray-400" />
					</div>
					<div className="h-80">
						<ResponsiveContainer
							width="100%"
							height="100%">
							<PieChart>
								<Pie
									data={assetAllocation}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={2}
									dataKey="value">
									{assetAllocation.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value: number) => [`${value}%`, "Allocation"]}
									contentStyle={{
										backgroundColor: "#1F2937",
										border: "1px solid #374151",
									}}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Risk Metrics & Detailed Analytics */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Risk Metrics */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Risk Metrics
					</h3>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-400">Value at Risk (95%)</span>
								<span className="text-white font-medium">
									${riskMetrics.var95}
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-red-500"
									style={{ width: "15%" }}></div>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-400">Portfolio Beta</span>
								<span className="text-white font-medium">
									{riskMetrics.portfolioBeta}
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-yellow-500"
									style={{ width: "60%" }}></div>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-400">Market Correlation</span>
								<span className="text-white font-medium">
									{riskMetrics.correlation}
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-blue-500"
									style={{ width: "85%" }}></div>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-400">Expected Shortfall</span>
								<span className="text-white font-medium">
									${riskMetrics.expectedShortfall}
								</span>
							</div>
							<div className="w-full bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-purple-500"
									style={{ width: "20%" }}></div>
							</div>
						</div>
					</div>
				</div>

				{/* Returns Breakdown */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 lg:col-span-2">
					<h3 className="text-lg font-semibold text-white mb-4">
						Returns Breakdown
					</h3>
					<div className="h-64">
						<ResponsiveContainer
							width="100%"
							height="100%">
							<BarChart
								data={[
									{ period: "24H", return: performanceMetrics.dailyReturn },
									{ period: "7D", return: performanceMetrics.weeklyReturn },
									{ period: "1M", return: performanceMetrics.monthlyReturn },
									{ period: "3M", return: 8.7 },
									{ period: "1Y", return: performanceMetrics.totalReturn },
								]}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="period"
									stroke="#9CA3AF"
									fontSize={12}
								/>
								<YAxis
									stroke="#9CA3AF"
									fontSize={12}
									tickFormatter={(value) => `${value}%`}
								/>
								<Tooltip
									formatter={(value: number) => [`${value}%`, "Return"]}
									contentStyle={{
										backgroundColor: "#1F2937",
										border: "1px solid #374151",
									}}
								/>
								<Bar
									dataKey="return"
									fill="#10B981"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			{/* Additional Analytics Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Drawdown Analysis */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">
							Drawdown Analysis
						</h3>
						<AlertTriangle className="h-5 w-5 text-yellow-400" />
					</div>
					<div className="h-64">
						<ResponsiveContainer
							width="100%"
							height="100%">
							<AreaChart data={drawdownData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#374151"
								/>
								<XAxis
									dataKey="period"
									stroke="#9CA3AF"
									fontSize={12}
								/>
								<YAxis
									stroke="#9CA3AF"
									fontSize={12}
									tickFormatter={(value) => `${value}%`}
								/>
								<Tooltip
									formatter={(value: number) => [`${value}%`, "Drawdown"]}
									contentStyle={{
										backgroundColor: "#1F2937",
										border: "1px solid #374151",
									}}
								/>
								<Area
									type="monotone"
									dataKey="drawdown"
									stroke="#EF4444"
									fill="#EF4444"
									fillOpacity={0.3}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Sector Performance */}
				<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-white">
							Sector Performance
						</h3>
						<BarChart3 className="h-5 w-5 text-blue-400" />
					</div>
					<div className="space-y-4">
						{sectorAllocation.map((sector, index) => (
							<div
								key={sector.sector}
								className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-300">{sector.sector}</span>
									<span
										className={`font-medium ${
											sector.return >= 0 ? "text-green-400" : "text-red-400"
										}`}>
										{sector.return}%
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-full bg-gray-700 rounded-full h-2">
										<div
											className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
											style={{ width: `${sector.allocation}%` }}></div>
									</div>
									<span className="text-gray-400 text-sm min-w-8">
										{sector.allocation}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Advanced Metrics */}
			<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-6">
					Advanced Performance Metrics
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-green-400">
							{performanceMetrics.sortinoRatio}
						</div>
						<div className="text-gray-400 text-sm mt-1">Sortino Ratio</div>
						<div className="text-gray-500 text-xs">Downside risk adjusted</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-400">
							{performanceMetrics.alpha}%
						</div>
						<div className="text-gray-400 text-sm mt-1">Alpha</div>
						<div className="text-gray-500 text-xs">Excess return</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-yellow-400">
							{performanceMetrics.beta}
						</div>
						<div className="text-gray-400 text-sm mt-1">Beta</div>
						<div className="text-gray-500 text-xs">Market sensitivity</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-400">2.4</div>
						<div className="text-gray-400 text-sm mt-1">Information Ratio</div>
						<div className="text-gray-500 text-xs">Active return</div>
					</div>
				</div>
			</div>

			{/* Performance Insights */}
			<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
				<h3 className="text-lg font-semibold text-white mb-4">
					Performance Insights
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="h-4 w-4 text-green-400" />
							<span className="text-green-400 font-medium">Strengths</span>
						</div>
						<ul className="text-green-300 text-sm space-y-1">
							<li>• Outperforming market benchmark by 11.2%</li>
							<li>• Excellent risk-adjusted returns (Sharpe: 1.8)</li>
							<li>• Strong diversification across sectors</li>
						</ul>
					</div>
					<div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<Target className="h-4 w-4 text-yellow-400" />
							<span className="text-yellow-400 font-medium">Opportunities</span>
						</div>
						<ul className="text-yellow-300 text-sm space-y-1">
							<li>• Consider increasing Layer 2 allocation</li>
							<li>• Rebalance stablecoin position (currently 15%)</li>
							<li>• Explore yield farming opportunities</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
