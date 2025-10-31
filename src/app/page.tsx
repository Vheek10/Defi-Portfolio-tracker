/** @format */

// app/page.tsx
"use client";

import { motion } from "framer-motion";
import { Scene } from "@/components/three/Scene";
import { HeroSection } from "@/components/HeroSection";
import { StatsOverview } from "@/components/StatsOverview";
import { FeaturesSection } from "@/components/FeaturesSection";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Home() {
	const router = useRouter();

	const handleLaunchApp = () => {
		router.push("/dashboard");
	};

	return (
		<div className="relative">
			{/* 3D Background */}
			<div className="fixed inset-0 z-0">
				<Scene />
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Hero Section */}
				<section className="relative min-h-screen">
					<HeroSection onLaunchApp={handleLaunchApp} />
				</section>

				{/* Stats Overview */}
				<section className="relative py-20 bg-black/50 backdrop-blur-sm">
					<StatsOverview />
				</section>

				{/* Features Section */}
				<FeaturesSection />

				{/* CTA Section */}
				<section className="relative py-20 px-4 bg-gradient-to-b from-black to-gray-900">
					<div className="max-w-4xl mx-auto text-center">
						<motion.h2
							className="text-4xl md:text-6xl font-bold text-white mb-6"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}>
							Ready to Optimize Your DeFi Portfolio?
						</motion.h2>
						<motion.p
							className="text-xl text-gray-400 mb-8"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}>
							Join thousands of DeFi investors tracking their assets with
							precision and ease.
						</motion.p>
						<motion.button
							onClick={handleLaunchApp}
							className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-blue-500/25"
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}>
							<span>Launch App</span>
							<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
						</motion.button>
					</div>
				</section>
			</div>
		</div>
	);
}
