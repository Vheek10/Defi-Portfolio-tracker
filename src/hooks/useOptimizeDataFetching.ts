/** @format */

// hooks/useOptimizedDataFetching.ts
export function useOptimizedDataFetching(address: string) {
	const { data, error } = useSWR(address ? `/api/portfolio/${address}` : null, {
		refreshInterval: 30000, // 30 seconds
		dedupingInterval: 10000, // 10 seconds
	});

	return { data, error, isLoading: !data && !error };
}
