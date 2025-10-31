/** @format */

// hooks/usePortfolioAnalytics.ts
import { useState, useEffect, useMemo } from "react";
import {
	HistoricalData,
	PerformanceMetrics,
	AssetAllocation,
	RiskMetrics,
} from "@/types/analytics";

export function usePortfolioAnalytics(portfolioData: any, realBalances: any[]) {
	const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
	const [loading, setLoading] = useState(false);

	// Calculate performance metrics
	const performanceMetrics = useMemo((): PerformanceMetrics => {
		if (historicalData.length < 2) {
			return {
				totalReturn: 0,
				dailyReturn: 0,
				weeklyReturn: 0,
				monthlyReturn: 0,
				annualizedReturn: 0,
				volatility: 0,
				sharpeRatio: 0,
				maxDrawdown: 0,
				currentDrawdown: 0,
			};
		}

		const currentValue = historicalData[historicalData.length - 1]?.value || 0;
		const initialValue = historicalData[0]?.value || 1;
		const dailyReturns: number[] = [];

		// Calculate daily returns
		for (let i = 1; i < historicalData.length; i++) {
			const prevValue = historicalData[i - 1].value;
			const currentValue = historicalData[i].value;
			const dailyReturn = (currentValue - prevValue) / prevValue;
			dailyReturns.push(dailyReturn);
		}

		// Total return
		const totalReturn = ((currentValue - initialValue) / initialValue) * 100;

		// Average daily return and volatility
		const avgDailyReturn =
			dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
		const variance =
			dailyReturns.reduce(
				(acc, ret) => acc + Math.pow(ret - avgDailyReturn, 2),
				0,
			) / dailyReturns.length;
		const volatility = Math.sqrt(variance) * Math.sqrt(365); // Annualized

		// Sharpe ratio (assuming 0% risk-free rate for crypto)
		const sharpeRatio =
			volatility > 0 ? (avgDailyReturn * 365) / volatility : 0;

		// Drawdown calculation
		let maxDrawdown = 0;
		let peak = historicalData[0].value;

		historicalData.forEach((data) => {
			if (data.value > peak) peak = data.value;
			const drawdown = (peak - data.value) / peak;
			maxDrawdown = Math.max(maxDrawdown, drawdown);
		});

		const currentPeak = Math.max(...historicalData.map((d) => d.value));
		const currentDrawdown = (currentPeak - currentValue) / currentPeak;

		return {
			totalReturn,
			dailyReturn: dailyReturns[dailyReturns.length - 1] * 100 || 0,
			weeklyReturn:
				((currentValue -
					historicalData[Math.max(0, historicalData.length - 7)]?.value) /
					historicalData[Math.max(0, historicalData.length - 7)]?.value) *
					100 || 0,
			monthlyReturn: totalReturn, // Simplified
			annualizedReturn:
				(Math.pow(1 + totalReturn / 100, 365 / historicalData.length) - 1) *
				100,
			volatility: volatility * 100,
			sharpeRatio,
			maxDrawdown: maxDrawdown * 100,
			currentDrawdown: currentDrawdown * 100,
		};
	}, [historicalData]);

	// Calculate asset allocation
	const assetAllocation = useMemo((): AssetAllocation[] => {
		const totalValue = realBalances.reduce(
			(sum, token) => sum + (token.quote || 0),
			0,
		);

		return realBalances
			.filter((token) => token.quote > 0)
			.map((token) => {
				const percentage = (token.quote / totalValue) * 100;
				let category: AssetAllocation["category"] = "crypto";

				// Simple categorization
				if (
					token.contract_ticker_symbol === "USDC" ||
					token.contract_ticker_symbol === "USDT" ||
					token.contract_ticker_symbol === "DAI"
				) {
					category = "stablecoin";
				} else if (
					token.contract_name?.toLowerCase().includes("stake") ||
					token.contract_name?.toLowerCase().includes("yield")
				) {
					category = "defi";
				}

				return {
					symbol: token.contract_ticker_symbol,
					percentage,
					value: token.quote,
					category,
				};
			})
			.sort((a, b) => b.percentage - a.percentage);
	}, [realBalances]);

	// Calculate risk metrics
	const riskMetrics = useMemo((): RiskMetrics => {
		// Simplified risk calculations
		const portfolioValue = realBalances.reduce(
			(sum, token) => sum + (token.quote || 0),
			0,
		);
		const var95 = portfolioValue * 0.05; // 5% VaR for demonstration

		return {
			var95,
			expectedShortfall: var95 * 1.2, // ES is typically worse than VaR
			portfolioBeta: 1.2, // Crypto generally has high beta
			correlationMatrix: {
				"BTC-ETH": 0.75,
				"BTC-USDC": 0.1,
				"ETH-USDC": 0.15,
			},
		};
	}, [realBalances]);

	// Fetch historical data (mock for now)
	useEffect(() => {
		if (realBalances.length > 0) {
			setLoading(true);
			// Simulate API call
			setTimeout(() => {
				const mockHistoricalData: HistoricalData[] = [];
				const baseValue = realBalances.reduce(
					(sum, token) => sum + (token.quote || 0),
					0,
				);

				// Generate 30 days of historical data
				for (let i = 30; i >= 0; i--) {
					const date = new Date();
					date.setDate(date.getDate() - i);

					// Add some random variation
					const variation = (Math.random() - 0.5) * 0.1; // ±5% daily variation
					const value = baseValue * (1 + variation * (i / 30));

					mockHistoricalData.push({
						timestamp: date.getTime(),
						value,
						assets: {
							ETH: value * 0.4 * (1 + variation),
							BTC: value * 0.3 * (1 + variation),
							USDC: value * 0.2,
							MATIC: value * 0.1 * (1 + variation),
						},
					});
				}

				setHistoricalData(mockHistoricalData);
				setLoading(false);
			}, 1000);
		}
	}, [realBalances]);

	return {
		historicalData,
		performanceMetrics,
		assetAllocation,
		riskMetrics,
		loading,
	};
}
