/** @format */

// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
	chains: [mainnet, polygon, optimism, arbitrum],
	connectors: [
		injected(),
		metaMask(),
		walletConnect({
			projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[optimism.id]: http(),
		[arbitrum.id]: http(),
	},
});
