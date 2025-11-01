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
	Fuel,
	Shield,
	TrendingUp,
	History,
} from "lucide-react";
import { useAccount } from "wagmi";

interface DashboardSidebarProps {
	activeView: string;
	onViewChange: (view: string) => void;
	onOpenSettings?: () => void;
}

export function DashboardSidebar({
	activeView,
	onViewChange,
	onOpenSettings,
}: DashboardSidebarProps) {
	const { isConnected, address } = useAccount();

	const menuItems = [
		{
			id: "portfolio",
			label: "Portfolio",
			icon: PieChart,
			description: "Asset overview",
			requiresConnection: false,
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: BarChart3,
			description: "Performance metrics",
			requiresConnection: true,
		},
		{
			id: "swap",
			label: "Swap",
			icon: Zap,
			description: "Token exchange",
			requiresConnection: true,
		},
		{
			id: "wallet",
			label: "Wallet",
			icon: Wallet,
			description: "Manage assets",
			requiresConnection: true,
		},
		{
			id: "transactions",
			label: "Transactions",
			icon: History,
			description: "Transaction history",
			requiresConnection: true,
		},
	];

	const quickAccessItems = [
		{
			id: "gas",
			label: "Gas Optimizer",
			icon: Fuel,
			view: "wallet",
			tab: "gas",
		},
		{
			id: "multiwallet",
			label: "Multi-Wallet",
			icon: Users,
			view: "wallet",
			tab: "multiwallet",
		},
		{
			id: "security",
			label: "Security",
			icon: Shield,
			view: "wallet",
			tab: "overview",
		},
	];

	const handleQuickAccessClick = (item: (typeof quickAccessItems)[0]) => {
		onViewChange(item.view);
		// You might want to pass the tab information to the parent component
		// This could be done via a callback or context
	};

	const handleSettingsClick = () => {
		if (onOpenSettings) {
			onOpenSettings();
		} else {
			onViewChange("settings");
		}
	};

	return (
		<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm h-fit sticky top-6">
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
					const isDisabled = item.requiresConnection && !isConnected;

					return (
						<button
							key={item.id}
							onClick={() => !isDisabled && onViewChange(item.id)}
							disabled={isDisabled}
							className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 cursor-pointer group ${
								isActive
									? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg"
									: isDisabled
									? "text-gray-600 cursor-not-allowed opacity-50"
									: "text-gray-400 hover:text-white hover:bg-gray-800/50"
							}`}>
							<div
								className={`p-2 rounded-lg transition-all duration-300 ${
									isActive
										? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
										: isDisabled
										? "bg-gray-700 text-gray-500"
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
							{isDisabled && (
								<div className="w-2 h-2 bg-gray-600 rounded-full"></div>
							)}
						</button>
					);
				})}

				{/* Settings Button */}
				<button
					onClick={handleSettingsClick}
					className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 cursor-pointer group ${
						activeView === "settings"
							? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg"
							: "text-gray-400 hover:text-white hover:bg-gray-800/50"
					}`}>
					<div
						className={`p-2 rounded-lg transition-all duration-300 ${
							activeView === "settings"
								? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
								: "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
						}`}>
						<Settings className="h-4 w-4" />
					</div>
					<div className="flex-1 min-w-0">
						<div className="font-medium text-sm truncate">Settings</div>
						<div
							className={`text-xs truncate ${
								activeView === "settings" ? "text-blue-300" : "text-gray-500"
							}`}>
							Preferences
						</div>
					</div>
					{activeView === "settings" && (
						<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
					)}
				</button>
			</nav>

			{/* Quick Access */}
			{isConnected && (
				<div className="mt-8 pt-6 border-t border-gray-700">
					<h3 className="text-gray-400 text-sm font-medium mb-3">
						Quick Access
					</h3>
					<div className="space-y-2">
						{quickAccessItems.map((item) => (
							<button
								key={item.id}
								onClick={() => handleQuickAccessClick(item)}
								className="w-full flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer text-sm">
								<item.icon className="h-4 w-4" />
								{item.label}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Connection Status */}
			<div className="mt-6 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
				<div className="flex items-center gap-2 mb-1">
					<div
						className={`w-2 h-2 rounded-full animate-pulse ${
							isConnected ? "bg-green-400" : "bg-yellow-400"
						}`}></div>
					<span
						className={`text-sm font-medium ${
							isConnected ? "text-green-400" : "text-yellow-400"
						}`}>
						{isConnected ? "Connected" : "Disconnected"}
					</span>
				</div>
				<p className="text-gray-400 text-xs">
					{isConnected
						? address
							? `${address.slice(0, 6)}...${address.slice(-4)}`
							: "Wallet is securely connected"
						: "Connect your wallet to start"}
				</p>
			</div>

			{/* Recent Activity Preview */}
			{isConnected && (
				<div className="mt-4 p-3 bg-gray-800/20 rounded-lg border border-gray-700">
					<div className="flex items-center gap-2 mb-2">
						<TrendingUp className="h-3 w-3 text-green-400" />
						<span className="text-green-400 text-xs font-medium">Live</span>
					</div>
					<p className="text-gray-400 text-xs">
						Real-time portfolio tracking active
					</p>
				</div>
			)}

			{/* Tips & Updates */}
			<div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
				<h4 className="text-blue-400 text-xs font-medium mb-1">Pro Tip</h4>
				<p className="text-blue-300 text-xs">
					Use the gas optimizer to save on transaction fees during low network
					congestion.
				</p>
			</div>
		</div>
	);
}
