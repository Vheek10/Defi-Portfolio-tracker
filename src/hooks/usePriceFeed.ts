/** @format */

// hooks/usePriceFeed.ts
import { useQuery } from "@tanstack/react-query";

export function usePriceFeed(token: string) {
	return useQuery({
		queryKey: ["price", token],
		queryFn: async () => {
			// Integrate with CoinGecko, Uniswap, or your preferred price API
			const response = await fetch(`/api/price/${token}`);
			return response.json();
		},
		refetchInterval: 30000, // Update every 30 seconds
	});
}
