/** @format */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SimpleWeb3Provider } from "@/providers/SimpleWeb3Provider";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DeFi Portfolio Tracker - Multi-Chain Asset Management",
	description:
		"Track, analyze, and optimize your DeFi investments across multiple chains with real-time analytics and smart alerts.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className="dark">
			<body className={`${inter.className} bg-black text-white`}>
				<SimpleWeb3Provider>
					<Header />
					<main className="min-h-screen">{children}</main>
				</SimpleWeb3Provider>
			</body>
		</html>
	);
}
