/** @format */

// app/layout.tsx or pages/_app.tsx
"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi"; // Your wagmi config
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</WagmiProvider>
			</body>
		</html>
	);
}
