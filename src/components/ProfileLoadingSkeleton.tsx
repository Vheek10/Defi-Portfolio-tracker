/** @format */

// components/PortfolioLoadingSkeleton.tsx
export function PortfolioLoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
						<div className="h-4 bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
						<div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
					</div>
				))}
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
				<div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
				<div className="h-64 bg-gray-700 rounded animate-pulse"></div>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
				<div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className="h-12 bg-gray-700 rounded mb-2 animate-pulse"></div>
				))}
			</div>
		</div>
	);
}
