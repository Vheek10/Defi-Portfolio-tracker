/** @format */

// types/alerts.ts
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
		// Price alerts
		token?: string;
		targetPrice?: number;
		condition?: "above" | "below" | "change";
		changePercent?: number;

		// Portfolio alerts
		portfolioValue?: number;
		threshold?: number;

		// Gas alerts
		gasPrice?: number;
		network?: string;

		// Yield alerts
		protocol?: string;
		minAPY?: number;

		// Security alerts
		transactionType?: string;
		riskLevel?: "low" | "medium" | "high";
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
