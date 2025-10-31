/** @format */

// components/SwapInterface.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
	useAccount,
	useChainId,
	useChains,
	useSwitchChain,
	useBalance,
	useToken,
	useReadContract,
} from "wagmi";
import {
	ArrowDownUp,
	Zap,
	Loader2,
	AlertCircle,
	CheckCircle2,
	Search,
	Wallet,
	ExternalLink,
	Copy,
} from "lucide-react";
import { formatUnits, parseUnits, isAddress, erc20Abi } from "viem";
import { useAlertManager } from "@/hooks/useAlertManager";

interface Token {
	symbol: string;
	name: string;
	balance: string;
	price: number;
	logo?: string;
	address: string;
	decimals: number;
	chainId: number;
	coinGeckoId?: string;
}

interface SwapInterfaceProps {
	onClose?: () => void;
}

// Common ERC20 token addresses by chain with CoinGecko IDs
const COMMON_TOKENS: { [chainId: number]: Token[] } = {
	1: [
		// Ethereum Mainnet
		{
			symbol: "ETH",
			name: "Ethereum",
			balance: "0",
			price: 0,
			address: "0x0000000000000000000000000000000000000000",
			decimals: 18,
			chainId: 1,
			coinGeckoId: "ethereum",
		},
		{
			symbol: "USDC",
			name: "USD Coin",
			balance: "0",
			price: 1,
			address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
			decimals: 6,
			chainId: 1,
			coinGeckoId: "usd-coin",
		},
		{
			symbol: "USDT",
			name: "Tether",
			balance: "0",
			price: 1,
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			decimals: 6,
			chainId: 1,
			coinGeckoId: "tether",
		},
		{
			symbol: "DAI",
			name: "Dai Stablecoin",
			balance: "0",
			price: 1,
			address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
			decimals: 18,
			chainId: 1,
			coinGeckoId: "dai",
		},
		{
			symbol: "WBTC",
			name: "Wrapped Bitcoin",
			balance: "0",
			price: 0,
			address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
			decimals: 8,
			chainId: 1,
			coinGeckoId: "wrapped-bitcoin",
		},
	],
	137: [
		// Polygon
		{
			symbol: "MATIC",
			name: "Polygon",
			balance: "0",
			price: 0,
			address: "0x0000000000000000000000000000000000000000",
			decimals: 18,
			chainId: 137,
			coinGeckoId: "matic-network",
		},
		{
			symbol: "USDC",
			name: "USD Coin",
			balance: "0",
			price: 1,
			address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
			decimals: 6,
			chainId: 137,
			coinGeckoId: "usd-coin",
		},
	],
	42161: [
		// Arbitrum
		{
			symbol: "ETH",
			name: "Ethereum",
			balance: "0",
			price: 0,
			address: "0x0000000000000000000000000000000000000000",
			decimals: 18,
			chainId: 42161,
			coinGeckoId: "ethereum",
		},
		{
			symbol: "USDC",
			name: "USD Coin",
			balance: "0",
			price: 1,
			address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
			decimals: 6,
			chainId: 42161,
			coinGeckoId: "usd-coin",
		},
	],
};

