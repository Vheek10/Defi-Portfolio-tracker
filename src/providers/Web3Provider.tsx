/** @format */

"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, Theme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/web3/config";

const queryClient = new QueryClient();

// Custom theme with CSS variables that penetrate shadow DOM
const customTheme = darkTheme({
	accentColor: "#6366f1",
	accentColorForeground: "white",
	borderRadius: "large",
	fontStack: "system",
	overlayBlur: "small",
});

// Enhanced theme with custom styles
const enhancedTheme = {
	...customTheme,
	colors: {
		...customTheme.colors,
		// Additional color overrides
		modalBackground: "rgba(17, 24, 39, 0.95)",
		modalBorder: "rgba(255, 255, 255, 0.1)",
		menuItemBackground: "rgba(255, 255, 255, 0.05)",
	},
	radii: {
		...customTheme.radii,
		menuButton: "12px",
		actionButton: "12px",
		connectButton: "12px",
		modal: "24px",
		modalMobile: "20px",
	},
	shadows: {
		...customTheme.shadows,
		connectButton: "0px 4px 12px rgba(0, 0, 0, 0.4)",
		dialog: "0px 8px 32px rgba(0, 0, 0, 0.6)",
		profileDetailsAction: "0px 2px 6px rgba(0, 0, 0, 0.3)",
		selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.3)",
		selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.3)",
		walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.4)",
	},
	fonts: {
		body: "system-ui, -apple-system, sans-serif",
	},
} as Theme;

interface Web3ProviderProps {
	children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					theme={enhancedTheme}
					coolMode
					modalSize="compact"
					appInfo={{
						appName: "DeFi Portfolio Tracker",
						learnMoreUrl: "https://github.com/Vheek10/defi-portfolio-tracker",
					}}>
					<RainbowKitStyles />
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

// Component to inject global styles for RainbowKit
function RainbowKitStyles() {
	return (
		<style
			jsx
			global>{`
			/* RainbowKit Global Styles - These will penetrate shadow DOM */
			:root {
				--rk-colors-connectButtonBackground: #6366f1;
				--rk-colors-connectButtonBackground-hover: #4f46e5;
				--rk-colors-accentColor: #6366f1;
				--rk-colors-accentColorForeground: #ffffff;
				--rk-colors-actionButtonBorder: rgba(255, 255, 255, 0.1);
				--rk-colors-actionButtonBorderMobile: rgba(255, 255, 255, 0.1);
				--rk-colors-closeButton: rgba(255, 255, 255, 0.8);
				--rk-colors-closeButtonBackground: rgba(255, 255, 255, 0.1);
				--rk-colors-connectButtonText: #ffffff;
				--rk-colors-connectionIndicator: #10b981;
				--rk-colors-error: #ef4444;
				--rk-colors-generalBorder: rgba(255, 255, 255, 0.1);
				--rk-colors-generalBorderDim: rgba(255, 255, 255, 0.05);
				--rk-colors-menuItemBackground: rgba(255, 255, 255, 0.05);
				--rk-colors-modalBackdrop: rgba(0, 0, 0, 0.7);
				--rk-colors-modalBackground: rgba(17, 24, 39, 0.98);
				--rk-colors-modalText: #ffffff;
				--rk-colors-modalTextDim: rgba(255, 255, 255, 0.6);
				--rk-colors-modalTextSecondary: rgba(255, 255, 255, 0.7);
				--rk-colors-profileAction: rgba(255, 255, 255, 0.1);
				--rk-colors-profileActionHover: rgba(255, 255, 255, 0.2);
				--rk-colors-profileForeground: rgba(255, 255, 255, 0.05);
				--rk-colors-selectedOptionBorder: rgba(99, 102, 241, 0.5);
				--rk-colors-standby: #f59e0b;
			}

			/* Global cursor pointers */
			.rk-connect-wallet-option,
			.rk-account-modal__option,
			.rk-chain-selector__option,
			[data-rk] button,
			[data-rk] [role="button"] {
				cursor: pointer !important;
			}

			/* Modal backdrop */
			[data-rk] [aria-modal="true"] {
				backdrop-filter: blur(8px) !important;
			}

			/* Force specific styles that RainbowKit might override */
			.rk-modal {
				border: 1px solid rgba(255, 255, 255, 0.1) !important;
				border-radius: 24px !important;
				background: rgba(17, 24, 39, 0.95) !important;
				backdrop-filter: blur(20px) !important;
				box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
			}

			.rk-connect-wallet-option {
				border: 1px solid rgba(255, 255, 255, 0.1) !important;
				border-radius: 12px !important;
				background: rgba(255, 255, 255, 0.05) !important;
				transition: all 0.2s ease !important;
			}

			.rk-connect-wallet-option:hover {
				background: rgba(255, 255, 255, 0.1) !important;
				border-color: rgba(99, 102, 241, 0.5) !important;
				transform: translateY(-2px) !important;
			}

			.rk-account-modal {
				border: 1px solid rgba(255, 255, 255, 0.1) !important;
				border-radius: 24px !important;
				background: rgba(17, 24, 39, 0.95) !important;
			}

			.rk-account-modal__option {
				border-radius: 8px !important;
				transition: all 0.2s ease !important;
			}

			.rk-account-modal__option:hover {
				background: rgba(255, 255, 255, 0.1) !important;
			}

			/* Text colors */
			[data-rk] {
				color: white !important;
				font-family: system-ui, -apple-system, sans-serif !important;
			}
		`}</style>
	);
}
