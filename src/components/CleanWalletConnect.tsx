/** @format */

"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatEther } from "viem";
import {
	Wallet,
	Coins,
	ChevronDown,
	Copy,
	ExternalLink,
	LogOut,
	User,
	Wifi,
} from "lucide-react";

// Network data with colors
const networks = {
	1: { name: "Ethereum", color: "#627eea" },
	137: { name: "Polygon", color: "#8247e5" },
	42161: { name: "Arbitrum", color: "#28a0f0" },
	10: { name: "Optimism", color: "#ff0420" },
	8453: { name: "Base", color: "#0052ff" },
	56: { name: "BNB Chain", color: "#f0b90b" },
	43114: { name: "Avalanche", color: "#e84142" },
};

export function CleanWalletConnect() {
	// ADD THIS EXPORT
	const [showConnectModal, setShowConnectModal] = useState(false);
	const [showAccountModal, setShowAccountModal] = useState(false);

	const { address, isConnected, chain } = useAccount();
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { data: balance } = useBalance({ address });

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

	const handleConnect = (connector: any) => {
		connect({ connector });
		setShowConnectModal(false);
	};

	// Not connected state
	if (!isConnected) {
		return (
			<>
				<button
					onClick={() => setShowConnectModal(true)}
					className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold border border-blue-500/30 cursor-pointer">
					<Wallet size={20} />
					Connect Wallet
				</button>

				{/* Connect Modal */}
				{showConnectModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop */}
						<div
							className="absolute inset-0 bg-black/70 backdrop-blur-sm"
							onClick={() => setShowConnectModal(false)}
						/>

						{/* Modal */}
						<div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-white">Connect Wallet</h2>
								<button
									onClick={() => setShowConnectModal(false)}
									className="text-gray-400 hover:text-white transition-colors cursor-pointer">
									✕
								</button>
							</div>

							<div className="space-y-3">
								{connectors.map((connector) => (
									<button
										key={connector.uid}
										onClick={() => handleConnect(connector)}
										className="w-full flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 cursor-pointer group">
										<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
											{connector.name === "MetaMask" && "🦊"}
											{connector.name === "WalletConnect" && "⚡"}
											{connector.name === "Injected" && "🌐"}
										</div>
										<div className="text-left">
											<div className="text-white font-semibold">
												{connector.name}
											</div>
											<div className="text-gray-400 text-sm">
												Connect with {connector.name}
											</div>
										</div>
									</button>
								))}
							</div>

							<div className="mt-6 text-center">
								<p className="text-gray-400 text-sm">
									By connecting, you agree to our Terms of Service
								</p>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}

	// Connected state
	return (
		<div className="relative">
			<button
				onClick={() => setShowAccountModal(!showAccountModal)}
				className="flex items-center gap-3 bg-gray-800/80 border border-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm cursor-pointer group">
				<div className="flex items-center gap-2">
					{/* Network Indicator */}
					<div
						className="w-2 h-2 rounded-full"
						style={{
							backgroundColor: chain?.id
								? networks[chain.id as keyof typeof networks]?.color ||
								  "#6b7280"
								: "#6b7280",
						}}
					/>

					{/* Balance */}
					{balance && (
						<div className="hidden sm:flex items-center gap-1 text-sm">
							<Coins
								size={14}
								className="text-yellow-400"
							/>
							<span className="font-medium">
								{parseFloat(formatEther(balance.value)).toFixed(3)}
							</span>
						</div>
					)}

					{/* Address */}
					<span className="font-medium text-green-400 text-sm">
						{truncateAddress(address!)}
					</span>
				</div>

				<ChevronDown
					size={16}
					className={`text-gray-400 transition-transform duration-200 ${
						showAccountModal ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Account Modal */}
			{showAccountModal && (
				<div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
					{/* Header */}
					<div className="p-4 border-b border-gray-700">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
								<User
									size={20}
									className="text-white"
								/>
							</div>
							<div className="flex-1">
								<p className="text-white font-semibold">Connected</p>
								<p className="text-gray-400 text-sm font-mono">
									{truncateAddress(address!)}
								</p>
							</div>
						</div>

						{/* Network Info */}
						<div className="mt-3 flex items-center justify-between text-sm">
							<span className="text-gray-400">Network</span>
							<div className="flex items-center gap-2">
								<Wifi
									size={14}
									style={{
										color: chain?.id
											? networks[chain.id as keyof typeof networks]?.color ||
											  "#6b7280"
											: "#6b7280",
									}}
								/>
								<span className="text-white font-medium">
									{chain?.name || "Unknown"}
								</span>
							</div>
						</div>

						{/* Balance Info */}
						{balance && (
							<div className="mt-2 flex items-center justify-between text-sm">
								<span className="text-gray-400">Balance</span>
								<span className="text-white font-medium">
									{parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
									{balance.symbol}
								</span>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="p-2">
						<button
							onClick={copyAddress}
							className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white cursor-pointer">
							<Copy size={16} />
							<span>Copy Address</span>
						</button>

						<button
							onClick={viewOnExplorer}
							className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-white cursor-pointer">
							<ExternalLink size={16} />
							<span>View on Explorer</span>
						</button>

						<button
							onClick={() => {
								disconnect();
								setShowAccountModal(false);
							}}
							className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 cursor-pointer">
							<LogOut size={16} />
							<span>Disconnect</span>
						</button>
					</div>
				</div>
			)}

			{/* Backdrop */}
			{showAccountModal && (
				<div
					className="fixed inset-0 z-40 cursor-pointer"
					onClick={() => setShowAccountModal(false)}
				/>
			)}
		</div>
	);
}
