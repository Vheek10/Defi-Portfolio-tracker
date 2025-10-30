/** @format */

import { NextResponse } from "next/server";

const COVALENT_API_KEY = process.env.COVALENT_API_KEY || "ckey_demo"; // Get from https://www.covalenthq.com/

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");

	if (!address) {
		return NextResponse.json({ error: "Address is required" }, { status: 400 });
	}

	try {
		// Supported chains for multi-chain balance checking
		const chains = [
			{ id: 1, name: "eth-mainnet" },
			{ id: 137, name: "matic-mainnet" },
			{ id: 42161, name: "arbitrum-mainnet" },
			{ id: 10, name: "optimism-mainnet" },
			{ id: 43114, name: "avalanche-mainnet" },
			{ id: 56, name: "bsc-mainnet" },
		];

		// Fetch balances from all chains
		const balancePromises = chains.map((chain) =>
			fetch(
				`https://api.covalenthq.com/v1/${chain.name}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}`,
			)
				.then((res) => res.json())
				.then((data) => ({
					chain: chain.name,
					chainId: chain.id,
					data: data.data,
				}))
				.catch((error) => ({
					chain: chain.name,
					chainId: chain.id,
					error: error.message,
				})),
		);

		const chainBalances = await Promise.all(balancePromises);

		// Process and combine balances
		const allBalances = chainBalances.flatMap((chainData) => {
			if (chainData.error || !chainData.data?.items) return [];

			return chainData.data.items
				.filter((token: any) => token.balance > 0 || token.quote > 1) // Filter out dust
				.map((token: any) => ({
					chain: chainData.chain,
					chainId: chainData.chainId,
					contract_address: token.contract_address,
					contract_name: token.contract_name,
					contract_ticker_symbol: token.contract_ticker_symbol,
					balance: token.balance,
					balance_formatted: (
						token.balance / Math.pow(10, token.contract_decimals)
					).toFixed(6),
					quote: token.quote,
					quote_rate: token.quote_rate,
					logo_url: token.logo_url,
				}));
		});

		// Calculate totals
		const totalValue = allBalances.reduce(
			(sum, token) => sum + (token.quote || 0),
			0,
		);
		const chainBreakdown = allBalances.reduce((acc: any, token) => {
			if (!acc[token.chain]) acc[token.chain] = 0;
			acc[token.chain] += token.quote || 0;
			return acc;
		}, {});

		return NextResponse.json({
			success: true,
			address,
			total_value: totalValue,
			chain_breakdown: chainBreakdown,
			balances: allBalances,
			last_updated: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Covalent API error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch chain balances" },
			{ status: 500 },
		);
	}
}
