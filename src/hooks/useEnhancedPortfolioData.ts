/** @format */

"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

export function useEnhancedPortfolioData() {
	const { address, isConnected } = useAccount();
	const [portfolioData, setPortfolioData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [defiData, setDefiData] = useState<any>(null);

	useEffect(() => {
		if (isConnected && address) {
			fetchEnhancedData();
		} else {
			setLoading(false);
		}
	}, [isConnected, address]);

	const fetchEnhancedData = async () => {
		if (!address) return;

		setLoading(true);
		try {
			const [covalentResponse, defillamaResponse, thegraphResponse] =
				await Promise.all([
					fetch(`/api/covalent?address=${address}`).then((res) => res.json()),
					fetch(`/api/defillama?address=${address}`).then((res) => res.json()),
					fetch(`/api/thegraph?address=${address}`).then((res) => res.json()),
				]);

			const enhancedData = {
				covalent: covalentResponse.success ? covalentResponse : null,
				defillama: defillamaResponse.success ? defillamaResponse : null,
				thegraph: thegraphResponse.success ? thegraphResponse : null,
				lastUpdated: new Date().toISOString(),
			};

			setPortfolioData(enhancedData);
			setDefiData(defillamaResponse);
		} catch (error) {
			console.error("Error fetching enhanced data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Calculate real portfolio value from Covalent data
	const realPortfolioValue = portfolioData?.covalent?.total_value || 0;

	// Get real balances from Covalent
	const realBalances = portfolioData?.covalent?.balances || [];

	// Get DeFi opportunities from DeFiLlama
	const defiOpportunities = defiData?.yields || [];

	return {
		portfolioData,
		loading,
		refetch: fetchEnhancedData,
		isConnected,
		address,
		realPortfolioValue,
		realBalances,
		defiOpportunities,
		chainBreakdown: portfolioData?.covalent?.chain_breakdown || {},
		uniswapPositions: portfolioData?.thegraph?.uniswapV3?.positions || [],
	};
}
