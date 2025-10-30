/** @format */

"use client";

import { useState } from "react";
import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { ChevronDown, Check, Wifi, AlertCircle } from "lucide-react";
import { useNetworkHandler, getNetworkInfo } from "@/hooks/useNetworkHandler";

export function NetworkSwitcher() {
	const [showNetworks, setShowNetworks] = useState(false);
	const { chain } = useAccount();
	const chainId = useChainId();
	const { switchChain, isPending, error } = useSwitchChain();
	const { isSupportedChain } = useNetworkHandler();

	const currentNetwork = getNetworkInfo(chainId);
	const currentChainId = chainId || 1;
	const isCurrentSupported = isSupportedChain(currentChainId);

	const handleNetworkSwitch = (newChainId: number) => {
		switchChain({ chainId: newChainId });
		setShowNetworks(false);
	};

	const supportedNetworks = [
		{ id: 1, ...getNetworkInfo(1) },
		{ id: 137, ...getNetworkInfo(137) },
		{ id: 42161, ...getNetworkInfo(42161) },
		{ id: 10, ...getNetworkInfo(10) },
		{ id: 8453, ...getNetworkInfo(8453) },
		{ id: 56, ...getNetworkInfo(56) },
		{ id: 43114, ...getNetworkInfo(43114) },
	];

	return (
		<div className="relative">
			<button
				onClick={() => setShowNetworks(!showNetworks)}
				className={`
          flex items-center gap-2 bg-gray-800/80 border text-white px-3 py-2 rounded-lg 
          hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm cursor-pointer
          ${isCurrentSupported ? "border-gray-700" : "border-orange-500/50"}
          min-w-[120px] justify-between
        `}
				disabled={isPending}>
				<div className="flex items-center gap-2">
					{!isCurrentSupported ? (
						<AlertCircle
							size={16}
							className="text-orange-400"
						/>
					) : (
						<Wifi
							size={16}
							style={{ color: currentNetwork.color }}
						/>
					)}
					<span className="text-sm font-medium">
						{isPending ? "Switching..." : currentNetwork.name}
					</span>
				</div>
				<ChevronDown
					size={14}
					className={`text-gray-400 transition-transform duration-200 ${
						showNetworks ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Error Toast */}
			{error && (
				<div className="absolute top-full mt-2 right-0 bg-red-500/90 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
					Failed to switch network
				</div>
			)}

			{/* Networks Dropdown */}
			{showNetworks && (
				<div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
					{/* Header */}
					<div className="p-3 border-b border-gray-700">
						<h3 className="text-white font-semibold text-sm">Select Network</h3>
						<p className="text-gray-400 text-xs mt-1">
							Switch between supported chains
						</p>
					</div>

					{/* Network List */}
					<div className="max-h-80 overflow-y-auto">
						{supportedNetworks.map((network) => (
							<button
								key={network.id}
								onClick={() => handleNetworkSwitch(network.id)}
								className={`
                  w-full flex items-center gap-3 p-3 transition-all duration-200 cursor-pointer
                  hover:bg-gray-800/50 border-l-2
                  ${
										network.id === currentChainId
											? "bg-gray-800/30 border-l-blue-500"
											: "border-l-transparent"
									}
                `}>
								{/* Network Icon */}
								<div
									className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
									style={{ backgroundColor: network.color }}>
									{network.name.charAt(0)}
								</div>

								{/* Network Info */}
								<div className="flex-1 text-left">
									<div className="text-white font-medium text-sm">
										{network.name}
									</div>
									<div className="text-gray-400 text-xs">
										Chain ID: {network.id}
									</div>
								</div>

								{/* Current Network Indicator */}
								{network.id === currentChainId && (
									<Check
										size={16}
										className="text-green-400"
									/>
								)}
							</button>
						))}
					</div>

					{/* Footer */}
					<div className="p-3 border-t border-gray-700 bg-gray-800/50">
						<p className="text-gray-400 text-xs text-center">
							{chain?.name || "Ethereum"} Network
						</p>
					</div>
				</div>
			)}

			{/* Backdrop */}
			{showNetworks && (
				<div
					className="fixed inset-0 z-40 cursor-pointer"
					onClick={() => setShowNetworks(false)}
				/>
			)}
		</div>
	);
}
