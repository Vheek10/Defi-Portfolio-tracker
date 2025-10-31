/** @format */

// hooks/useAlertManager.ts
import { useEffect } from "react";
import { useAlertStore } from "@/stores/alertStore";

export function useAlertManager() {
	const {
		alerts,
		alertRules,
		unreadCount,
		addAlert,
		dismissAlert,
		markAsRead,
		markAllAsRead,
		addAlertRule,
		updateAlertRule,
		deleteAlertRule,
		checkPriceAlerts,
		checkPortfolioAlerts,
		checkGasAlerts,
		checkYieldAlerts,
	} = useAlertStore();

	// Request notification permission on mount
	useEffect(() => {
		if ("Notification" in window && Notification.permission === "default") {
			Notification.requestPermission();
		}
	}, []);

	// Auto-dismiss old alerts after 24 hours
	useEffect(() => {
		const interval = setInterval(() => {
			const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
			alerts.forEach((alert) => {
				if (alert.createdAt < twentyFourHoursAgo && alert.triggered) {
					dismissAlert(alert.id);
				}
			});
		}, 60 * 1000); // Check every minute

		return () => clearInterval(interval);
	}, [alerts, dismissAlert]);

	return {
		// State
		alerts,
		alertRules,
		unreadCount,

		// Actions
		addAlert,
		dismissAlert,
		markAsRead,
		markAllAsRead,

		// Rule Management
		addAlertRule,
		updateAlertRule,
		deleteAlertRule,

		// Alert Checkers
		checkPriceAlerts,
		checkPortfolioAlerts,
		checkGasAlerts,
		checkYieldAlerts,
	};
}
