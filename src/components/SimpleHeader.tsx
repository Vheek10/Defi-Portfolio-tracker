/** @format */

"use client";

export function SimpleHeader() {
	return (
		<header className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
			{/* Left Section */}
			<div>
				<h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
					DeFi Dashboard
				</h1>
				<p className="text-sm text-gray-400 mt-1">
					Track your multi-chain portfolio
				</p>
			</div>

			{/* Right Section - Simple Connect Button */}
			<button
				onClick={() => {
					// This will be replaced with actual Web3 connection later
					console.log("Connect wallet clicked");
				}}
				className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-semibold">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
				Connect Wallet
			</button>
		</header>
	);
}
