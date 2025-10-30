/** @format */

"use client";

import dynamic from "next/dynamic";

const HeaderContent = dynamic(
	() => import("./Header").then((mod) => mod.Header),
	{
		ssr: false,
		loading: () => (
			<header className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
				<div>
					<div className="h-6 w-40 bg-gray-700 rounded animate-pulse"></div>
					<div className="h-4 w-32 bg-gray-800 rounded animate-pulse mt-1"></div>
				</div>
				<div className="flex items-center gap-4">
					<div className="h-10 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
					<div className="h-12 w-40 bg-gray-700 rounded-xl animate-pulse"></div>
				</div>
			</header>
		),
	},
);

export function DynamicHeader() {
	return <HeaderContent />;
}
