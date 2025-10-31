/** @format */

// stores/portfolioStore.ts
import { create } from "zustand";

interface PortfolioStore {
	balances: TokenBalance[];
	portfolioValue: number;
	transactions: Transaction[];
	isLoading: boolean;
	refreshData: () => Promise<void>;
	setBalances: (balances: TokenBalance[]) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
	balances: [],
	portfolioValue: 0,
	transactions: [],
	isLoading: false,
	refreshData: async () => {
		set({ isLoading: true });
		// Fetch real data
		set({ isLoading: false });
	},
	setBalances: (balances) => set({ balances }),
}));
