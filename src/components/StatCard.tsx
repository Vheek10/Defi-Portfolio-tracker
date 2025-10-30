/** @format */

"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string;
	change?: string;
}

export function StatCard({ title, value, change }: StatCardProps) {
	const isPositive = change?.startsWith("+");
	const hasChange = change !== undefined;

	return (
		<motion.div
			className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group relative overflow-hidden"
			whileHover={{ y: -5, scale: 1.02 }}>
			<h3 className="text-gray-400 text-sm font-medium mb-2 group-hover:text-gray-300 transition-colors">
				{title}
			</h3>

			<div className="flex items-baseline justify-between">
				<span className="text-2xl font-bold text-white">{value}</span>

				{hasChange && (
					<div
						className={`flex items-center gap-1 text-sm ${
							isPositive ? "text-green-400" : "text-red-400"
						}`}>
						{isPositive ? (
							<TrendingUp className="h-4 w-4" />
						) : (
							<TrendingDown className="h-4 w-4" />
						)}
						<span>{change}</span>
					</div>
				)}
			</div>

			{/* Animated background on hover */}
			<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
		</motion.div>
	);
}
