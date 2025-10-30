/** @format */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export function HeroSection() {
	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />

			{/* Content */}
			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<motion.h1
						className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.2 }}>
						DeFi Portfolio
					</motion.h1>

					<motion.p
						className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.5 }}>
						Track, analyze, and optimize your decentralized finance investments
						across multiple chains in real-time.
					</motion.p>

					{/* Feature Grid */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.7 }}>
						{[
							{
								icon: TrendingUp,
								title: "Real-Time Analytics",
								desc: "Live portfolio tracking",
							},
							{
								icon: Shield,
								title: "Multi-Chain",
								desc: "Ethereum, Polygon, Arbitrum",
							},
							{
								icon: Zap,
								title: "Smart Alerts",
								desc: "Price & yield notifications",
							},
						].map((feature, index) => (
							<motion.div
								key={feature.title}
								className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
								whileHover={{ scale: 1.05, y: -5 }}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}>
								<feature.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-white mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-400 text-sm">{feature.desc}</p>
							</motion.div>
						))}
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 1 }}>
						<motion.button
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 transition-all duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							Launch App
							<ArrowRight className="h-5 w-5" />
						</motion.button>

						<motion.button
							className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							View Demo
						</motion.button>
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 1.5 }}>
				<motion.div
					className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity }}>
					<motion.div
						className="w-1 h-3 bg-white/50 rounded-full mt-2"
						animate={{ opacity: [1, 0, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				</motion.div>
			</motion.div>
		</div>
	);
}
