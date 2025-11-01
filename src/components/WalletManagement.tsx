/** @format */

// components/WalletManagement.tsx
"use client";

import { useState, useEffect } from "react";
import {
	useAccount,
	useBalance,
	useChainId,
	useDisconnect,
	useConnect,
} from "wagmi";
import {
	Wallet,
	History,
	Zap,
	Users,
	Copy,
	ExternalLink,
	LogOut,
	Shield,
	Gauge, // CHANGED: Using Gauge instead of GasPump
	Clock,
	ArrowUpRight,
	ArrowDownLeft,
	CheckCircle2,
	XCircle,
	AlertTriangle,
} from "lucide-react";
import { formatEther, formatUnits } from "viem";

interface Transaction {
	hash: string;
	from: string;
	to: string;
	value: string;
	gasPrice: string;
	gasUsed: string;
	timeStamp: string;
	isError: string;
	functionName: string;
}

interface GasPrice {
	safeLow: number;
	standard: number;
	fast: number;
	fastest: number;
	baseFee: number;
}

interface WalletSession {
	address: string;
	connector: any;
	timestamp: number;
}

export function WalletManagement() {
	const { address, isConnected, connector } = useAccount();
	const { data: balance } = useBalance({ address });
	const chainId = useChainId();
	const { disconnect } = useDisconnect();
	const { connect, connectors } = useConnect();

	const [activeTab, setActiveTab] = useState<
		"overview" | "transactions" | "gas" | "multiwallet"
	>("overview");
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [gasPrices, setGasPrices] = useState<GasPrice | null>(null);
	const [walletSessions, setWalletSessions] = useState<WalletSession[]>([]);
	const [loading, setLoading] = useState(false);
	const [copiedAddress, setCopiedAddress] = useState(false);

	// Fetch transaction history
	useEffect(() => {
		if (!address) return;

		const fetchTransactions = async () => {
			setLoading(true);
			try {
				// Using Etherscan API (you'll need to replace with your API key)
				const response = await fetch(
					`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=YOUR_ETHERSCAN_API_KEY`,
				);
				const data = await response.json();
				if (data.status === "1") {
					setTransactions(data.result.slice(0, 20)); // Last 20 transactions
				}
			} catch (error) {
				console.error("Error fetching transactions:", error);
				// Fallback to mock data for demo
				setTransactions(generateMockTransactions(address));
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [address]);

	// Fetch gas prices
	useEffect(() => {
		const fetchGasPrices = async () => {
			try {
				const response = await fetch(
					"https://api.etherscan.io/api?module=gastracker&action=gasoracle",
				);
				const data = await response.json();
				if (data.status === "1") {
					setGasPrices({
						safeLow: parseFloat(data.result.SafeGasPrice),
						standard: parseFloat(data.result.ProposeGasPrice),
						fast: parseFloat(data.result.FastGasPrice),
						fastest: parseFloat(data.result.FastGasPrice) + 5,
						baseFee: parseFloat(data.result.suggestBaseFee || "20"),
					});
				}
			} catch (error) {
				console.error("Error fetching gas prices:", error);
				// Fallback gas prices
				setGasPrices({
					safeLow: 25,
					standard: 30,
					fast: 35,
					fastest: 40,
					baseFee: 20,
				});
			}
		};

		fetchGasPrices();
		const interval = setInterval(fetchGasPrices, 30000); // Update every 30 seconds
		return () => clearInterval(interval);
	}, []);

	// Load wallet sessions from localStorage
	useEffect(() => {
		const savedSessions = localStorage.getItem("walletSessions");
		if (savedSessions) {
			setWalletSessions(JSON.parse(savedSessions));
		}
	}, []);

	const copyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address);
			setCopiedAddress(true);
			setTimeout(() => setCopiedAddress(false), 2000);
		}
	};

	const getTransactionType = (tx: Transaction) => {
		if (tx.functionName && tx.functionName.includes("transfer"))
			return "Transfer";
		if (tx.functionName && tx.functionName.includes("swap")) return "Swap";
		if (tx.functionName && tx.functionName.includes("approve"))
			return "Approval";
		return tx.from.toLowerCase() === address?.toLowerCase()
			? "Send"
			: "Receive";
	};

	const getTransactionIcon = (tx: Transaction) => {
		const type = getTransactionType(tx);
		switch (type) {
			case "Send":
				return <ArrowUpRight className="h-4 w-4 text-red-400" />;
			case "Receive":
				return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
			case "Swap":
				return <Zap className="h-4 w-4 text-yellow-400" />;
			default:
				return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
		}
	};

	const formatTransactionValue = (value: string) => {
		const ethValue = parseFloat(formatEther(BigInt(value)));
		return ethValue > 0 ? `${ethValue.toFixed(4)} ETH` : "Contract Interaction";
	};

	const getExplorerUrl = (hash: string) => {
		const explorers: { [key: number]: string } = {
			1: "https://etherscan.io/tx/",
			137: "https://polygonscan.com/tx/",
			42161: "https://arbiscan.io/tx/",
			10: "https://optimistic.etherscan.io/tx/",
		};
		return `${explorers[chainId] || "https://etherscan.io/tx/"}${hash}`;
	};

	const addWalletSession = (newSession: WalletSession) => {
		const updatedSessions = [
			...walletSessions.filter((s) => s.address !== newSession.address),
			newSession,
		];
		setWalletSessions(updatedSessions);
		localStorage.setItem("walletSessions", JSON.stringify(updatedSessions));
	};

	const removeWalletSession = (sessionAddress: string) => {
		const updatedSessions = walletSessions.filter(
			(s) => s.address !== sessionAddress,
		);
		setWalletSessions(updatedSessions);
		localStorage.setItem("walletSessions", JSON.stringify(updatedSessions));
	};

	const switchWallet = (session: WalletSession) => {
		disconnect();
		// In a real implementation, you'd connect using the session's connector
		setTimeout(() => {
			// Simulate wallet switch
			window.location.reload();
		}, 1000);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Wallet Management</h2>
					<p className="text-gray-400">
						Advanced wallet features and transaction management
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex space-x-1 bg-gray-800 rounded-xl p-1">
				{[
					{ id: "overview", label: "Overview", icon: Wallet },
					{ id: "transactions", label: "Transactions", icon: History },
					{ id: "gas", label: "Gas Optimizer", icon: Gauge }, // CHANGED: Using Gauge icon
					{ id: "multiwallet", label: "Multi-Wallet", icon: Users },
				].map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
								activeTab === tab.id
									? "bg-blue-500 text-white shadow-lg"
									: "text-gray-400 hover:text-white hover:bg-gray-700"
							}`}>
							<Icon className="h-4 w-4" />
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Content */}
			<div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
				{activeTab === "overview" && (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Wallet Info */}
							<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
										<Wallet className="h-6 w-6 text-white" />
									</div>
									<div>
										<h3 className="text-white font-semibold">Wallet Address</h3>
										<p className="text-gray-400 text-sm">
											{address
												? `${address.slice(0, 8)}...${address.slice(-6)}`
												: "Not connected"}
										</p>
									</div>
								</div>
								<div className="space-y-2">
									<button
										onClick={copyAddress}
										className="flex items-center gap-2 w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
										<Copy className="h-4 w-4" />
										<span className="text-sm">
											{copiedAddress ? "Copied!" : "Copy Address"}
										</span>
									</button>
									<button
										onClick={() =>
											window.open(getExplorerUrl(address || ""), "_blank")
										}
										className="flex items-center gap-2 w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer">
										<ExternalLink className="h-4 w-4" />
										<span className="text-sm">View on Explorer</span>
									</button>
								</div>
							</div>

							{/* Balance */}
							<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
								<h3 className="text-gray-400 text-sm font-medium mb-2">
									Total Balance
								</h3>
								<div className="text-2xl font-bold text-white mb-1">
									$
									{balance
										? (
												parseFloat(formatEther(balance.value)) * 2800
										  ).toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
										: "0.00"}
								</div>
								<div className="text-gray-400 text-sm">
									{balance
										? parseFloat(formatEther(balance.value)).toFixed(4)
										: "0"}{" "}
									ETH
								</div>
							</div>

							{/* Network Info */}
							<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
								<h3 className="text-gray-400 text-sm font-medium mb-2">
									Network
								</h3>
								<div className="flex items-center gap-2 mb-1">
									<Shield className="h-4 w-4 text-green-400" />
									<span className="text-white font-semibold">
										{chainId === 1
											? "Ethereum Mainnet"
											: chainId === 137
											? "Polygon"
											: chainId === 42161
											? "Arbitrum"
											: `Chain ${chainId}`}
									</span>
								</div>
								<div className="text-gray-400 text-sm">Chain ID: {chainId}</div>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
								<div className="text-white font-bold text-lg">
									{transactions.length}
								</div>
								<div className="text-gray-400 text-xs">Total TXs</div>
							</div>
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
								<div className="text-green-400 font-bold text-lg">
									{transactions.filter((tx) => tx.isError === "0").length}
								</div>
								<div className="text-gray-400 text-xs">Successful</div>
							</div>
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
								<div className="text-yellow-400 font-bold text-lg">
									{gasPrices ? `${gasPrices.standard} Gwei` : "Loading..."}
								</div>
								<div className="text-gray-400 text-xs">Current Gas</div>
							</div>
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
								<div className="text-blue-400 font-bold text-lg">
									{walletSessions.length}
								</div>
								<div className="text-gray-400 text-xs">Saved Wallets</div>
							</div>
						</div>

						{/* Security Tips */}
						<div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
							<div className="flex items-center gap-2 mb-2">
								<AlertTriangle className="h-4 w-4 text-yellow-400" />
								<h4 className="text-yellow-400 font-semibold">Security Tips</h4>
							</div>
							<ul className="text-yellow-300 text-sm space-y-1">
								<li>• Never share your private keys or seed phrase</li>
								<li>• Always verify transaction details before confirming</li>
								<li>• Use hardware wallets for large amounts</li>
								<li>• Keep your wallet software updated</li>
							</ul>
						</div>
					</div>
				)}

				{activeTab === "transactions" && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Transaction History
							</h3>
							<div className="text-gray-400 text-sm">
								{transactions.length} transactions found
							</div>
						</div>

						{loading ? (
							<div className="flex justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
							</div>
						) : transactions.length === 0 ? (
							<div className="text-center py-8 text-gray-400">
								<History className="h-12 w-12 mx-auto mb-3 opacity-50" />
								<p>No transactions found</p>
							</div>
						) : (
							<div className="space-y-3 max-h-96 overflow-y-auto">
								{transactions.map((tx) => (
									<div
										key={tx.hash}
										className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg hover:bg-gray-700/30 transition-colors">
										<div className="flex items-center gap-3">
											{getTransactionIcon(tx)}
											<div>
												<div className="text-white font-medium text-sm">
													{getTransactionType(tx)}
												</div>
												<div className="text-gray-400 text-xs">
													{new Date(
														parseInt(tx.timeStamp) * 1000,
													).toLocaleDateString()}
												</div>
											</div>
										</div>
										<div className="text-right">
											<div
												className={`text-sm font-medium ${
													getTransactionType(tx) === "Receive"
														? "text-green-400"
														: "text-white"
												}`}>
												{formatTransactionValue(tx.value)}
											</div>
											<div className="flex items-center gap-2 text-xs text-gray-400">
												{tx.isError === "1" ? (
													<XCircle className="h-3 w-3 text-red-400" />
												) : (
													<CheckCircle2 className="h-3 w-3 text-green-400" />
												)}
												<span>
													{tx.isError === "1" ? "Failed" : "Confirmed"}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === "gas" && (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-white">
							Gas Price Optimizer
						</h3>

						{gasPrices ? (
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								{[
									{
										speed: "Safe Low",
										price: gasPrices.safeLow,
										color: "text-green-400",
										bg: "bg-green-500/10",
									},
									{
										speed: "Standard",
										price: gasPrices.standard,
										color: "text-yellow-400",
										bg: "bg-yellow-500/10",
									},
									{
										speed: "Fast",
										price: gasPrices.fast,
										color: "text-orange-400",
										bg: "bg-orange-500/10",
									},
									{
										speed: "Fastest",
										price: gasPrices.fastest,
										color: "text-red-400",
										bg: "bg-red-500/10",
									},
								].map((tier) => (
									<div
										key={tier.speed}
										className={`border border-gray-700 rounded-xl p-4 text-center ${tier.bg}`}>
										<div className={`text-2xl font-bold ${tier.color} mb-1`}>
											{tier.price} Gwei
										</div>
										<div className="text-gray-300 text-sm">{tier.speed}</div>
										<div className="text-gray-400 text-xs mt-1">
											~{Math.round(((21000 * tier.price) / 1e9) * 1000)} USD
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="flex justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
							</div>
						)}

						{/* Gas Tips */}
						<div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
							<h4 className="text-blue-400 font-semibold mb-2">
								Gas Saving Tips
							</h4>
							<ul className="text-blue-300 text-sm space-y-1">
								<li>• Use "Safe Low" for non-urgent transactions</li>
								<li>• Avoid trading during network congestion</li>
								<li>• Consider Layer 2 solutions for frequent transactions</li>
								<li>• Use gas estimation tools before submitting</li>
							</ul>
						</div>

						{/* Current Network Stats */}
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3">
								<div className="text-gray-400 text-sm">Base Fee</div>
								<div className="text-white font-semibold">
									{gasPrices ? `${gasPrices.baseFee} Gwei` : "Loading..."}
								</div>
							</div>
							<div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3">
								<div className="text-gray-400 text-sm">Network Utilization</div>
								<div className="text-white font-semibold">~65%</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === "multiwallet" && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Multi-Wallet Management
							</h3>
							<button
								onClick={() =>
									address &&
									addWalletSession({
										address,
										connector,
										timestamp: Date.now(),
									})
								}
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
								Save Current Wallet
							</button>
						</div>

						{walletSessions.length === 0 ? (
							<div className="text-center py-8 text-gray-400">
								<Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
								<p>No saved wallets</p>
								<p className="text-sm mt-1">
									Save your current wallet to enable quick switching
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{walletSessions.map((session) => (
									<div
										key={session.address}
										className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
										<div className="flex items-center gap-3">
											<Wallet className="h-8 w-8 text-blue-400" />
											<div>
												<div className="text-white font-medium">
													{`${session.address.slice(
														0,
														8,
													)}...${session.address.slice(-6)}`}
												</div>
												<div className="text-gray-400 text-xs">
													Added{" "}
													{new Date(session.timestamp).toLocaleDateString()}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => switchWallet(session)}
												className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer">
												Switch
											</button>
											<button
												onClick={() => removeWalletSession(session.address)}
												className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer">
												Remove
											</button>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Wallet Security Notice */}
						<div className="bg-purple-900/20 border border-purple-800 rounded-xl p-4">
							<h4 className="text-purple-400 font-semibold mb-2">
								Security Notice
							</h4>
							<p className="text-purple-300 text-sm">
								Wallet sessions are stored locally in your browser. They do not
								include private keys and are only used for quick reconnection.
								Always ensure you're using a secure device.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="flex gap-4">
				<button
					onClick={() => disconnect()}
					className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
					<LogOut className="h-4 w-4" />
					Disconnect Wallet
				</button>

				<button
					onClick={() =>
						window.open("https://etherscan.io/gastracker", "_blank")
					}
					className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
					<ExternalLink className="h-4 w-4" />
					Gas Tracker
				</button>
			</div>
		</div>
	);
}

// Helper function for mock transactions (fallback)
function generateMockTransactions(address: string): Transaction[] {
	return Array.from({ length: 8 }, (_, i) => ({
		hash: `0x${Math.random().toString(16).substr(2, 64)}`,
		from:
			i % 2 === 0 ? address : `0x${Math.random().toString(16).substr(2, 40)}`,
		to: i % 2 === 0 ? `0x${Math.random().toString(16).substr(2, 40)}` : address,
		value: (Math.random() * 0.1 * 1e18).toString(),
		gasPrice: (20 + Math.random() * 50).toString(),
		gasUsed: "21000",
		timeStamp: Math.floor(Date.now() / 1000 - i * 3600).toString(),
		isError: Math.random() > 0.1 ? "0" : "1",
		functionName:
			i % 4 === 0
				? "swap"
				: i % 4 === 1
				? "transfer"
				: i % 4 === 2
				? "approve"
				: "",
	}));
}
