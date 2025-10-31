/** @format */

// components/AlertCenter.tsx
import { useState } from "react";
import {
	Bell,
	X,
	Settings,
	AlertTriangle,
	Info,
	Zap,
	Flame,
	TrendingUp,
	CheckCircle2,
} from "lucide-react";
import { useAlertManager } from "@/hooks/useAlertManager";

export function AlertCenter() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"alerts" | "rules">("alerts");

	const {
		alerts,
		alertRules,
		unreadCount,
		dismissAlert,
		markAsRead,
		markAllAsRead,
		deleteAlertRule,
		updateAlertRule,
	} = useAlertManager();

	const getAlertIcon = (type: string, severity: string) => {
		const baseClass = "h-5 w-5";

		switch (type) {
			case "price":
				return (
					<TrendingUp
						className={`${baseClass} ${
							severity === "critical" ? "text-red-400" : "text-yellow-400"
						}`}
					/>
				);
			case "portfolio":
				return (
					<AlertTriangle
						className={`${baseClass} ${
							severity === "critical" ? "text-red-400" : "text-yellow-400"
						}`}
					/>
				);
			case "gas":
				return <Flame className={`${baseClass} text-orange-400`} />;
			case "yield":
				return <Zap className={`${baseClass} text-green-400`} />;
			default:
				return <Info className={`${baseClass} text-blue-400`} />;
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "critical":
				return "border-red-500 bg-red-500/10";
			case "warning":
				return "border-yellow-500 bg-yellow-500/10";
			default:
				return "border-blue-500 bg-blue-500/10";
		}
	};

	return (
		<div className="relative">
			{/* Alert Bell Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
				<Bell className="h-6 w-6" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{/* Alert Panel */}
			{isOpen && (
				<div className="absolute right-0 top-12 w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-700">
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5 text-blue-400" />
							<h3 className="text-white font-semibold">Alerts</h3>
							{unreadCount > 0 && (
								<span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
									{unreadCount} new
								</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() =>
									setActiveTab(activeTab === "alerts" ? "rules" : "alerts")
								}
								className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
								<Settings className="h-4 w-4" />
							</button>
							<button
								onClick={() => setIsOpen(false)}
								className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Tabs */}
					<div className="flex border-b border-gray-700">
						<button
							onClick={() => setActiveTab("alerts")}
							className={`flex-1 py-3 text-sm font-medium transition-colors ${
								activeTab === "alerts"
									? "text-blue-400 border-b-2 border-blue-400"
									: "text-gray-400 hover:text-white"
							}`}>
							Alerts ({alerts.length})
						</button>
						<button
							onClick={() => setActiveTab("rules")}
							className={`flex-1 py-3 text-sm font-medium transition-colors ${
								activeTab === "rules"
									? "text-blue-400 border-b-2 border-blue-400"
									: "text-gray-400 hover:text-white"
							}`}>
							Rules ({alertRules.length})
						</button>
					</div>

					{/* Content */}
					<div className="max-h-96 overflow-y-auto">
						{activeTab === "alerts" ? (
							/* Alerts List */
							<div className="p-2">
								{alerts.length === 0 ? (
									<div className="text-center py-8 text-gray-400">
										<CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
										<p>No alerts at the moment</p>
									</div>
								) : (
									<>
										{unreadCount > 0 && (
											<button
												onClick={markAllAsRead}
												className="w-full text-xs text-blue-400 hover:text-blue-300 py-2 cursor-pointer">
												Mark all as read
											</button>
										)}
										{alerts.map((alert) => (
											<div
												key={alert.id}
												className={`p-3 rounded-lg border mb-2 transition-all ${getSeverityColor(
													alert.severity,
												)} ${!alert.triggered ? "ring-1 ring-blue-400" : ""}`}>
												<div className="flex items-start justify-between">
													<div className="flex items-start gap-3">
														{getAlertIcon(alert.type, alert.severity)}
														<div className="flex-1">
															<div className="flex items-center gap-2">
																<h4 className="text-white font-medium text-sm">
																	{alert.title}
																</h4>
																{!alert.triggered && (
																	<span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
																		New
																	</span>
																)}
															</div>
															<p className="text-gray-300 text-sm mt-1">
																{alert.message}
															</p>
															<div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
																<span>
																	{new Date(
																		alert.createdAt,
																	).toLocaleTimeString()}
																</span>
																{alert.data.token && (
																	<span>{alert.data.token}</span>
																)}
																{alert.data.changePercent && (
																	<span
																		className={
																			alert.data.changePercent >= 0
																				? "text-green-400"
																				: "text-red-400"
																		}>
																		{alert.data.changePercent > 0 ? "+" : ""}
																		{alert.data.changePercent}%
																	</span>
																)}
															</div>
														</div>
													</div>
													<div className="flex items-center gap-1">
														{!alert.triggered && (
															<button
																onClick={() => markAsRead(alert.id)}
																className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
																<CheckCircle2 className="h-4 w-4" />
															</button>
														)}
														<button
															onClick={() => dismissAlert(alert.id)}
															className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer">
															<X className="h-4 w-4" />
														</button>
													</div>
												</div>
											</div>
										))}
									</>
								)}
							</div>
						) : (
							/* Alert Rules */
							<div className="p-4">
								<div className="space-y-3">
									{alertRules.map((rule) => (
										<div
											key={rule.id}
											className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
											<div>
												<div className="text-white font-medium text-sm">
													{rule.name}
												</div>
												<div className="text-gray-400 text-xs">
													{rule.type} • {rule.active ? "Active" : "Inactive"}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={rule.active}
														onChange={(e) =>
															updateAlertRule(rule.id, {
																active: e.target.checked,
															})
														}
														className="sr-only peer"
													/>
													<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
												</label>
												<button
													onClick={() => deleteAlertRule(rule.id)}
													className="p-1 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
													<X className="h-4 w-4" />
												</button>
											</div>
										</div>
									))}
								</div>

								<button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer">
									Add New Rule
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
