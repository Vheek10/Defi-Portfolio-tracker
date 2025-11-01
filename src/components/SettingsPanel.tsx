/** @format */

// components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import {
	Settings,
	Bell,
	Shield,
	Moon,
	Sun,
	Globe,
	Database,
	Trash2,
	Download,
	Upload,
	Wallet,
	Network,
	Clock,
	User,
	Key,
	HelpCircle,
	X,
	Check,
	AlertTriangle,
} from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useSettings, type AppSettings } from "@/contexts/SettingsContext";

const CURRENCIES = {
	USD: { symbol: "$", name: "US Dollar" },
	EUR: { symbol: "€", name: "Euro" },
	GBP: { symbol: "£", name: "British Pound" },
	JPY: { symbol: "¥", name: "Japanese Yen" },
	CNY: { symbol: "¥", name: "Chinese Yuan" },
};

const LANGUAGES = [
	{ code: "en", name: "English", nativeName: "English" },
	{ code: "es", name: "Spanish", nativeName: "Español" },
	{ code: "fr", name: "French", nativeName: "Français" },
	{ code: "de", name: "German", nativeName: "Deutsch" },
	{ code: "zh", name: "Chinese", nativeName: "中文" },
	{ code: "ja", name: "Japanese", nativeName: "日本語" },
];

