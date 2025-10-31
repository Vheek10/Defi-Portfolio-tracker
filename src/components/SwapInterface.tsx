/** @format */
/** @format */

// components/SwapInterface.tsx
"use client";

import { useState, useEffect } from "react";
import {
	useAccount,
	useChainId,
	useChains,
	useSwitchChain,
	useBalance,
} from "wagmi";
import {
	ArrowDownUp,
	Zap,
	Loader2,
	AlertCircle,
	CheckCircle2,
	Search,
	Wallet,
} from "lucide-react";
import { useAlertManager } from "@/hooks/useAlertManager";

interface Token {
	symbol: string;
	name: string;
	balance: string;
	price: number;
	logo?: string;
	address?: string;
	id?: string;
}

interface SwapInterfaceProps {
	onClose?: () => void;
}

const POPULAR_TOKENS: Token[] = [
	{ symbol: "ETH", name: "Ethereum", balance: "0", price: 2800 },
	{ symbol: "USDC", name: "USD Coin", balance: "0", price: 1 },
	{ symbol: "USDT", name: "Tether", balance: "0", price: 1 },
	{ symbol: "DAI", name: "Dai Stablecoin", balance: "0", price: 1 },
	{ symbol: "WBTC", name: "Wrapped Bitcoin", balance: "0", price: 42000 },
	{ symbol: "MATIC", name: "Polygon", balance: "0", price: 0.8 },
];

