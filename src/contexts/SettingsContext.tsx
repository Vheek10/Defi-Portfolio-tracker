/** @format */

// contexts/SettingsContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppSettings {
	theme: "light" | "dark" | "system";
	currency: "USD" | "EUR" | "GBP" | "JPY" | "CNY";
	language: string;
	notifications: {
		priceAlerts: boolean;
		gasAlerts: boolean;
		walletActivity: boolean;
		newsletter: boolean;
		securityAlerts: boolean;
	};
	privacy: {
		hideBalances: boolean;
		privateMode: boolean;
		autoLock: number;
		clearOnDisconnect: boolean;
	};
	preferences: {
		defaultView: "portfolio" | "analytics" | "wallet";
		refreshRate: number;
		showTestnets: boolean;
		slippageTolerance: number;
	};
	developer: {
		debugMode: boolean;
		rpcLogging: boolean;
		customRpcUrl: string;
	};
}

interface SettingsContextType {
	settings: AppSettings;
	updateSettings: (newSettings: Partial<AppSettings>) => void;
	updateNestedSettings: (section: keyof AppSettings, updates: any) => void;
	resetToDefaults: () => void;
	isLoading: boolean;
}

const defaultSettings: AppSettings = {
	theme: "system",
	currency: "USD",
	language: "en",
	notifications: {
		priceAlerts: true,
		gasAlerts: true,
		walletActivity: true,
		newsletter: false,
		securityAlerts: true,
	},
	privacy: {
		hideBalances: false,
		privateMode: false,
		autoLock: 15,
		clearOnDisconnect: false,
	},
	preferences: {
		defaultView: "portfolio",
		refreshRate: 30,
		showTestnets: false,
		slippageTolerance: 0.5,
	},
	developer: {
		debugMode: false,
		rpcLogging: false,
		customRpcUrl: "",
	},
};

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<AppSettings>(defaultSettings);
	const [isLoading, setIsLoading] = useState(true);

	// Load settings from localStorage on mount
	useEffect(() => {
		const loadSettings = () => {
			try {
				const savedSettings = localStorage.getItem("defi-tracker-settings");
				if (savedSettings) {
					const parsed = JSON.parse(savedSettings);
					setSettings(parsed);
					applyTheme(parsed.theme);
				}
			} catch (error) {
				console.error("Error loading settings:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadSettings();
	}, []);

	const applyTheme = (theme: string) => {
		const root = document.documentElement;
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);

		if (isDark) {
			root.classList.add("dark");
			root.style.colorScheme = "dark";
		} else {
			root.classList.remove("dark");
			root.style.colorScheme = "light";
		}
	};

	const updateSettings = (newSettings: Partial<AppSettings>) => {
		setSettings((prev) => {
			const updated = { ...prev, ...newSettings };
			localStorage.setItem("defi-tracker-settings", JSON.stringify(updated));
			if (newSettings.theme !== undefined) {
				applyTheme(newSettings.theme);
			}
			return updated;
		});
	};

	const updateNestedSettings = (section: keyof AppSettings, updates: any) => {
		setSettings((prev) => {
			const updated = {
				...prev,
				[section]: { ...prev[section], ...updates },
			};
			localStorage.setItem("defi-tracker-settings", JSON.stringify(updated));
			return updated;
		});
	};

	const resetToDefaults = () => {
		setSettings(defaultSettings);
		localStorage.setItem(
			"defi-tracker-settings",
			JSON.stringify(defaultSettings),
		);
		applyTheme(defaultSettings.theme);
	};

	return (
		<SettingsContext.Provider
			value={{
				settings,
				updateSettings,
				updateNestedSettings,
				resetToDefaults,
				isLoading,
			}}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}

export function useCurrency() {
	const { settings } = useSettings();
	return settings.currency;
}

export function useTheme() {
	const { settings } = useSettings();
	return settings.theme;
}

export function usePrivacy() {
	const { settings } = useSettings();
	return settings.privacy;
}

export function usePreferences() {
	const { settings } = useSettings();
	return settings.preferences;
}

export function useNotifications() {
	const { settings } = useSettings();
	return settings.notifications;
}
