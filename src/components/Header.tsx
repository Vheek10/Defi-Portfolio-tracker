/** @format */

"use client";

import { CleanWalletConnect } from "./CleanWalletConnect";
import { NetworkSwitcher } from "./NetworkSwitcher";

export function Header() {
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

			{/* Right Section */}
			<div className="flex items-center gap-3">
				<NetworkSwitcher />
				<CleanWalletConnect />
			</div>
		</header>
	);
}
