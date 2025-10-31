/** @format */

// components/WalletConnect.tsx
"use client";

import {
	useAccount,
	useConnect,
	useDisconnect,
	useBalance,
	useChainId,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Wallet, LogOut, User, Copy, CheckCircle, Network } from "lucide-react";
import { useState } from "react";
import { formatEther } from "viem";

export function WalletConnect() {
	const { address, isConnected } = useAccount();
	const { connect, error: connectError } = useConnect({
		connector: new InjectedConnector(),
	});
	const { disconnect } = useDisconnect();
	const { data: balance } = useBalance({ address });
	const chainId = useChainId();
	const [copied, setCopied] = useState(false);

	const handleCopyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const getNetworkName = (chainId: number) => {
		const networks: { [key: number]: string } = {
			1: "Ethereum",
			137: "Polygon",
			42161: "Arbitrum",
			10: "Optimism",
			8453: "Base",
			56: "BNB Chain",
			43114: "Avalanche",
			11155111: "Sepolia",
		};
		return networks[chainId] || `Chain ${chainId}`;
	};

	const getNetworkColor = (chainId: number) => {
		const colors: { [key: number]: string } = {
			1: "text-green-400",
			137: "text-purple-400",
			42161: "text-blue-400",
			10: "text-red-400",
			8453: "text-blue-300",
			56: "text-yellow-400",
			43114: "text-red-500",
		};
		return colors[chainId] || "text-gray-400";
	};

	if (!isConnected) {
		return (
			<div className="flex flex-col items-center gap-4 p-6">
				<div className="text-center">
					<Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
					<h3 className="text-lg font-semibold text-white mb-2">
						Connect Your Wallet
					</h3>
					<p className="text-gray-400 text-sm">
						Connect your wallet to start using the application
					</p>
				</div>

				{connectError && (
					<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
						Error: {connectError.message}
					</div>
				)}

				<button
					onClick={() => connect()}
					className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 cursor-pointer">
					<Wallet size={18} />
					Connect Wallet
				</button>

				{/* Demo Info */}
				<div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
					<h4 className="text-sm font-medium text-white mb-2">Demo Info</h4>
					<p className="text-xs text-gray-400">
						This is a demo interface. Connect with a Web3 wallet like MetaMask
						to interact with the application.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-white flex items-center gap-2">
					<User size={20} />
					Wallet Connected
				</h3>
				<button
					onClick={() => disconnect()}
					className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
					<LogOut size={16} />
					Disconnect
				</button>
			</div>

			{/* Address */}
			<div className="mb-4">
				<label className="text-gray-400 text-sm font-medium mb-2 block">
					Address
				</label>
				<div className="flex items-center gap-2">
					<code className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm">
						{formatAddress(address!)}
					</code>
					<button
						onClick={handleCopyAddress}
						className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
						{copied ? (
							<CheckCircle
								size={16}
								className="text-green-400"
							/>
						) : (
							<Copy size={16} />
						)}
						{copied ? "Copied!" : "Copy"}
					</button>
				</div>
			</div>

			{/* Balance */}
			{balance && (
				<div className="mb-4">
					<label className="text-gray-400 text-sm font-medium mb-2 block">
						Balance
					</label>
					<div className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2">
						<div className="flex items-center justify-between">
							<span className="text-white font-medium">
								{parseFloat(formatEther(balance.value)).toFixed(4)}
							</span>
							<span className="text-gray-400 text-sm">{balance.symbol}</span>
						</div>
						{balance.value > 0n && (
							<div className="text-green-400 text-xs mt-1">
								≈ ${(parseFloat(formatEther(balance.value)) * 2800).toFixed(2)}{" "}
								USD
							</div>
						)}
					</div>
				</div>
			)}

			{/* Network Info */}
			<div className="mt-4 pt-4 border-t border-gray-700">
				<div className="flex items-center justify-between text-sm mb-2">
					<span className="text-gray-400">Status</span>
					<span className="text-green-400 font-medium">Connected</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-400">Network</span>
					<div className="flex items-center gap-2">
						<Network
							size={14}
							className={getNetworkColor(chainId)}
						/>
						<span className="text-white font-medium">
							{getNetworkName(chainId)}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-between text-sm mt-2">
					<span className="text-gray-400">Chain ID</span>
					<span className="text-white font-mono">{chainId}</span>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mt-6 grid grid-cols-2 gap-3">
				<button
					onClick={handleCopyAddress}
					className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
					<Copy size={14} />
					Copy Address
				</button>
				<button
					onClick={() => disconnect()}
					className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
					<LogOut size={14} />
					Disconnect
				</button>
			</div>

			{/* Demo Notice */}
			<div className="mt-4 pt-4 border-t border-gray-700">
				<p className="text-xs text-gray-500 text-center">
					Connected to {getNetworkName(chainId)} • Read-only demo
				</p>
			</div>
		</div>
	);
}
