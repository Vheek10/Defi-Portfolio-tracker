/** @format */

// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
	onLaunchApp: () => void;
}

export function HeroSection({ onLaunchApp }: HeroSectionProps) {
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="text-center max-w-4xl mx-auto">
				<motion.h1
					className="text-5xl md:text-7xl font-bold text-white mb-6"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					DeFi Portfolio Tracker
				</motion.h1>
				
				<motion.p
					className="text-xl md:text-2xl text-gray-300 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					Track, analyze, and optimize your decentralized finance investments across multiple chains
				</motion.p>
				
				<motion.button
					onClick={onLaunchApp}
					className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/25 mx-auto"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<span>Launch App</span>
					<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
				</motion.button>
			</div>
		</div>
	);
}