/** @format */

// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
	chains: [mainnet, polygon, arbitrum, optimism, base],
	connectors: [injected(), metaMask()],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[arbitrum.id]: http(),
		[optimism.id]: http(),
		[base.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
