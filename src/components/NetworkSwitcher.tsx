/** @format */

// components/NetworkSwitcher.tsx
"use client";

import { useState, useEffect } from "react";
import { useChainId, useChains, useSwitchChain } from "wagmi";
import { ChevronDown, Check } from "lucide-react";

export function NetworkSwitcher() {
	const [mounted, setMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const chainId = useChainId();
	const chains = useChains();
	const { switchChain } = useSwitchChain();

	useEffect(() => {
		setMounted(true);
	}, []);

	// Get current chain name
	const currentChain = chains.find((chain) => chain.id === chainId);

	// Show loading state during SSR
	if (!mounted) {
		return (
			<div className="relative">
				<button className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg animate-pulse">
					<div className="w-4 h-4 bg-gray-700 rounded-full"></div>
					<div className="w-16 h-4 bg-gray-700 rounded"></div>
					<ChevronDown className="h-4 w-4 text-gray-400" />
				</button>
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer">
				<div className="w-2 h-2 bg-green-400 rounded-full"></div>
				<span className="text-sm font-medium">
					{currentChain?.name || "Unsupported"}
				</span>
				<ChevronDown className="h-4 w-4 text-gray-400" />
			</button>

			{isOpen && (
				<div className="absolute top-12 right-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
					<div className="p-2">
						{chains.map((chain) => (
							<button
								key={chain.id}
								onClick={() => {
									switchChain({ chainId: chain.id });
									setIsOpen(false);
								}}
								disabled={chain.id === chainId}
								className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
									chain.id === chainId
										? "bg-blue-500 text-white"
										: "text-gray-300 hover:bg-gray-800"
								} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}>
								<span>{chain.name}</span>
								{chain.id === chainId && <Check className="h-4 w-4" />}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
