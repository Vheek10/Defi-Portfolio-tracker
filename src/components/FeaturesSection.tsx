/** @format */

"use client";

import { motion } from "framer-motion";
import { BarChart3, Cpu, Lock, Globe, Bell, Zap } from "lucide-react";

const features = [
	{
		icon: BarChart3,
		title: "Advanced Analytics",
		description:
			"Deep insights into your portfolio performance with customizable charts and metrics.",
		color: "from-blue-500 to-cyan-500",
	},
	{
		icon: Globe,
		title: "Multi-Chain Support",
		description:
			"Track assets across Ethereum, Polygon, Arbitrum, Optimism, and more.",
		color: "from-purple-500 to-pink-500",
	},
	{
		icon: Lock,
		title: "Secure & Private",
		description:
			"Your data stays on your device. No central servers, no tracking.",
		color: "from-green-500 to-emerald-500",
	},
	{
		icon: Cpu,
		title: "Smart Integration",
		description: "Connect with popular DeFi protocols and wallets seamlessly.",
		color: "from-orange-500 to-red-500",
	},
	{
		icon: Bell,
		title: "Smart Alerts",
		description:
			"Get notified about price movements, yield opportunities, and gas fees.",
		color: "from-yellow-500 to-amber-500",
	},
	{
		icon: Zap,
		title: "Real-Time Updates",
		description: "Live price feeds and instant portfolio valuation updates.",
		color: "from-indigo-500 to-purple-500",
	},
];

export function FeaturesSection() {
	return (
		<section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
			<div className="max-w-6xl mx-auto">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}>
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
						Powerful DeFi Tools
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto">
						Everything you need to manage your decentralized finance portfolio
						like a pro.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -5 }}>
							<div
								className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
								<feature.icon className="h-6 w-6 text-white" />
							</div>

							<h3 className="text-xl font-semibold text-white mb-3">
								{feature.title}
							</h3>

							<p className="text-gray-400 leading-relaxed">
								{feature.description}
							</p>

							{/* Hover effect background */}
							<div
								className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
