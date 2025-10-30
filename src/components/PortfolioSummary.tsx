/** @format */

// components/PortfolioSummary.tsx
interface PortfolioSummaryProps {
	portfolio: Portfolio | null;
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
	const totalValue = portfolio?.totalValueUSD || 0;
	const change24h = 2.34; // This would come from your API

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Total Portfolio Value */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
				<h3 className="text-gray-400 text-sm font-medium mb-2">Total Value</h3>
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-bold text-white">
						$
						{totalValue.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</span>
					<span
						className={`flex items-center text-sm ${
							change24h >= 0 ? "text-green-400" : "text-red-400"
						}`}>
						{change24h >= 0 ? (
							<ArrowUpRight className="h-4 w-4" />
						) : (
							<ArrowDownRight className="h-4 w-4" />
						)}
						{Math.abs(change24h)}%
					</span>
				</div>
				<p className="text-gray-400 text-sm mt-2">24h change</p>
			</div>

			{/* Chains Count */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
				<h3 className="text-gray-400 text-sm font-medium mb-2">Chains</h3>
				<div className="text-3xl font-bold text-white">
					{portfolio ? Object.keys(portfolio.chains).length : 0}
				</div>
				<p className="text-gray-400 text-sm mt-2">Networks with assets</p>
			</div>

			{/* Assets Count */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
				<h3 className="text-gray-400 text-sm font-medium mb-2">Assets</h3>
				<div className="text-3xl font-bold text-white">
					{portfolio
						? Object.values(portfolio.chains).reduce(
								(acc, chain) => acc + chain.tokens.length,
								0,
						  )
						: 0}
				</div>
				<p className="text-gray-400 text-sm mt-2">Total tokens tracked</p>
			</div>
		</div>
	);
}
