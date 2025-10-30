/** @format */

import { useAccount, useBalance, useBlockNumber } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";

export function usePortfolioData() {
	const { address } = useAccount();
	const { data: blockNumber } = useBlockNumber({ watch: true });

	// Native token balance
	const { data: nativeBalance, isLoading: balanceLoading } = useBalance({
		address,
		query: {
			refetchInterval: 10000,
		},
	});

	// Mock portfolio data - in real app, you'd fetch from DeFi protocols
	const { data: portfolioValue, isLoading: portfolioLoading } = useQuery({
		queryKey: ["portfolio", address, blockNumber],
		queryFn: async () => {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (!address) return 0;

			// Mock portfolio calculation
			const baseValue = nativeBalance
				? parseFloat(formatEther(nativeBalance.value)) * 2500
				: 0;
			const randomGrowth = 1 + (Math.random() * 0.1 - 0.05); // ±5% change

			return baseValue * randomGrowth;
		},
		enabled: !!address,
		refetchInterval: 30000, // Refetch every 30 seconds
	});

	return {
		address,
		nativeBalance,
		portfolioValue,
		isLoading: balanceLoading || portfolioLoading,
		blockNumber,
	};
}