interface SettingsPanelProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
	const { isConnected, address } = useAccount();
	const { disconnect } = useDisconnect();
	const { settings, updateSettings, updateNestedSettings, resetToDefaults } =
		useSettings();

	const [activeTab, setActiveTab] = useState<
		"general" | "notifications" | "privacy" | "advanced" | "developer"
	>("general");
	const [showSaveIndicator, setShowSaveIndicator] = useState(false);
	const [importError, setImportError] = useState<string | null>(null);

	const exportSettings = () => {
		const data = {
			settings,
			exportedAt: new Date().toISOString(),
			version: "1.0.0",
			walletAddress: address,
		};

		const dataStr = JSON.stringify(data, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `defi-tracker-settings-${
			new Date().toISOString().split("T")[0]
		}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target?.result as string);

				if (
					!importedData.settings ||
					typeof importedData.settings !== "object"
				) {
					throw new Error("Invalid settings file format");
				}

				updateSettings(importedData.settings);
				setImportError(null);
				setShowSaveIndicator(true);
				setTimeout(() => setShowSaveIndicator(false), 3000);
			} catch (error) {
				setImportError(
					"Failed to import settings. Please check the file format.",
				);
				console.error("Import error:", error);
			}
		};
		reader.readAsText(file);
		event.target.value = "";
	};

	const clearAllData = () => {
		if (
			confirm(
				"This will clear ALL local data including wallet sessions and portfolio data. This action cannot be undone.",
			)
		) {
			localStorage.removeItem("defi-tracker-settings");
			localStorage.removeItem("walletSessions");
			localStorage.removeItem("portfolio-cache");
			localStorage.removeItem("transaction-cache");

			if (isConnected) {
				disconnect();
			}

			resetToDefaults();
			setTimeout(() => window.location.reload(), 1000);
		}
	};

	const handleDisconnect = () => {
		if (confirm("Disconnect your wallet?")) {
			disconnect();
			onClose();
		}
	};

	const getCurrentThemeName = () => {
		if (settings.theme === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "Dark (System)"
				: "Light (System)";
		}
		return settings.theme === "dark" ? "Dark" : "Light";
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
				<div className="flex items-center justify-between p-6 border-b border-gray-700">
					<div className="flex items-center gap-3">
						<Settings className="h-6 w-6 text-blue-400" />
						<div>
							<h2 className="text-xl font-bold text-white">Settings</h2>
							<p className="text-gray-400 text-sm">
								Current theme: {getCurrentThemeName()}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						{showSaveIndicator && (
							<div className="flex items-center gap-2 text-green-400 text-sm">
								<Check className="h-4 w-4" />
								Saved
							</div>
						)}
						{importError && (
							<div className="flex items-center gap-2 text-red-400 text-sm">
								<AlertTriangle className="h-4 w-4" />
								{importError}
							</div>
						)}
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white transition-colors p-1">
							<X className="h-5 w-5" />
						</button>
					</div>
				</div>

				<div className="flex h-[calc(90vh-80px)]">
					<div className="w-64 border-r border-gray-700 bg-gray-800/50 p-4">
						<nav className="space-y-1">
							{[
								{ id: "general", label: "General", icon: Settings },
								{ id: "notifications", label: "Notifications", icon: Bell },
								{ id: "privacy", label: "Privacy & Security", icon: Shield },
								{ id: "advanced", label: "Advanced", icon: Database },
								{ id: "developer", label: "Developer", icon: Key },
							].map((tab) => {
								const Icon = tab.icon;
								return (
									<button
										key={tab.id}
										onClick={() => {
											setActiveTab(tab.id as any);
											setImportError(null);
										}}
										className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
											activeTab === tab.id
												? "bg-blue-500 text-white shadow-lg"
												: "text-gray-400 hover:text-white hover:bg-gray-700"
										}`}>
										<Icon className="h-4 w-4" />
										{tab.label}
									</button>
								);
							})}
						</nav>

						<div className="mt-8 space-y-2">
							<h3 className="text-gray-400 text-sm font-medium px-3 mb-2">
								Quick Actions
							</h3>
							<button
								onClick={exportSettings}
								className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
								<Download className="h-4 w-4" />
								Export Settings
							</button>
							<button
								onClick={() =>
									document.getElementById("import-settings")?.click()
								}
								className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
								<Upload className="h-4 w-4" />
								Import Settings
							</button>
							<input
								id="import-settings"
								type="file"
								accept=".json"
								onChange={importSettings}
								className="hidden"
							/>
							{isConnected && (
								<button
									onClick={handleDisconnect}
									className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
									<X className="h-4 w-4" />
									Disconnect Wallet
								</button>
							)}
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-6">
						{activeTab === "general" && (
							<GeneralSettings
								settings={settings}
								onUpdateSettings={updateSettings}
								onUpdateNestedSettings={updateNestedSettings}
								currencies={CURRENCIES}
								languages={LANGUAGES}
							/>
						)}

						{activeTab === "notifications" && (
							<NotificationSettings
								settings={settings}
								onUpdateNestedSettings={updateNestedSettings}
							/>
						)}

						{activeTab === "privacy" && (
							<PrivacySecuritySettings
								settings={settings}
								onUpdateNestedSettings={updateNestedSettings}
								isConnected={isConnected}
							/>
						)}

						{activeTab === "advanced" && (
							<AdvancedSettings
								settings={settings}
								onUpdateNestedSettings={updateNestedSettings}
								onClearData={clearAllData}
								onResetDefaults={resetToDefaults}
							/>
						)}

						{activeTab === "developer" && (
							<DeveloperSettings
								settings={settings}
								onUpdateNestedSettings={updateNestedSettings}
							/>
						)}
					</div>
				</div>

				<div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
					<div className="text-sm text-gray-400">
						Settings are automatically saved
					</div>
					<div className="flex gap-3">
						<button
							onClick={resetToDefaults}
							className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
							Reset to Defaults
						</button>
						<button
							onClick={onClose}
							className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
							Close Settings
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function GeneralSettings({
	settings,
	onUpdateSettings,
	onUpdateNestedSettings,
	currencies,
	languages,
}: any) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">General Settings</h3>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Moon className="h-4 w-4" />
					Theme
				</h4>
				<div className="grid grid-cols-3 gap-3">
					{[
						{ value: "light", label: "Light", icon: Sun },
						{ value: "dark", label: "Dark", icon: Moon },
						{ value: "system", label: "System", icon: Settings },
					].map((theme) => {
						const Icon = theme.icon;
						return (
							<button
								key={theme.value}
								onClick={() => onUpdateSettings({ theme: theme.value })}
								className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
									settings.theme === theme.value
										? "border-blue-500 bg-blue-500/10 text-blue-400"
										: "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white"
								}`}>
								<Icon className="h-5 w-5" />
								<span className="text-sm">{theme.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Globe className="h-4 w-4" />
					Currency
				</h4>
				<select
					value={settings.currency}
					onChange={(e) => onUpdateSettings({ currency: e.target.value })}
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
					{Object.entries(currencies).map(([code, data]: [string, any]) => (
						<option
							key={code}
							value={code}>
							{data.symbol} {data.name} ({code})
						</option>
					))}
				</select>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Globe className="h-4 w-4" />
					Language
				</h4>
				<select
					value={settings.language}
					onChange={(e) => onUpdateSettings({ language: e.target.value })}
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
					{languages.map((lang: any) => (
						<option
							key={lang.code}
							value={lang.code}>
							{lang.name} ({lang.nativeName})
						</option>
					))}
				</select>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Wallet className="h-4 w-4" />
					Default Dashboard View
				</h4>
				<select
					value={settings.preferences.defaultView}
					onChange={(e) =>
						onUpdateNestedSettings("preferences", {
							defaultView: e.target.value,
						})
					}
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
					<option value="portfolio">Portfolio Overview</option>
					<option value="analytics">Analytics</option>
					<option value="wallet">Wallet Management</option>
				</select>
			</div>
		</div>
	);
}

function NotificationSettings({ settings, onUpdateNestedSettings }: any) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">
				Notification Settings
			</h3>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
				{[
					{
						key: "priceAlerts",
						label: "Price Alerts",
						description: "Get notified when your assets reach target prices",
					},
					{
						key: "gasAlerts",
						label: "Gas Price Alerts",
						description: "Receive notifications when gas prices are optimal",
					},
					{
						key: "walletActivity",
						label: "Wallet Activity",
						description: "Notifications for incoming/outgoing transactions",
					},
					{
						key: "securityAlerts",
						label: "Security Alerts",
						description: "Important security notifications and warnings",
					},
					{
						key: "newsletter",
						label: "Newsletter & Updates",
						description: "Weekly updates and market insights",
					},
				].map((notification) => (
					<div
						key={notification.key}
						className="flex items-center justify-between">
						<div className="flex-1">
							<div className="text-white font-medium">{notification.label}</div>
							<div className="text-gray-400 text-sm">
								{notification.description}
							</div>
						</div>
						<ToggleSwitch
							checked={settings.notifications[notification.key]}
							onChange={(checked) =>
								onUpdateNestedSettings("notifications", {
									[notification.key]: checked,
								})
							}
						/>
					</div>
				))}
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Clock className="h-4 w-4" />
					Data Refresh Rate
				</h4>
				<div className="space-y-2">
					<input
						type="range"
						min="15"
						max="300"
						step="15"
						value={settings.preferences.refreshRate}
						onChange={(e) =>
							onUpdateNestedSettings("preferences", {
								refreshRate: parseInt(e.target.value),
							})
						}
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
					/>
					<div className="flex justify-between text-sm text-gray-400">
						<span>15 seconds</span>
						<span className="text-white">
							{settings.preferences.refreshRate} seconds
						</span>
						<span>5 minutes</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function PrivacySecuritySettings({
	settings,
	onUpdateNestedSettings,
	isConnected,
}: any) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">Privacy & Security</h3>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
				{[
					{
						key: "hideBalances",
						label: "Hide Balances",
						description: "Mask your portfolio values for privacy",
					},
					{
						key: "privateMode",
						label: "Private Mode",
						description: "Disable analytics and tracking",
					},
					{
						key: "clearOnDisconnect",
						label: "Clear Data on Disconnect",
						description:
							"Automatically clear local data when disconnecting wallet",
						disabled: !isConnected,
					},
				].map((item) => (
					<div
						key={item.key}
						className="flex items-center justify-between">
						<div className="flex-1">
							<div className="text-white font-medium">{item.label}</div>
							<div className="text-gray-400 text-sm">{item.description}</div>
							{item.disabled && (
								<div className="text-yellow-400 text-xs mt-1">
									Wallet must be connected
								</div>
							)}
						</div>
						<ToggleSwitch
							checked={settings.privacy[item.key]}
							onChange={(checked) =>
								onUpdateNestedSettings("privacy", { [item.key]: checked })
							}
							disabled={item.disabled}
						/>
					</div>
				))}
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Shield className="h-4 w-4" />
					Auto Lock Timer
				</h4>
				<select
					value={settings.privacy.autoLock}
					onChange={(e) =>
						onUpdateNestedSettings("privacy", {
							autoLock: parseInt(e.target.value),
						})
					}
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
					<option value="1">1 minute</option>
					<option value="5">5 minutes</option>
					<option value="15">15 minutes</option>
					<option value="30">30 minutes</option>
					<option value="60">1 hour</option>
					<option value="0">Never</option>
				</select>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3 flex items-center gap-2">
					<Network className="h-4 w-4" />
					Network Settings
				</h4>
				<label className="flex items-center gap-3 text-white">
					<ToggleSwitch
						checked={settings.preferences.showTestnets}
						onChange={(checked) =>
							onUpdateNestedSettings("preferences", { showTestnets: checked })
						}
					/>
					Show Test Networks
				</label>
			</div>
		</div>
	);
}

function AdvancedSettings({
	settings,
	onUpdateNestedSettings,
	onClearData,
	onResetDefaults,
}: any) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">Advanced Settings</h3>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3">Slippage Tolerance</h4>
				<div className="space-y-2">
					<input
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						value={settings.preferences.slippageTolerance}
						onChange={(e) =>
							onUpdateNestedSettings("preferences", {
								slippageTolerance: parseFloat(e.target.value),
							})
						}
						className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
					/>
					<div className="flex justify-between text-sm text-gray-400">
						<span>0.1%</span>
						<span className="text-white">
							{settings.preferences.slippageTolerance}%
						</span>
						<span>5%</span>
					</div>
				</div>
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
				<h4 className="text-white font-medium flex items-center gap-2">
					<Database className="h-4 w-4" />
					Data Management
				</h4>

				<button
					onClick={onClearData}
					className="flex items-center gap-3 w-full p-3 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
					<Trash2 className="h-4 w-4" />
					<div>
						<div className="font-medium">Clear All Data</div>
						<div className="text-sm text-red-300">
							Remove all local data and reset the application
						</div>
					</div>
				</button>

				<button
					onClick={onResetDefaults}
					className="flex items-center gap-3 w-full p-3 text-left text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
					<Settings className="h-4 w-4" />
					<div>
						<div className="font-medium">Reset to Defaults</div>
						<div className="text-sm text-yellow-300">
							Restore all settings to their default values
						</div>
					</div>
				</button>
			</div>
		</div>
	);
}

function DeveloperSettings({ settings, onUpdateNestedSettings }: any) {
	return (
		<div className="space-y-6">
			<h3 className="text-lg font-semibold text-white">Developer Settings</h3>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">
				{[
					{
						key: "debugMode",
						label: "Debug Mode",
						description:
							"Enable detailed console logging and debugging information",
					},
					{
						key: "rpcLogging",
						label: "RPC Logging",
						description: "Log all RPC calls and responses",
					},
				].map((item) => (
					<div
						key={item.key}
						className="flex items-center justify-between">
						<div className="flex-1">
							<div className="text-white font-medium">{item.label}</div>
							<div className="text-gray-400 text-sm">{item.description}</div>
						</div>
						<ToggleSwitch
							checked={settings.developer[item.key]}
							onChange={(checked) =>
								onUpdateNestedSettings("developer", { [item.key]: checked })
							}
						/>
					</div>
				))}
			</div>

			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
				<h4 className="text-white font-medium mb-3">Custom RPC URL</h4>
				<input
					type="text"
					value={settings.developer.customRpcUrl}
					onChange={(e) =>
						onUpdateNestedSettings("developer", {
							customRpcUrl: e.target.value,
						})
					}
					placeholder="https://mainnet.infura.io/v3/your-api-key"
					className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 placeholder-gray-500"
				/>
				<p className="text-gray-400 text-xs mt-2">
					Custom RPC endpoint for Ethereum mainnet. Use with caution.
				</p>
			</div>
		</div>
	);
}

function ToggleSwitch({ checked, onChange, disabled = false }: any) {
	return (
		<label
			className={`relative inline-flex items-center cursor-pointer ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => !disabled && onChange(e.target.checked)}
				className="sr-only peer"
				disabled={disabled}
			/>
			<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
		</label>
	);
}
