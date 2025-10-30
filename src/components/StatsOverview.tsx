/** @format */

"use client";

import { motion } from "framer-motion";
import { StatCard } from "./StatCard";

const stats = [
	{ title: "Total Portfolio Value", value: "$23,480", change: "+5.2%" },
	{ title: "24h Change", value: "$1,120", change: "+2.8%" },
	{ title: "Top Asset", value: "ETH", change: "+3.1%" },
	{ title: "DeFi Positions", value: "4 Active", change: "+1 New" },
];

export function StatsOverview() {
	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto px-4"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			viewport={{ once: true }}>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.title}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					viewport={{ once: true }}>
					<StatCard {...stat} />
				</motion.div>
			))}
		</motion.div>
	);
}
