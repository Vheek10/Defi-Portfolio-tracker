/** @format */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");

	if (!address) {
		return NextResponse.json({ error: "Address is required" }, { status: 400 });
	}

	try {
		// Get DeFiLlama protocols and yields
		const [protocolsResponse, yieldsResponse] = await Promise.all([
			fetch("https://api.llama.fi/protocols"),
			fetch("https://yields.llama.fi/pools"),
		]);

		if (!protocolsResponse.ok || !yieldsResponse.ok) {
			throw new Error("Failed to fetch DeFiLlama data");
		}

		const protocols = await protocolsResponse.json();
		const yields = await yieldsResponse.json();

		// Filter top protocols and yields
		const topProtocols = protocols
			.filter((p: any) => p.tvl > 1000000) // Over $1M TVL
			.slice(0, 20)
			.map((protocol: any) => ({
				name: protocol.name,
				tvl: protocol.tvl,
				chain: protocol.chain,
				category: protocol.category,
				change_1d: protocol.change_1d,
			}));

		const topYields = yields.data
			.filter((y: any) => y.apy > 5 && y.tvl > 100000) // APY > 5% and TVL > $100k
			.slice(0, 15)
			.map((yieldObj: any) => ({
				symbol: yieldObj.symbol,
				chain: yieldObj.chain,
				project: yieldObj.project,
				apy: yieldObj.apy,
				tvl: yieldObj.tvl,
			}));

		return NextResponse.json({
			success: true,
			protocols: topProtocols,
			yields: topYields,
		});
	} catch (error) {
		console.error("DeFiLlama API error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch DeFi data" },
			{ status: 500 },
		);
	}
}
