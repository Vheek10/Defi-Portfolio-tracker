/** @format */

"use client";

import { useState } from "react";
import { PortfolioDashboard } from "./PortfolioDashboard";
import { DashboardSidebar } from "./DashboardSidebar";
import { BarChart3, Wallet, Settings, Coins, Zap } from "lucide-react";

export function LaunchAppSection() {
	const [activeTab, setActiveTab] = useState("portfolio");

	const renderTabContent = () => {
		switch (activeTab) {
			case "portfolio":
				return <PortfolioDashboard />;
			case "analytics":
				return (
					<div className="text-center py-12">
						<BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-3">
							Advanced Analytics
						</h3>
						<p className="text-gray-400 max-w-md mx-auto mb-6">
							Deep insights into your portfolio performance with interactive
							charts and historical data.
						</p>
						<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
							<div className="text-sm text-gray-400">Coming Soon</div>
						</div>
					</div>
				);
			case "wallet":
				return (
					<div className="text-center py-12">
						<Wallet className="h-16 w-16 text-purple-400 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-3">
							Wallet Management
						</h3>
						<p className="text-gray-400 max-w-md mx-auto mb-6">
							Advanced wallet features including transaction history, gas
							optimization, and multi-wallet support.
						</p>
						<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
							<div className="text-sm text-gray-400">Coming Soon</div>
						</div>
					</div>
				);
			case "earn":
				return (
					<div className="text-center py-12">
						<Coins className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-3">Earn & Yield</h3>
						<p className="text-gray-400 max-w-md mx-auto mb-6">
							Discover the best yield farming opportunities and staking
							protocols across multiple chains.
						</p>
						<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
							<div className="text-sm text-gray-400">Coming Soon</div>
						</div>
					</div>
				);
			case "settings":
				return (
					<div className="text-center py-12">
						<Settings className="h-16 w-16 text-green-400 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-3">Settings</h3>
						<p className="text-gray-400 max-w-md mx-auto mb-6">
							Customize your dashboard, set preferences, and manage your account
							settings.
						</p>
						<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-md mx-auto">
							<div className="text-sm text-gray-400">Coming Soon</div>
						</div>
					</div>
				);
			default:
				return <PortfolioDashboard />;
		}
	};

	return (
		<section className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
			<div className="flex h-screen">
				{/* Sidebar */}
				<DashboardSidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>

				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Header */}
					<header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
						<div className="px-6 py-4">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
										{activeTab === "portfolio" && "Portfolio Overview"}
										{activeTab === "analytics" && "Advanced Analytics"}
										{activeTab === "wallet" && "Wallet Management"}
										{activeTab === "earn" && "Earn & Yield"}
										{activeTab === "settings" && "Settings"}
									</h1>
									<p className="text-gray-400 text-sm mt-1">
										{activeTab === "portfolio" &&
											"Track your multi-chain assets and performance"}
										{activeTab === "analytics" &&
											"Deep insights and historical data"}
										{activeTab === "wallet" && "Manage your digital assets"}
										{activeTab === "earn" && "Discover yield opportunities"}
										{activeTab === "settings" && "Customize your experience"}
									</p>
								</div>

								{/* Quick Actions */}
								<div className="flex items-center gap-3">
									<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer">
										<Zap className="h-4 w-4" />
										<span className="text-sm font-medium">Quick Swap</span>
									</button>
								</div>
							</div>
						</div>
					</header>

					{/* Content Area */}
					<main className="flex-1 overflow-auto">
						<div className="p-6">{renderTabContent()}</div>
					</main>
				</div>
			</div>
		</section>
	);
}
