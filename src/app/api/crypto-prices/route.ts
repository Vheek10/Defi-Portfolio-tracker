/** @format */

import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum,matic-network,arbitrum,optimism,chainlink,uniswap,aave&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h",
			{
				headers: {
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch prices");
		}

		const data = await response.json();

		// Transform the data to our format
		const prices = data.reduce((acc: any, coin: any) => {
			acc[coin.symbol.toLowerCase()] = {
				price: coin.current_price,
				change24h: coin.price_change_percentage_24h,
				marketCap: coin.market_cap,
				volume: coin.total_volume,
			};
			return acc;
		}, {});

		return NextResponse.json({ success: true, prices });
	} catch (error) {
		console.error("Error fetching crypto prices:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch prices" },
			{ status: 500 },
		);
	}
}
