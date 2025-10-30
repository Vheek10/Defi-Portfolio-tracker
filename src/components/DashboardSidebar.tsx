/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Home,
	BarChart3,
	Wallet,
	Settings,
	PieChart,
	TrendingUp,
	Coins,
	ArrowLeft,
	Menu,
	X,
} from "lucide-react";

interface DashboardSidebarProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({
	activeTab,
	setActiveTab,
}: DashboardSidebarProps) {
	const router = useRouter();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const navigation = [
		{
			id: "portfolio",
			name: "Portfolio",
			icon: PieChart,
			description: "Overview & Assets",
		},
		{
			id: "analytics",
			name: "Analytics",
			icon: TrendingUp,
			description: "Charts & Insights",
		},
		{
			id: "wallet",
			name: "Wallet",
			icon: Wallet,
			description: "Manage Assets",
		},
		{
			id: "earn",
			name: "Earn",
			icon: Coins,
			description: "Yield Opportunities",
		},
		{
			id: "settings",
			name: "Settings",
			icon: Settings,
			description: "Preferences",
		},
	];

	const NavContent = () => (
		<>
			{/* Header */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
						<PieChart className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-lg font-bold text-white">DeFi Dashboard</h1>
						<p className="text-gray-400 text-sm">Multi-chain Portfolio</p>
					</div>
				</div>

				{/* Back to Home Button */}
				<button
					onClick={() => router.push("/")}
					className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
					<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
						<ArrowLeft className="h-4 w-4 text-white" />
					</div>
					<div className="text-left">
						<div className="text-white font-medium text-sm">Back to Home</div>
						<div className="text-gray-400 text-xs">Return to landing page</div>
					</div>
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<div className="space-y-2">
					{navigation.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;

						return (
							<button
								key={item.id}
								onClick={() => {
									setActiveTab(item.id);
									setIsMobileOpen(false);
								}}
								className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer group
                  ${
										isActive
											? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10"
											: "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent"
									}
                `}>
								<div
									className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                  ${
										isActive
											? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
											: "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
									}
                `}>
									<Icon className="h-5 w-5" />
								</div>
								<div className="text-left flex-1">
									<div className="font-medium text-sm">{item.name}</div>
									<div className="text-xs opacity-70">{item.description}</div>
								</div>
								{isActive && (
									<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
								)}
							</button>
						);
					})}
				</div>
			</nav>

			{/* Footer */}
			<div className="p-4 border-t border-gray-700">
				<div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
					<div className="text-center">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
							<Coins className="h-4 w-4 text-white" />
						</div>
						<div className="text-white text-sm font-medium mb-1">
							Pro Features
						</div>
						<div className="text-gray-400 text-xs">
							Upgrade for advanced analytics
						</div>
						<button className="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer">
							Upgrade Now
						</button>
					</div>
				</div>
			</div>
		</>
	);

	return (
		<>
			{/* Mobile Menu Button */}
			<div className="lg:hidden fixed top-4 left-4 z-50">
				<button
					onClick={() => setIsMobileOpen(!isMobileOpen)}
					className="w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl flex items-center justify-center text-white hover:bg-gray-800 transition-all duration-300 cursor-pointer">
					{isMobileOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</button>
			</div>

			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
					onClick={() => setIsMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-80 bg-gray-900/90 backdrop-blur-md border-r border-gray-700 flex flex-col
      `}>
				<NavContent />
			</div>
		</>
	);
}
