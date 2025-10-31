/** @format */

// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import {
	useAccount,
	useConnect,
	useDisconnect,
	useChainId,
	useSwitchChain,
	useBalance,
} from "wagmi";
import { injected } from "wagmi/connectors";
import {
	Wallet,
	ChevronDown,
	Network,
	User,
	Copy,
	CheckCircle,
	LogOut,
} from "lucide-react";
import { formatEther } from "viem";

// Enhanced Wallet Connect Component with Wagmi
function SimpleWalletConnect() {
	const [mounted, setMounted] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const { address, isConnected, isConnecting } = useAccount();
	const { connect, connectors, error: connectError } = useConnect();
	const { disconnect } = useDisconnect();
	const { data: balance } = useBalance({ address });
	const chainId = useChainId();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const formatAddress = (addr: string) => {
		if (!addr) return "";
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const handleCopyAddress = async () => {
		if (address) {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
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

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			setShowDetails(false);
		};

		if (showDetails) {
			document.addEventListener("click", handleClickOutside);
			return () => document.removeEventListener("click", handleClickOutside);
		}
	}, [showDetails]);

	const handleConnect = () => {
		const injectedConnector = connectors.find(
			(c) => c.id === "injected" || c.name === "MetaMask",
		);
		if (injectedConnector) {
			connect({ connector: injectedConnector });
		}
	};

	if (!mounted) {
		return (
			<div className="w-40 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
		);
	}

	if (isConnecting) {
		return (
			<button
				disabled
				className="flex items-center gap-2 bg-gray-600 text-gray-400 px-4 py-2 rounded-xl transition-all duration-300 cursor-not-allowed">
				<Wallet size={18} />
				<span className="text-sm font-medium">Connecting...</span>
			</button>
		);
	}

	if (isConnected && address) {
		return (
			<div className="relative">
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowDetails(!showDetails);
					}}
					className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-all duration-300 border border-gray-600 cursor-pointer group">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-green-400 rounded-full"></div>
						<span className="text-sm font-medium">
							{formatAddress(address)}
						</span>
					</div>
					<ChevronDown
						size={16}
						className="text-gray-400 group-hover:text-white transition-colors"
					/>
				</button>

				{showDetails && (
					<div
						className="absolute top-12 right-0 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-4"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-white flex items-center gap-2">
								<User size={20} />
								Wallet Connected
							</h3>
							<button
								onClick={() => {
									disconnect();
									setShowDetails(false);
								}}
								className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
								<LogOut size={16} />
								Disconnect
							</button>
						</div>

						<div className="mb-4">
							<label className="text-gray-400 text-sm font-medium mb-2 block">
								Address
							</label>
							<div className="flex items-center gap-2">
								<code className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm">
									{address}
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

						{balance && (
							<div className="mb-4">
								<label className="text-gray-400 text-sm font-medium mb-2 block">
									Balance
								</label>
								<div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
									<div className="flex items-center justify-between">
										<span className="text-white font-medium">
											{parseFloat(formatEther(balance.value)).toFixed(4)}
										</span>
										<span className="text-gray-400 text-sm">
											{balance.symbol}
										</span>
									</div>
									{balance.value > 0n && (
										<div className="text-green-400 text-xs mt-1">
											≈ $
											{(parseFloat(formatEther(balance.value)) * 2800).toFixed(
												2,
											)}{" "}
											USD
										</div>
									)}
								</div>
							</div>
						)}

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

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								onClick={handleCopyAddress}
								className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
								<Copy size={14} />
								Copy Address
							</button>
							<button
								onClick={() => {
									disconnect();
									setShowDetails(false);
								}}
								className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm">
								<LogOut size={14} />
								Disconnect
							</button>
						</div>

						<div className="mt-4 pt-4 border-t border-gray-700">
							<p className="text-xs text-gray-500 text-center">
								Connected to {getNetworkName(chainId)} • Read-only demo
							</p>
						</div>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={handleConnect}
				className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/25">
				<Wallet size={18} />
				<span className="text-sm font-medium">Connect Wallet</span>
			</button>

			{connectError && (
				<div className="absolute top-12 right-0 w-80 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm z-50">
					<strong>Connection Error:</strong> {connectError.message}
				</div>
			)}
		</div>
	);
}

// Enhanced Network Switcher with Wagmi
function SimpleNetworkSwitcher() {
	const [mounted, setMounted] = useState(false);
	const [showNetworks, setShowNetworks] = useState(false);
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { isConnected } = useAccount();

	useEffect(() => {
		setMounted(true);
	}, []);

	const networks = [
		{ id: 1, name: "Ethereum", color: "bg-green-400" },
		{ id: 137, name: "Polygon", color: "bg-purple-400" },
		{ id: 42161, name: "Arbitrum", color: "bg-blue-400" },
		{ id: 10, name: "Optimism", color: "bg-red-400" },
		{ id: 8453, name: "Base", color: "bg-blue-300" },
		{ id: 56, name: "BNB Chain", color: "bg-yellow-400" },
		{ id: 43114, name: "Avalanche", color: "bg-red-500" },
	];

	const currentNetwork =
		networks.find((net) => net.id === chainId) || networks[0];

	useEffect(() => {
		const handleClickOutside = () => {
			setShowNetworks(false);
		};

		if (showNetworks) {
			document.addEventListener("click", handleClickOutside);
			return () => document.removeEventListener("click", handleClickOutside);
		}
	}, [showNetworks]);

	if (!mounted) {
		return (
			<div className="w-28 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
		);
	}

	if (!isConnected) {
		return (
			<button
				disabled
				className="flex items-center gap-2 bg-gray-800 text-gray-500 px-3 py-2 rounded-xl transition-all duration-300 border border-gray-700 cursor-not-allowed">
				<Network
					size={16}
					className="text-gray-500"
				/>
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
					<span className="text-sm font-medium hidden sm:block">
						Connect Wallet
					</span>
				</div>
			</button>
		);
	}

	return (
		<div className="relative">
			<button
				onClick={(e) => {
					e.stopPropagation();
					setShowNetworks(!showNetworks);
				}}
				className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-xl transition-all duration-300 border border-gray-600 cursor-pointer group">
				<Network
					size={16}
					className="text-gray-400"
				/>
				<div className="flex items-center gap-2">
					<div className={`w-2 h-2 rounded-full ${currentNetwork.color}`}></div>
					<span className="text-sm font-medium hidden sm:block">
						{currentNetwork.name}
					</span>
				</div>
				<ChevronDown
					size={16}
					className="text-gray-400 group-hover:text-white transition-colors"
				/>
			</button>

			{showNetworks && (
				<div
					className="absolute top-12 left-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 py-2"
					onClick={(e) => e.stopPropagation()}>
					{networks.map((network) => (
						<button
							key={network.id}
							onClick={() => {
								switchChain({ chainId: network.id });
								setShowNetworks(false);
							}}
							className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer text-left">
							<div className={`w-2 h-2 rounded-full ${network.color}`}></div>
							<span className="text-white text-sm font-medium">
								{network.name}
							</span>
							{chainId === network.id && (
								<div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// Main Header Component
export function Header() {
	const [mounted, setMounted] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		setMounted(true);

		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!mounted) {
		return (
			<header className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 sticky top-0 z-50 transition-all duration-300">
				<div>
					<div className="h-6 bg-gray-700 rounded w-32 mb-1 animate-pulse"></div>
					<div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
				</div>
				<div className="flex items-center gap-3">
					<div className="w-28 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
					<div className="w-40 h-10 bg-gray-700 rounded-xl animate-pulse"></div>
				</div>
			</header>
		);
	}

	return (
		<header
			className={`flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 sticky top-0 z-50 transition-all duration-300 ${
				scrolled ? "shadow-2xl" : ""
			}`}>
			<div>
				<h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
					DeFi Dashboard
				</h1>
				<p className="text-sm text-gray-400 mt-1">
					Track your multi-chain portfolio
				</p>
			</div>

			<div className="flex items-center gap-3">
				<SimpleNetworkSwitcher />
				<SimpleWalletConnect />
			</div>
		</header>
	);
}
