/** @format */

"use client";

import { useAccount, useBalance, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
	Wallet,
	Coins,
	ChevronDown,
	Copy,
	ExternalLink,
	LogOut,
} from "lucide-react";
import { formatEther } from "viem";
import { useState } from "react";

export function CustomConnectButton() {
	const { address, isConnected, chain } = useAccount();
	const { data: balance } = useBalance({ address });
	const { disconnect } = useDisconnect();
	const [showDropdown, setShowDropdown] = useState(false);

	const truncateAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const copyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address);
		}
	};

	const viewOnExplorer = () => {
		if (address && chain?.blockExplorers?.default) {
			window.open(
				`${chain.blockExplorers.default.url}/address/${address}`,
				"_blank",
			);
		}
	};

	if (!isConnected) {
		return (
			<ConnectButton.Custom>
				{({ openConnectModal, mounted }) => {
					return (
						<div>
							<button
								onClick={openConnectModal}
								className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold border border-blue-500/30 cursor-pointer"
								type="button">
								<Wallet size={20} />
								Connect Wallet
							</button>
						</div>
					);
				}}
			</ConnectButton.Custom>
		);
	}

	return (
		<div className="relative">
			<div className="flex items-center gap-3">
				{/* Network & Balance Info */}
				{balance && (
					<div className="hidden sm:flex items-center gap-2 bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
						<Coins
							size={14}
							className="text-yellow-400"
						/>
						<span className="font-medium text-sm">
							{parseFloat(formatEther(balance.value)).toFixed(3)}
						</span>
						<span className="text-gray-400 text-xs">{balance.symbol}</span>
					</div>
				)}

				{/* Connected Wallet Button */}
				<button
					onClick={() => setShowDropdown(!showDropdown)}
					className="flex items-center gap-3 bg-gray-800/80 border border-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm cursor-pointer group"
					type="button">
					<div className="flex items-center gap-2">
						{/* Network Indicator Dot */}
						<div
							className="w-2 h-2 rounded-full"
							style={{
								backgroundColor:
									chain?.id === 1
										? "#3cba54"
										: chain?.id === 137
										? "#8247e5"
										: chain?.id === 42161
										? "#28a0f0"
										: chain?.id === 10
										? "#ff0420"
										: "#666",
							}}
						/>

						{/* Address Display */}
						<span className="font-medium text-green-400 text-sm">
							{address ? truncateAddress(address) : "Connected"}
						</span>
					</div>

					<ChevronDown
						size={16}
						className={`text-gray-400 group-hover:text-white transition-all duration-200 ${
							showDropdown ? "rotate-180" : ""
						}`}
					/>
				</button>
			</div>

			{/* Custom Dropdown */}
			{showDropdown && (
				<div className="absolute top-full right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
					{/* Wallet Info */}
					<div className="p-4 border-b border-gray-700">
						<div className="flex items-center gap-3 mb-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
								<Wallet
									size={16}
									className="text-white"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-400">Connected</p>
								<p className="text-white font-medium text-sm truncate">
									{address ? truncateAddress(address) : ""}
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="p-2">
						<button
							onClick={copyAddress}
							className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 cursor-pointer">
							<Copy size={16} />
							<span className="text-sm">Copy Address</span>
						</button>

						<button
							onClick={viewOnExplorer}
							className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-200 cursor-pointer">
							<ExternalLink size={16} />
							<span className="text-sm">View on Explorer</span>
						</button>

						<button
							onClick={() => {
								disconnect();
								setShowDropdown(false);
							}}
							className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 cursor-pointer">
							<LogOut size={16} />
							<span className="text-sm">Disconnect</span>
						</button>
					</div>
				</div>
			)}

			{/* Backdrop */}
			{showDropdown && (
				<div
					className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 cursor-pointer"
					onClick={() => setShowDropdown(false)}
				/>
			)}
		</div>
	);
}
