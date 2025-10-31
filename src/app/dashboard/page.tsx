/** @format */

// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { EnhancedPortfolioDashboard } from "@/components/EnhancedPortfolioDashboard";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Wallet, Settings, Coins, Zap } from "lucide-react";

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState("portfolio");

	const renderTabContent = () => {
		switch (activeTab) {
			case "portfolio":
				return <EnhancedPortfolioDashboard />;
			case "analytics":
				return <AnalyticsDashboard />;
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
				return <EnhancedPortfolioDashboard />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
			<div className="flex h-[calc(100vh-80px)]">
				{/* Sidebar */}
				<DashboardSidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>

				{/* Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Header - Completely removed the title and description div */}
					<header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
						<div className="px-6 py-4">
							<div className="flex items-center justify-between">
								{/* Empty div to maintain flex layout */}
								<div></div>

								{/* Quick Actions */}
							</div>
						</div>
					</header>

					{/* Content Area - Hide Scrollbar */}
					<main className="flex-1 overflow-auto no-scrollbar">
						<div className="p-6">{renderTabContent()}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
