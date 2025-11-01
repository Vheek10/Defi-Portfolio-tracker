/** @format */

// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { EnhancedPortfolioDashboard } from "@/components/EnhancedPortfolioDashboard";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { SwapInterface } from "@/components/SwapInterface";
import { WalletManagement } from "@/components/WalletManagement";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics";

type DashboardView = "portfolio" | "analytics" | "swap" | "wallet" | "settings";

export default function DashboardPage() {
	const [activeView, setActiveView] = useState<DashboardView>("portfolio");

	const handleNavigateToSwap = () => {
		setActiveView("swap");
	};

	const handleNavigateToAnalytics = () => {
		setActiveView("analytics");
	};

	const handleNavigateToWallet = () => {
		setActiveView("wallet");
	};

	const handleNavigateToPortfolio = () => {
		setActiveView("portfolio");
	};

	const renderActiveView = () => {
		switch (activeView) {
			case "portfolio":
				return (
					<EnhancedPortfolioDashboard
						onNavigateToSwap={handleNavigateToSwap}
						onNavigateToAnalytics={handleNavigateToAnalytics}
					/>
				);
			case "analytics":
				return <AnalyticsDashboard onNavigateToSwap={handleNavigateToSwap} />;
			case "swap":
				return (
					<SwapInterface onNavigateToAnalytics={handleNavigateToAnalytics} />
				);
			case "wallet":
				return <WalletManagement />;
			case "settings":
				return (
					<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center backdrop-blur-sm">
						<Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-3">Settings</h3>
						<p className="text-gray-400">Settings panel coming soon...</p>
					</div>
				);
			default:
				return (
					<EnhancedPortfolioDashboard
						onNavigateToSwap={handleNavigateToSwap}
						onNavigateToAnalytics={handleNavigateToAnalytics}
					/>
				);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Sidebar */}
					<div className="lg:w-64">
						<DashboardSidebar
							activeView={activeView}
							onViewChange={setActiveView}
						/>
					</div>

					{/* Main Content */}
					<div className="flex-1">{renderActiveView()}</div>
				</div>
			</div>
		</div>
	);
}