export function SwapInterface({ onClose }: SwapInterfaceProps) {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const chains = useChains();
	const { switchChain } = useSwitchChain();
	const { data: nativeBalance } = useBalance({ address });
	const alertManager = useAlertManager();

	const [mounted, setMounted] = useState(false);
	const [fromToken, setFromToken] = useState<Token | null>(null);
	const [toToken, setToToken] = useState<Token | null>(null);
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
	const [tokenPrices, setTokenPrices] = useState<{ [symbol: string]: number }>(
		{},
	);
	const [allTokens, setAllTokens] = useState<Token[]>([]);

	const currentChain = chains.find((chain) => chain.id === chainId);
	const chainTokens = COMMON_TOKENS[chainId] || COMMON_TOKENS[1];

	// Get token data for from token
	const { data: fromTokenData } = useToken({
		address: fromToken?.address as `0x${string}`,
		enabled:
			!!fromToken &&
			fromToken.address !== "0x0000000000000000000000000000000000000000",
	});

	// Get token balance for from token using readContract
	const { data: fromTokenBalance, refetch: refetchFromBalance } =
		useReadContract({
			address: fromToken?.address as `0x${string}`,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: address ? [address] : undefined,
			enabled:
				!!fromToken &&
				!!address &&
				fromToken.address !== "0x0000000000000000000000000000000000000000",
		});

	// Get token data for to token
	const { data: toTokenData } = useToken({
		address: toToken?.address as `0x${string}`,
		enabled:
			!!toToken &&
			toToken.address !== "0x0000000000000000000000000000000000000000",
	});

	// Get token balance for to token using readContract
	const { data: toTokenBalance, refetch: refetchToBalance } = useReadContract({
		address: toToken?.address as `0x${string}`,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: address ? [address] : undefined,
		enabled:
			!!toToken &&
			!!address &&
			toToken.address !== "0x0000000000000000000000000000000000000000",
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	// Initialize tokens for current chain
	useEffect(() => {
		if (chainTokens.length > 0) {
			setFromToken(chainTokens[0]);
			setToToken(chainTokens[1]);
			setAllTokens(chainTokens);
		}
	}, [chainId, chainTokens]);

	// Fetch token prices from CoinGecko
	const fetchTokenPrices = useCallback(async () => {
		if (!allTokens.length) return;

		try {
			// Get unique CoinGecko IDs
			const coinGeckoIds = allTokens
				.map((token) => token.coinGeckoId)
				.filter(Boolean)
				.join(",");

			if (!coinGeckoIds) return;

			const response = await fetch(
				`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds}&vs_currencies=usd`,
			);

			if (!response.ok) {
				throw new Error("Failed to fetch prices");
			}

			const prices = await response.json();

			// Update token prices
			const newTokenPrices: { [symbol: string]: number } = {};
			allTokens.forEach((token) => {
				if (token.coinGeckoId && prices[token.coinGeckoId]) {
					newTokenPrices[token.symbol] = prices[token.coinGeckoId].usd;
				}
			});

			setTokenPrices(newTokenPrices);
		} catch (error) {
			console.error("Error fetching token prices:", error);
			alertManager.addAlert({
				type: "price",
				title: "Price Update Failed",
				message: "Unable to fetch latest token prices",
				severity: "warning",
				triggered: false,
				active: true,
			});
		}
	}, [allTokens, alertManager]);

	// Fetch prices on mount and periodically
	useEffect(() => {
		fetchTokenPrices();
		const interval = setInterval(fetchTokenPrices, 30000); // Update every 30 seconds
		return () => clearInterval(interval);
	}, [fetchTokenPrices]);

	// Search tokens from CoinGecko
	const searchCoinGeckoTokens = useCallback(
		async (query: string) => {
			if (!query.trim()) {
				setSearchResults(allTokens);
				return;
			}

			setIsSearching(true);
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
						query,
					)}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch tokens from CoinGecko");
				}

				const data = await response.json();

				// Transform CoinGecko data to our Token format
				const coinGeckoTokens: Token[] = data.coins
					.slice(0, 10)
					.map((coin: any) => ({
						symbol: coin.symbol.toUpperCase(),
						name: coin.name,
						balance: "0",
						price: 0,
						logo: coin.thumb,
						address: "0x0000000000000000000000000000000000000000", // Will need to map to actual address
						decimals: 18,
						chainId: chainId,
						coinGeckoId: coin.id,
					}));

				// Combine with local tokens that match the search
				const localResults = allTokens.filter(
					(token) =>
						token.symbol.toLowerCase().includes(query.toLowerCase()) ||
						token.name.toLowerCase().includes(query.toLowerCase()),
				);

				setSearchResults([...localResults, ...coinGeckoTokens]);
			} catch (error) {
				console.error("Error searching CoinGecko tokens:", error);
				// Fallback to local search
				const localResults = allTokens.filter(
					(token) =>
						token.symbol.toLowerCase().includes(query.toLowerCase()) ||
						token.name.toLowerCase().includes(query.toLowerCase()),
				);
				setSearchResults(localResults);
			} finally {
				setIsSearching(false);
			}
		},
		[allTokens, chainId],
	);

	// Update token balances with real data
	useEffect(() => {
		if (fromToken && address) {
			let balance = "0";
			if (fromToken.address === "0x0000000000000000000000000000000000000000") {
				// Native token
				balance = nativeBalance
					? formatUnits(nativeBalance.value, nativeBalance.decimals)
					: "0";
			} else if (fromTokenBalance) {
				const decimals = fromTokenData?.decimals || fromToken.decimals;
				balance = formatUnits(fromTokenBalance as bigint, decimals);
			}

			setFromToken((prev) => (prev ? { ...prev, balance } : null));
		}
	}, [fromToken, fromTokenBalance, fromTokenData, nativeBalance, address]);

	useEffect(() => {
		if (toToken && address) {
			let balance = "0";
			if (toToken.address === "0x0000000000000000000000000000000000000000") {
				// Native token
				balance = nativeBalance
					? formatUnits(nativeBalance.value, nativeBalance.decimals)
					: "0";
			} else if (toTokenBalance) {
				const decimals = toTokenData?.decimals || toToken.decimals;
				balance = formatUnits(toTokenBalance as bigint, decimals);
			}

			setToToken((prev) => (prev ? { ...prev, balance } : null));
		}
	}, [toToken, toTokenBalance, toTokenData, nativeBalance, address]);

	// Update token prices
	useEffect(() => {
		if (fromToken && tokenPrices[fromToken.symbol]) {
			setFromToken((prev) =>
				prev ? { ...prev, price: tokenPrices[fromToken.symbol] } : null,
			);
		}
	}, [fromToken, tokenPrices]);

	useEffect(() => {
		if (toToken && tokenPrices[toToken.symbol]) {
			setToToken((prev) =>
				prev ? { ...prev, price: tokenPrices[toToken.symbol] } : null,
			);
		}
	}, [toToken, tokenPrices]);

	// Calculate to amount based on from amount and prices
	useEffect(() => {
		if (
			fromAmount &&
			parseFloat(fromAmount) > 0 &&
			fromToken &&
			toToken &&
			fromToken.price > 0
		) {
			const fromValue = parseFloat(fromAmount) * fromToken.price;
			const calculatedAmount =
				fromToken.price > 0 ? (fromValue / toToken.price).toFixed(6) : "0";
			setToAmount(calculatedAmount);
		} else {
			setToAmount("");
		}
	}, [fromAmount, fromToken, toToken]);

	// Search tokens
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchQuery.trim()) {
				searchCoinGeckoTokens(searchQuery);
			} else {
				setSearchResults(allTokens);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery, searchCoinGeckoTokens, allTokens]);

	const handleSwap = async () => {
		if (!isConnected || !fromToken || !toToken) {
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

		if (!fromAmount || parseFloat(fromAmount) <= 0) {
			alertManager.addAlert({
				type: "security",
				title: "Invalid Amount",
				message: "Please enter a valid amount to swap",
				severity: "warning",
				triggered: false,
				active: true,
			});
			return;
		}

		const fromBalance = parseFloat(fromToken.balance);
		if (parseFloat(fromAmount) > fromBalance) {
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
			// Simulate swap process - in real implementation, you'd interact with a DEX
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

			// Refresh balances
			refetchFromBalance();
			refetchToBalance();

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
		if (!fromToken || !toToken) return;

		const tempFrom = fromToken;
		const tempAmount = fromAmount;
		setFromToken(toToken);
		setToToken(tempFrom);
		setFromAmount(toAmount);
		setToAmount(tempAmount);
	};

	const handleMaxClick = () => {
		if (fromToken?.balance) {
			// Leave a little for gas if it's native token
			const maxAmount =
				fromToken.address === "0x0000000000000000000000000000000000000000"
					? Math.max(0, parseFloat(fromToken.balance) - 0.001).toString()
					: fromToken.balance;
			setFromAmount(maxAmount);
		}
	};

	const handleTokenSelect = (token: Token) => {
		if (showTokenSelector === "from") {
			setFromToken(token);
		} else {
			setToToken(token);
		}

		setShowTokenSelector(null);
		setSearchQuery("");
		setSearchResults([]);
	};

	const getTokenDisplayBalance = (token: Token) => {
		const balance = parseFloat(token.balance);
		if (balance === 0) return "0";
		if (balance < 0.0001) return "< 0.0001";
		return balance.toFixed(4);
	};

	const TokenSelector = ({ type }: { type: "from" | "to" }) => {
		const currentToken = type === "from" ? fromToken : toToken;
		const displayTokens = searchQuery.trim() ? searchResults : allTokens;

		return (
			<div className="relative">
				<button
					onClick={() => setShowTokenSelector(type)}
					className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 min-w-[120px] transition-colors cursor-pointer border border-gray-600 justify-between">
					<div className="flex items-center gap-2">
						{currentToken?.logo ? (
							<img
								src={currentToken.logo}
								alt={currentToken.symbol}
								className="w-6 h-6 rounded-full"
							/>
						) : (
							<div
								className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
									currentToken?.symbol === "ETH"
										? "bg-gradient-to-br from-blue-500 to-purple-500"
										: currentToken?.symbol === "USDC"
										? "bg-gradient-to-br from-green-500 to-blue-500"
										: currentToken?.symbol === "USDT"
										? "bg-gradient-to-br from-blue-400 to-green-400"
										: currentToken?.symbol === "DAI"
										? "bg-gradient-to-br from-yellow-500 to-orange-500"
										: currentToken?.symbol === "WBTC"
										? "bg-gradient-to-br from-orange-500 to-yellow-500"
										: currentToken?.symbol === "MATIC"
										? "bg-gradient-to-br from-purple-500 to-pink-500"
										: "bg-gradient-to-br from-gray-500 to-gray-700"
								}`}>
								{currentToken?.symbol.slice(0, 3)}
							</div>
						)}
						<span className="text-white font-medium">
							{currentToken?.symbol}
						</span>
					</div>
					<ArrowDownUp className="h-3 w-3 text-gray-400 flex-shrink-0" />
				</button>

				{showTokenSelector === type && (
					<div className="absolute top-12 left-0 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
						<div className="p-3 border-b border-gray-700">
							<div className="relative mb-2">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search by symbol, name, or address..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
								/>
							</div>
							<div className="text-xs text-gray-400">
								Chain: {currentChain?.name} (ID: {chainId})
							</div>
						</div>

						<div className="p-2">
							<div className="text-xs text-gray-400 font-medium mb-2 px-2">
								{searchQuery.trim() ? "Search Results" : "Available Tokens"}
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
								<div className="space-y-1 max-h-64 overflow-y-auto">
									{displayTokens.map((token, index) => (
										<button
											key={`${token.symbol}-${index}`}
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
																: token.symbol === "MATIC"
																? "bg-gradient-to-br from-purple-500 to-pink-500"
																: "bg-gradient-to-br from-gray-500 to-gray-700"
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
													{getTokenDisplayBalance(token)}
												</div>
												<div className="text-gray-400 text-xs">
													{token.price > 0
														? `$${token.price.toLocaleString(undefined, {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
														  })}`
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

	if (!fromToken || !toToken) {
		return (
			<div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
				<div className="text-center text-gray-400">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
					<p>Loading tokens...</p>
				</div>
			</div>
		);
	}

	const exchangeRate =
		fromToken.price > 0 ? toToken.price / fromToken.price : 0;
	const insufficientBalance =
		parseFloat(fromAmount) > parseFloat(fromToken.balance);

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
					<div className="text-xs text-green-400 mt-1">
						{address?.slice(0, 6)}...{address?.slice(-4)}
					</div>
				</div>
			)}

			{/* From Token */}
			<div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
				<div className="flex items-center justify-between mb-2">
					<label className="text-gray-400 text-sm font-medium">From</label>
					<div className="flex items-center gap-2">
						<span className="text-gray-400 text-sm">
							Balance: {getTokenDisplayBalance(fromToken)}
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
						step="any"
					/>
					<TokenSelector type="from" />
				</div>
				{fromAmount && parseFloat(fromAmount) > 0 && fromToken.price > 0 && (
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
						Balance: {getTokenDisplayBalance(toToken)}
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
				{toAmount && parseFloat(toAmount) > 0 && toToken.price > 0 && (
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
			{fromAmount && parseFloat(fromAmount) > 0 && fromToken.price > 0 && (
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
						<span className="text-white text-sm font-medium">~$2.50</span>
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
					insufficientBalance ||
					!fromToken ||
					!toToken
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
				) : insufficientBalance ? (
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
