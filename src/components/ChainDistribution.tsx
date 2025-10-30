/** @format */

// components/ChainDistribution.tsx
import { SUPPORTED_CHAINS } from "../config/chains";

interface ChainDistributionProps {
	portfolio: Portfolio | null;
}

export function ChainDistribution({ portfolio }: ChainDistributionProps) {
	const chainData = portfolio
		? Object.values(portfolio.chains).map((chainData) => ({
				name: chainData.chain.name,
				value: chainData.chainValueUSD,
				color: getChainColor(chainData.chain.id),
		  }))
		: [];

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4">
				Chain Distribution
			</h3>
			<div className="h-64">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<PieChart>
						<Pie
							data={chainData}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={80}
							paddingAngle={5}
							dataKey="value">
							{chainData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color || COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip
							formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
				{chainData.map((chain, index) => (
					<div
						key={chain.name}
						className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{
								backgroundColor: chain.color || COLORS[index % COLORS.length],
							}}
						/>
						<span className="text-sm text-gray-300">{chain.name}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function getChainColor(chainId: number): string {
	const colors: { [key: number]: string } = {
		1: "#627EEA", // Ethereum blue
		137: "#8247E5", // Polygon purple
		42161: "#28A0F0", // Arbitrum blue
		10: "#FF0420", // Optimism red
		8453: "#0052FF", // Base blue
	};
	return colors[chainId] || "#6B7280";
}
