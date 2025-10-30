/** @format */

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";

// Demo project ID - replace with your actual WalletConnect project ID
const projectId =
	process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id-123";

export const config = getDefaultConfig({
	appName: "DeFi Portfolio Tracker",
	projectId: projectId,
	chains: [mainnet, polygon, arbitrum, optimism, base],
	transports: {
		[mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/demo"),
		[polygon.id]: http("https://polygon-rpc.com"),
		[arbitrum.id]: http("https://arb1.arbitrum.io/rpc"),
		[optimism.id]: http("https://mainnet.optimism.io"),
		[base.id]: http("https://mainnet.base.org"),
	},
	ssr: true,
});
