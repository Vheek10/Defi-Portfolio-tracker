/** @format */

"use client";

import { useAccount, useBalance } from "wagmi";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

export function usePortfolioData() {
	const { address, isConnected } = useAccount();
	const { data: nativeBalance } = useBalance({ address });
	const [portfolioData, setPortfolioData] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isConnected && address) {
			fetchRealPortfolioData();
		}
	}, [isConnected, address]);

	const fetchRealPortfolioData = async () => {
		setLoading(true);
		try {
			// Mock API call - replace with real endpoints
			const response = await fetch(`/api/portfolio/${address}`);
			const data = await response.json();
			setPortfolioData(data);
		} catch (error) {
			console.error("Error fetching portfolio data:", error);
		} finally {
			setLoading(false);
		}
	};

	return {
		portfolioData,
		loading,
		nativeBalance: nativeBalance
			? {
					value: parseFloat(formatEther(nativeBalance.value)),
					symbol: nativeBalance.symbol,
			  }
			: null,
		refetch: fetchRealPortfolioData,
	};
}
