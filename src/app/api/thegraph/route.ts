/** @format */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");

	if (!address) {
		return NextResponse.json({ error: "Address is required" }, { status: 400 });
	}

	try {
		// Example: Uniswap V3 positions for the address
		const UNISWAP_V3_GRAPH_URL =
			"https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

		const uniswapQuery = {
			query: `
        query UserPositions($owner: String!) {
          positions(where: { owner: $owner }) {
            id
            owner
            pool {
              id
              token0 {
                symbol
                name
              }
              token1 {
                symbol
                name
              }
              feeTier
            }
            liquidity
            depositedToken0
            depositedToken1
            collectedFeesToken0
            collectedFeesToken1
          }
        }
      `,
			variables: { owner: address.toLowerCase() },
		};

		const [uniswapResponse] = await Promise.all([
			fetch(UNISWAP_V3_GRAPH_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(uniswapQuery),
			}),
		]);

		if (!uniswapResponse.ok) {
			throw new Error("Failed to fetch The Graph data");
		}

		const uniswapData = await uniswapResponse.json();

		return NextResponse.json({
			success: true,
			uniswapV3: {
				positions: uniswapData.data?.positions || [],
			},
		});
	} catch (error) {
		console.error("The Graph API error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch on-chain data" },
			{ status: 500 },
		);
	}
}
