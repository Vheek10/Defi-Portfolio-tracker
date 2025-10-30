/** @format */

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingParticles() {
	const points = useRef<THREE.Points>(null!);

	const particleCount = 1500;
	const positions = useMemo(() => {
		const positions = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 10;
		}
		return positions;
	}, []);

	useFrame((state) => {
		if (points.current) {
			points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
			points.current.rotation.x =
				Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
		}
	});

	return (
		<points ref={points}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					count={particleCount}
					array={positions}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial
				size={0.03}
				color="#6366f1"
				transparent
				opacity={0.6}
				sizeAttenuation
			/>
		</points>
	);
}

function BlockchainOrbs() {
	const group = useRef<THREE.Group>(null!);

	const orbs = [
		{ color: "#8b5cf6", size: 0.3, position: [2, 1, 0] }, // Ethereum
		{ color: "#06b6d4", size: 0.2, position: [-1, -1, 1] }, // Polygon
		{ color: "#3b82f6", size: 0.25, position: [0, 2, -1] }, // Arbitrum
	];

	useFrame((state) => {
		if (group.current) {
			group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
		}
	});

	return (
		<group ref={group}>
			{orbs.map((orb, index) => (
				<mesh
					key={index}
					position={orb.position as [number, number, number]}>
					<sphereGeometry args={[orb.size, 16, 16]} />
					<meshBasicMaterial
						color={orb.color}
						transparent
						opacity={0.4}
					/>
				</mesh>
			))}
		</group>
	);
}

export function Scene() {
	return (
		<Canvas
			camera={{ position: [0, 0, 5], fov: 75 }}
			className="absolute inset-0">
			<color
				attach="background"
				args={["#0a0a0a"]}
			/>
			<FloatingParticles />
			<BlockchainOrbs />
			<ambientLight intensity={0.5} />
			<pointLight
				position={[10, 10, 10]}
				intensity={1}
			/>
		</Canvas>
	);
}
