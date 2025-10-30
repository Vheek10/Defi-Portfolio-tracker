/** @format */

import { createClient } from "viem";
import { mainnet } from "wagmi/chains";

export const publicClient = createClient({
	chain: mainnet,
	transport: http(
		process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
			"https://eth-mainnet.g.alchemy.com/v2/demo",
	),
});
