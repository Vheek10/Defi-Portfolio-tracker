/** @format */

"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
	mainnet,
	polygon,
	arbitrum,
	optimism,
	base,
	bsc,
	avalanche,
} from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

// All supported chains
const supportedChains = [
	mainnet,
	polygon,
	arbitrum,
	optimism,
	base,
	bsc,
	avalanche,
];

// Simple config without complex providers
const config = createConfig({
	chains: supportedChains,
	connectors: [
		injected(),
		metaMask(),
		walletConnect({
			projectId:
				process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[arbitrum.id]: http(),
		[optimism.id]: http(),
		[base.id]: http(),
		[bsc.id]: http(),
		[avalanche.id]: http(),
	},
});

const queryClient = new QueryClient();

interface SimpleWeb3ProviderProps {
	children: ReactNode;
}

export function SimpleWeb3Provider({ children }: SimpleWeb3ProviderProps) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
