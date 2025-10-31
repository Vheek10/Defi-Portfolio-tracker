/** @format */

// types/analytics.ts
export interface HistoricalData {
	timestamp: number;
	value: number;
	assets: { [symbol: string]: number };
}

export interface PerformanceMetrics {
	totalReturn: number;
	dailyReturn: number;
	weeklyReturn: number;
	monthlyReturn: number;
	annualizedReturn: number;
	volatility: number;
	sharpeRatio: number;
	maxDrawdown: number;
	currentDrawdown: number;
}

export interface AssetAllocation {
	symbol: string;
	percentage: number;
	value: number;
	category: "crypto" | "defi" | "stablecoin" | "nft";
}

export interface RiskMetrics {
	var95: number; // Value at Risk 95%
	expectedShortfall: number;
	portfolioBeta: number;
	correlationMatrix: { [pair: string]: number };
}
