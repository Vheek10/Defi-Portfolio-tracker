/** @format */

// components/DashboardSidebar.tsx
"use client";

import {
	Wallet,
	BarChart3,
	PieChart,
	Zap,
	Settings,
	Users,
	Fuel, // Using Fuel instead of GasPump
} from "lucide-react";

interface DashboardSidebarProps {
	activeView: string;
	onViewChange: (view: string) => void;
}

export function DashboardSidebar({
	activeView,
	onViewChange,
}: DashboardSidebarProps) {
	const menuItems = [
		{
			id: "portfolio",
			label: "Portfolio",
			icon: PieChart,
			description: "Asset overview",
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: BarChart3,
			description: "Performance metrics",
		},
		{
			id: "swap",
			label: "Swap",
			icon: Zap,
			description: "Token exchange",
		},
		{
			id: "wallet",
			label: "Wallet",
			icon: Wallet,
			description: "Manage assets",
		},
		{
			id: "settings",
			label: "Settings",
			icon: Settings,
			description: "Preferences",
		},
	];

	return (
		<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm h-fit">
			{/* Logo/Brand */}
			<div className="flex items-center gap-3 mb-8">
				<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
					<Wallet className="h-6 w-6 text-white" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-white">DeFi Tracker</h1>
					<p className="text-gray-400 text-sm">Portfolio Manager</p>
				</div>
			</div>

			{/* Navigation Menu */}
			<nav className="space-y-2">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeView === item.id;

					return (
						<button
							key={item.id}
							onClick={() => onViewChange(item.id)}
							className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 cursor-pointer group ${
								isActive
									? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg"
									: "text-gray-400 hover:text-white hover:bg-gray-800/50"
							}`}>
							<div
								className={`p-2 rounded-lg transition-all duration-300 ${
									isActive
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
										: "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
								}`}>
								<Icon className="h-4 w-4" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="font-medium text-sm truncate">{item.label}</div>
								<div
									className={`text-xs truncate ${
										isActive ? "text-blue-300" : "text-gray-500"
									}`}>
									{item.description}
								</div>
							</div>
							{isActive && (
								<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
							)}
						</button>
					);
				})}
			</nav>

			{/* Quick Access */}
			<div className="mt-8 pt-6 border-t border-gray-700">
				<h3 className="text-gray-400 text-sm font-medium mb-3">Quick Access</h3>
				<div className="space-y-2">
					<button
						onClick={() => onViewChange("wallet")}
						className="w-full flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer text-sm">
						<Fuel className="h-4 w-4" />
						Gas Optimizer
					</button>
					<button
						onClick={() => onViewChange("wallet")}
						className="w-full flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer text-sm">
						<Users className="h-4 w-4" />
						Multi-Wallet
					</button>
				</div>
			</div>

			{/* Connection Status */}
			<div className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
				<div className="flex items-center gap-2 mb-1">
					<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
					<span className="text-green-400 text-sm font-medium">Connected</span>
				</div>
				<p className="text-gray-400 text-xs">Wallet is securely connected</p>
			</div>
		</div>
	);
}
