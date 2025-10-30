/** @format */

"use client";

import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Coins, ChevronDown } from "lucide-react";
import { formatEther } from "viem";

export function WalletConnectButton() {
	const { address, isConnected, chain } = useAccount();
	const { data: balance } = useBalance({ address });

	return (
		<ConnectButton.Custom>
			{({
				openConnectModal,
				openAccountModal,
				mounted,
				account,
				chain: connectedChain,
			}) => {
				const connected = mounted && account && account.address;

				return (
					<div>
						{!connected ? (
							<button
								onClick={openConnectModal}
								className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold border border-blue-500/30 cursor-pointer"
								type="button">
								<Wallet size={20} />
								Connect Wallet
							</button>
						) : (
							<div className="flex items-center gap-3">
								{/* Network & Balance Info */}
								<div className="hidden sm:flex items-center gap-2 bg-gray-800/80 border border-gray-700 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
									{balance && (
										<div className="flex items-center gap-1 text-sm">
											<Coins
												size={14}
												className="text-yellow-400"
											/>
											<span className="font-medium">
												{parseFloat(formatEther(balance.value)).toFixed(3)}
											</span>
											<span className="text-gray-400 text-xs ml-1">
												{balance.symbol}
											</span>
										</div>
									)}
								</div>

								{/* Connected Wallet Button */}
								<button
									onClick={openAccountModal}
									className="flex items-center gap-3 bg-gray-800/80 border border-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-700/80 transition-all duration-300 backdrop-blur-sm min-w-[140px] cursor-pointer group"
									type="button">
									<div className="flex items-center gap-2">
										{/* Network Indicator Dot */}
										<div
											className="w-2 h-2 rounded-full"
											style={{
												backgroundColor:
													connectedChain?.id === 1
														? "#3cba54"
														: connectedChain?.id === 137
														? "#8247e5"
														: connectedChain?.id === 42161
														? "#28a0f0"
														: connectedChain?.id === 10
														? "#ff0420"
														: "#666",
											}}
										/>

										{/* Address Display */}
										<span className="font-medium text-green-400 text-sm">
											{account.displayName}
										</span>
									</div>

									<ChevronDown
										size={16}
										className="text-gray-400 group-hover:text-white transition-colors"
									/>
								</button>
							</div>
						)}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
}