export function SwapInterface({ onClose }: SwapInterfaceProps) {
	// All hooks must be called unconditionally at the top level
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const chains = useChains();
	const { switchChain } = useSwitchChain();
	const { data: ethBalance } = useBalance({ address });
	const alertManager = useAlertManager();

	const [mounted, setMounted] = useState(false);
	const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0]);
	const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1]);
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [slippage, setSlippage] = useState(1.0);
	const [showTokenSelector, setShowTokenSelector] = useState<
		"from" | "to" | null
	>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Token[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Get current chain name - this is computed value, not a hook
	const currentChain = chains.find((chain) => chain.id === chainId);

	// All useEffect hooks must be called unconditionally
	useEffect(() => {
		setMounted(true);
	}, []);

	// Update token balances with real data
	useEffect(() => {
		if (ethBalance && isConnected) {
			const updatedTokens = POPULAR_TOKENS.map((token) => {
				if (token.symbol === "ETH") {
					return {
						...token,
						balance: parseFloat(ethBalance.formatted).toFixed(4),
					};
				}
				// For demo purposes, set some mock balances for other tokens
				if (token.symbol === "USDC") {
					return { ...token, balance: "1250.75" };
				}
				if (token.symbol === "USDT") {
					return { ...token, balance: "500.25" };
				}
				return token;
			});
			setFromToken(updatedTokens[0]);
			setToToken(updatedTokens[1]);
		}
	}, [ethBalance, isConnected]);

	// Update to amount when from amount changes
	useEffect(() => {
		if (fromAmount && parseFloat(fromAmount) > 0 && fromToken && toToken) {
			const fromValue = parseFloat(fromAmount) * fromToken.price;
			const calculatedAmount = (fromValue / toToken.price).toFixed(6);
			setToAmount(calculatedAmount);
		} else {
			setToAmount("");
		}
	}, [fromAmount, fromToken, toToken]);

	// Search tokens from CoinGecko
	useEffect(() => {
		const searchTokens = async () => {
			if (!searchQuery.trim()) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
						searchQuery,
					)}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch tokens");
				}

				const data = await response.json();

				// Transform CoinGecko data to our Token format
				const tokens: Token[] = data.coins.slice(0, 20).map((coin: any) => ({
					symbol: coin.symbol.toUpperCase(),
					name: coin.name,
					balance: "0", // Default balance
					price: 0, // We'll fetch price separately if needed
					logo: coin.thumb,
					id: coin.id,
				}));

				setSearchResults(tokens);
			} catch (error) {
				console.error("Error searching tokens:", error);
				alertManager.addAlert({
					type: "price",
					title: "Search Failed",
					message: "Failed to fetch tokens from CoinGecko",
					severity: "warning",
					triggered: false,
					active: true,
					data: { error: "Search failed" },
				});
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		};

		// Debounce search
		const timeoutId = setTimeout(searchTokens, 500);
		return () => clearTimeout(timeoutId);
	}, [searchQuery, alertManager]);

	// Fetch token price when a token is selected from search
	const fetchTokenPrice = async (tokenId: string): Promise<number> => {
		try {
			const response = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch price");
			}

			const data = await response.json();
			return data[tokenId]?.usd || 0;
		} catch (error) {
			console.error("Error fetching token price:", error);
			return 0;
		}
	};

	const handleSwap = async () => {
		if (!isConnected) {
			alertManager.addAlert({
				type: "security",
				title: "Wallet Not Connected",
				message: "Please connect your wallet to swap tokens",
				severity: "warning",
				triggered: false,
				active: true,
				data: { action: "connect_wallet" },
			});
			return;
		}

		if (parseFloat(fromAmount) > parseFloat(fromToken.balance)) {
			alertManager.addAlert({
				type: "security",
				title: "Insufficient Balance",
				message: `You don't have enough ${fromToken.symbol} to complete this swap`,
				severity: "warning",
				triggered: false,
				active: true,
				data: { token: fromToken.symbol, balance: fromToken.balance },
			});
			return;
		}

		setIsLoading(true);
		try {
			// Simulate swap process
			await new Promise((resolve) => setTimeout(resolve, 3000));

			alertManager.addAlert({
				type: "price",
				title: "Swap Executed",
				message: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`,
				severity: "info",
				triggered: false,
				active: true,
				data: {
					fromToken: fromToken.symbol,
					toToken: toToken.symbol,
					amount: fromAmount,
					value: toAmount,
				},
			});

			// Reset form
			setFromAmount("");
			setToAmount("");
		} catch (error) {
			console.error("Swap error:", error);
			alertManager.addAlert({
				type: "security",
				title: "Swap Failed",
				message: "Transaction failed. Please try again.",
				severity: "critical",
				triggered: false,
				active: true,
				data: { error: "Transaction failed" },
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleTokenSwap = () => {
		// Swap the tokens
		const tempFrom = fromToken;
		const tempAmount = fromAmount;
		setFromToken(toToken);
		setToToken(tempFrom);
		setFromAmount(toAmount);
		setToAmount(tempAmount);
	};

	const handleMaxClick = () => {
		if (fromToken.balance) {
			setFromAmount(fromToken.balance);
		}
	};

	const handleTokenSelect = async (token: Token) => {
		// If it's a CoinGecko token, fetch its price
		if (token.id && token.price === 0) {
			const price = await fetchTokenPrice(token.id);
			token.price = price;
		}

		if (showTokenSelector === "from") {
			setFromToken(token);
		} else {
			setToToken(token);
		}

		setShowTokenSelector(null);
		setSearchQuery("");
		setSearchResults([]);
	};

	const displayTokens = searchQuery.trim() ? searchResults : POPULAR_TOKENS;

	const TokenSelector = ({ type }: { type: "from" | "to" }) => {
		const currentToken = type === "from" ? fromToken : toToken;

		return (
			<div className="relative">
				<button
					onClick={() => setShowTokenSelector(type)}
					className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 min-w-[120px] transition-colors cursor-pointer border border-gray-600 justify-between">
					<div className="flex items-center gap-2">
						{currentToken.logo ? (
							<img
								src={currentToken.logo}
								alt={currentToken.symbol}
								className="w-6 h-6 rounded-full"
							/>
						) : (
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
									currentToken.symbol === "ETH"
										? "bg-gradient-to-br from-blue-500 to-purple-500"
										: currentToken.symbol === "USDC"
										? "bg-gradient-to-br from-green-500 to-blue-500"
										: currentToken.symbol === "USDT"
										? "bg-gradient-to-br from-blue-400 to-green-400"
										: currentToken.symbol === "DAI"
										? "bg-gradient-to-br from-yellow-500 to-orange-500"
										: currentToken.symbol === "WBTC"
										? "bg-gradient-to-br from-orange-500 to-yellow-500"
										: "bg-gradient-to-br from-purple-500 to-pink-500"
								}`}>
								{currentToken.symbol.slice(0, 3)}
							</div>
						)}
						<span className="text-white font-medium">
							{currentToken.symbol}
						</span>
					</div>
					<ArrowDownUp className="h-3 w-3 text-gray-400 flex-shrink-0" />
				</button>

				{showTokenSelector === type && (
					<div className="absolute top-12 left-0 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
						<div className="p-3 border-b border-gray-700">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search tokens..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
								/>
							</div>
						</div>

						<div className="p-2">
							<div className="text-xs text-gray-400 font-medium mb-2 px-2">
								{searchQuery.trim() ? "Search Results" : "Popular Tokens"}
							</div>

							{isSearching ? (
								<div className="flex justify-center py-4">
									<Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
								</div>
							) : displayTokens.length === 0 ? (
								<div className="text-center py-4 text-gray-400 text-sm">
									No tokens found
								</div>
							) : (
								<div className="space-y-1">
									{displayTokens.map((token) => (
										<button
											key={token.id || token.symbol}
											onClick={() => handleTokenSelect(token)}
											className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group">
											<div className="flex items-center gap-3">
												{token.logo ? (
													<img
														src={token.logo}
														alt={token.symbol}
														className="w-8 h-8 rounded-full"
													/>
												) : (
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
															token.symbol === "ETH"
																? "bg-gradient-to-br from-blue-500 to-purple-500"
																: token.symbol === "USDC"
																? "bg-gradient-to-br from-green-500 to-blue-500"
																: token.symbol === "USDT"
																? "bg-gradient-to-br from-blue-400 to-green-400"
																: token.symbol === "DAI"
																? "bg-gradient-to-br from-yellow-500 to-orange-500"
																: token.symbol === "WBTC"
																? "bg-gradient-to-br from-orange-500 to-yellow-500"
																: "bg-gradient-to-br from-purple-500 to-pink-500"
														}`}>
														{token.symbol.slice(0, 3)}
													</div>
												)}
												<div className="text-left">
													<div className="text-white font-medium text-sm">
														{token.symbol}
													</div>
													<div className="text-gray-400 text-xs">
														{token.name}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-white text-sm font-medium">
													{token.balance}
												</div>
												<div className="text-gray-400 text-xs">
													{token.price > 0
														? `$${token.price.toLocaleString()}`
														: "Price loading..."}
												</div>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	// Show loading state during SSR - this is just JSX, not hooks
	if (!mounted) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto animate-pulse">
				<div className="h-6 bg-gray-700 rounded w-32 mb-6"></div>
				<div className="space-y-4">
					<div className="h-16 bg-gray-700 rounded"></div>
					<div className="h-16 bg-gray-700 rounded"></div>
					<div className="h-12 bg-gray-700 rounded"></div>
				</div>
			</div>
		);
	}

	const exchangeRate =
		fromToken && toToken ? toToken.price / fromToken.price : 0;

	return (
		<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm max-w-md w-full mx-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold text-white">Swap Tokens</h2>
				<button
					onClick={onClose}
					className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer text-xl">
					×
				</button>
			</div>

			{/* Connection Status */}
			{!isConnected ? (
				<div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-4">
					<div className="flex items-center gap-2">
						<AlertCircle className="h-4 w-4 text-yellow-400" />
						<span className="text-yellow-300 text-sm">
							Connect your wallet to swap tokens
						</span>
					</div>
				</div>
			) : (
				<div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4 text-green-400" />
						<span className="text-green-300 text-sm">
							Connected to {currentChain?.name || "Unknown Network"}
						</span>
					</div>
				</div>
			)}

			{/* From Token */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
				<div className="flex items-center justify-between mb-2">
					<label className="text-gray-400 text-sm font-medium">From</label>
					<div className="flex items-center gap-2">
						<span className="text-gray-400 text-sm">
							Balance: {fromToken.balance}
						</span>
						<button
							onClick={handleMaxClick}
							className="text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer transition-colors">
							MAX
						</button>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<input
						type="number"
						placeholder="0.0"
						value={fromAmount}
						onChange={(e) => setFromAmount(e.target.value)}
						className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-500 focus:outline-none min-w-0"
					/>
					<TokenSelector type="from" />
				</div>
				{fromAmount && parseFloat(fromAmount) > 0 && (
					<div className="text-gray-400 text-xs mt-2">
						≈ $
						{(parseFloat(fromAmount) * fromToken.price).toLocaleString(
							undefined,
							{
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							},
						)}
					</div>
				)}
			</div>

			{/* Swap Button */}
			<div className="flex justify-center -my-2 z-10 relative">
				<button
					onClick={handleTokenSwap}
					className="bg-gray-800 border border-gray-700 rounded-full p-2 hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg">
					<ArrowDownUp className="h-4 w-4 text-white" />
				</button>
			</div>

			{/* To Token */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
				<div className="flex items-center justify-between mb-2">
					<label className="text-gray-400 text-sm font-medium">To</label>
					<span className="text-gray-400 text-sm">
						Balance: {toToken.balance}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<input
						type="text"
						placeholder="0.0"
						value={toAmount}
						readOnly
						className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-gray-500 focus:outline-none min-w-0"
					/>
					<TokenSelector type="to" />
				</div>
				{toAmount && parseFloat(toAmount) > 0 && (
					<div className="text-gray-400 text-xs mt-2">
						≈ $
						{(parseFloat(toAmount) * toToken.price).toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
				)}
			</div>

			{/* Swap Details */}
			{fromAmount && parseFloat(fromAmount) > 0 && (
				<div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 mb-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-gray-400 text-sm">Exchange Rate</span>
						<span className="text-white text-sm font-medium">
							1 {fromToken.symbol} ={" "}
							{exchangeRate.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 6,
							})}{" "}
							{toToken.symbol}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-gray-400 text-sm">Minimum Received</span>
						<span className="text-white text-sm font-medium">
							{(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)}{" "}
							{toToken.symbol}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-gray-400 text-sm">Price Impact</span>
						<span className="text-green-400 text-sm font-medium">
							&lt; 0.1%
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-gray-400 text-sm">Network Fee</span>
						<span className="text-white text-sm font-medium">$2.50</span>
					</div>
				</div>
			)}

			{/* Slippage Settings */}
			<div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 mb-6">
				<div className="flex items-center justify-between mb-3">
					<span className="text-gray-400 text-sm font-medium">
						Slippage Tolerance
					</span>
					<span className="text-white text-sm font-medium">{slippage}%</span>
				</div>
				<div className="flex gap-2">
					{[0.1, 0.5, 1.0].map((value) => (
						<button
							key={value}
							onClick={() => setSlippage(value)}
							className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
								slippage === value
									? "bg-blue-500 text-white shadow-lg"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							} cursor-pointer`}>
							{value}%
						</button>
					))}
					<div className="flex-1 relative">
						<input
							type="number"
							step="0.1"
							min="0.1"
							max="50"
							value={slippage}
							onChange={(e) => setSlippage(parseFloat(e.target.value) || 1.0)}
							className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
						/>
						<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
							%
						</span>
					</div>
				</div>
			</div>

			{/* Swap Button */}
			<button
				onClick={handleSwap}
				disabled={
					!fromAmount ||
					parseFloat(fromAmount) <= 0 ||
					isLoading ||
					!isConnected ||
					parseFloat(fromAmount) > parseFloat(fromToken.balance)
				}
				className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none">
				{isLoading ? (
					<>
						<Loader2 className="h-5 w-5 animate-spin" />
						Swapping...
					</>
				) : !isConnected ? (
					<>
						<Wallet className="h-5 w-5" />
						Connect Wallet to Swap
					</>
				) : parseFloat(fromAmount) > parseFloat(fromToken.balance) ? (
					"Insufficient Balance"
				) : !fromAmount ? (
					"Enter Amount"
				) : (
					<>
						<Zap className="h-5 w-5" />
						Swap {fromAmount} {fromToken.symbol} for {toAmount} {toToken.symbol}
					</>
				)}
			</button>

			{/* Network Info */}
			{isConnected && (
				<div className="text-center mt-4 pt-4 border-t border-gray-700">
					<p className="text-gray-400 text-sm">
						Connected to {currentChain?.name} (Chain ID: {chainId})
					</p>
					<p className="text-gray-500 text-xs mt-1">
						Gas fees are estimated and may vary
					</p>
				</div>
			)}
		</div>
	);
}
