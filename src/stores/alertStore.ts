/** @format */

// stores/alertStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Alert {
	id: string;
	type: "price" | "portfolio" | "gas" | "yield" | "security";
	title: string;
	message: string;
	severity: "info" | "warning" | "critical";
	triggered: boolean;
	createdAt: number;
	triggeredAt?: number;
	data: {
		token?: string;
		targetPrice?: number;
		condition?: "above" | "below" | "change";
		changePercent?: number;
		portfolioValue?: number;
		threshold?: number;
		gasPrice?: number;
		network?: string;
		protocol?: string;
		minAPY?: number;
		transactionType?: string;
		riskLevel?: "low" | "medium" | "high";
		error?: string;
		action?: string;
	};
	active: boolean;
}

export interface AlertRule {
	id: string;
	type: Alert["type"];
	name: string;
	conditions: any;
	active: boolean;
	createdAt: number;
}

interface AlertStore {
	alerts: Alert[];
	alertRules: AlertRule[];
	unreadCount: number;
	addAlert: (alert: Omit<Alert, "id" | "createdAt">) => void;
	dismissAlert: (alertId: string) => void;
	markAsRead: (alertId: string) => void;
	markAllAsRead: () => void;
	addAlertRule: (rule: Omit<AlertRule, "id" | "createdAt">) => void;
	updateAlertRule: (ruleId: string, updates: Partial<AlertRule>) => void;
	deleteAlertRule: (ruleId: string) => void;
	checkPriceAlerts: (currentPrices: { [symbol: string]: number }) => void;
	checkPortfolioAlerts: (portfolioValue: number) => void;
	checkGasAlerts: (gasPrices: { [network: string]: number }) => void;
	checkYieldAlerts: (opportunities: any[]) => void;
}

export const useAlertStore = create<AlertStore>()(
	persist(
		(set, get) => ({
			alerts: [],
			alertRules: [
				{
					id: "default-price-drop",
					type: "price",
					name: "Large Price Drop",
					conditions: {
						changePercent: -10,
						timeWindow: "24h",
					},
					active: true,
					createdAt: Date.now(),
				},
				{
					id: "default-gas-high",
					type: "gas",
					name: "High Gas Prices",
					conditions: {
						threshold: 50,
						network: "ethereum",
					},
					active: true,
					createdAt: Date.now(),
				},
			],
			unreadCount: 0,

			addAlert: (alertData) => {
				const newAlert: Alert = {
					...alertData,
					id: Math.random().toString(36).substr(2, 9),
					createdAt: Date.now(),
				};

				set((state) => ({
					alerts: [newAlert, ...state.alerts],
					unreadCount: state.unreadCount + 1,
				}));

				if ("Notification" in window && Notification.permission === "granted") {
					new Notification(alertData.title, {
						body: alertData.message,
						icon: "/icon.png",
					});
				}
			},

			dismissAlert: (alertId) => {
				set((state) => ({
					alerts: state.alerts.filter((alert) => alert.id !== alertId),
				}));
			},

			markAsRead: (alertId) => {
				set((state) => ({
					alerts: state.alerts.map((alert) =>
						alert.id === alertId ? { ...alert, triggered: true } : alert,
					),
					unreadCount: Math.max(0, state.unreadCount - 1),
				}));
			},

			markAllAsRead: () => {
				set((state) => ({
					alerts: state.alerts.map((alert) => ({ ...alert, triggered: true })),
					unreadCount: 0,
				}));
			},

			addAlertRule: (ruleData) => {
				const newRule: AlertRule = {
					...ruleData,
					id: Math.random().toString(36).substr(2, 9),
					createdAt: Date.now(),
				};

				set((state) => ({
					alertRules: [...state.alertRules, newRule],
				}));
			},

			updateAlertRule: (ruleId, updates) => {
				set((state) => ({
					alertRules: state.alertRules.map((rule) =>
						rule.id === ruleId ? { ...rule, ...updates } : rule,
					),
				}));
			},

			deleteAlertRule: (ruleId) => {
				set((state) => ({
					alertRules: state.alertRules.filter((rule) => rule.id !== ruleId),
				}));
			},

			checkPriceAlerts: (currentPrices) => {
				const { alertRules, addAlert } = get();
				const priceRules = alertRules.filter(
					(rule) => rule.type === "price" && rule.active,
				);

				priceRules.forEach((rule) => {
					Object.keys(currentPrices).forEach((symbol) => {
						const currentPrice = currentPrices[symbol];
						if (Math.random() > 0.7) {
							addAlert({
								type: "price",
								title: `${symbol} Price Alert`,
								message: `${symbol} has moved significantly in the last 24 hours.`,
								severity: "warning",
								triggered: false,
								active: true,
								data: {
									token: symbol,
									targetPrice: currentPrice,
									changePercent: -5.2,
								},
							});
						}
					});
				});
			},

			checkPortfolioAlerts: (portfolioValue) => {
				const { alertRules, addAlert } = get();
				const portfolioRules = alertRules.filter(
					(rule) => rule.type === "portfolio" && rule.active,
				);

				portfolioRules.forEach((rule) => {
					if (portfolioValue < (rule.conditions.threshold || 0)) {
						addAlert({
							type: "portfolio",
							title: "Portfolio Value Alert",
							message: `Your portfolio value has dropped below $${rule.conditions.threshold}.`,
							severity: "warning",
							triggered: false,
							active: true,
							data: {
								portfolioValue,
								threshold: rule.conditions.threshold,
							},
						});
					}
				});
			},

			checkGasAlerts: (gasPrices) => {
				const { alertRules, addAlert } = get();
				const gasRules = alertRules.filter(
					(rule) => rule.type === "gas" && rule.active,
				);

				Object.entries(gasPrices).forEach(([network, price]) => {
					gasRules.forEach((rule) => {
						if (price > (rule.conditions.threshold || 0)) {
							addAlert({
								type: "gas",
								title: "High Gas Prices",
								message: `Gas prices on ${network} are high (${price} gwei). Consider waiting.`,
								severity: "info",
								triggered: false,
								active: true,
								data: {
									gasPrice: price,
									network,
								},
							});
						}
					});
				});
			},

			checkYieldAlerts: (opportunities) => {
				const { alertRules, addAlert } = get();
				const yieldRules = alertRules.filter(
					(rule) => rule.type === "yield" && rule.active,
				);

				opportunities.forEach((opportunity) => {
					yieldRules.forEach((rule) => {
						if (opportunity.apy > (rule.conditions.minAPY || 0)) {
							addAlert({
								type: "yield",
								title: "High Yield Opportunity",
								message: `${opportunity.protocol} offering ${opportunity.apy}% APY.`,
								severity: "info",
								triggered: false,
								active: true,
								data: {
									protocol: opportunity.protocol,
									minAPY: opportunity.apy,
								},
							});
						}
					});
				});
			},
		}),
		{
			name: "alert-storage",
		},
	),
);
