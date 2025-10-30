/** @format */

// components/AssetTable.tsx
import { SUPPORTED_CHAINS } from "../config/chains";

interface AssetTableProps {
	portfolio: Portfolio | null;
}

export function AssetTable({ portfolio }: AssetTableProps) {
	const allTokens = portfolio
		? Object.values(portfolio.chains).flatMap((chainData) =>
				chainData.tokens.map((token) => ({
					...token,
					chainName: chainData.chain.name,
				})),
		  )
		: [];

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-4">All Assets</h3>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-700">
							<th className="text-left py-3 text-gray-400 font-medium">
								Asset
							</th>
							<th className="text-left py-3 text-gray-400 font-medium">
								Chain
							</th>
							<th className="text-right py-3 text-gray-400 font-medium">
								Balance
							</th>
							<th className="text-right py-3 text-gray-400 font-medium">
								Value
							</th>
						</tr>
					</thead>
					<tbody>
						{allTokens.map((token, index) => (
							<tr
								key={index}
								className="border-b border-gray-700/50 hover:bg-gray-700/20">
								<td className="py-3">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
											<span className="text-xs font-medium text-white">
												{token.symbol.slice(0, 3)}
											</span>
										</div>
										<div>
											<div className="text-white font-medium">
												{token.symbol}
											</div>
											<div className="text-gray-400 text-sm">{token.name}</div>
										</div>
									</div>
								</td>
								<td className="py-3">
									<span className="px-2 py-1 bg-gray-700 rounded-lg text-sm text-gray-300">
										{token.chainName}
									</span>
								</td>
								<td className="py-3 text-right">
									<div className="text-white font-medium">
										{parseFloat(token.balance).toFixed(4)}
									</div>
									<div className="text-gray-400 text-sm">{token.symbol}</div>
								</td>
								<td className="py-3 text-right">
									<div className="text-white font-medium">
										${token.valueUSD?.toFixed(2) || "0.00"}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{allTokens.length === 0 && (
					<div className="text-center py-8 text-gray-400">
						No assets found across supported chains
					</div>
				)}
			</div>
		</div>
	);
}
