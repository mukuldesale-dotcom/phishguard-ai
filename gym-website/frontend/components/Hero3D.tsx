'use client';

// 3D Hero section using React Three Fiber and Three.js
// Renders animated gym equipment in 3D space
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Rotating torus (dumbbell ring shape)
function AnimatedTorus({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

// Spinning barbell plate (disc shape)
function BarbellPlate({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
      <meshStandardMaterial
        color="#f59e0b"
        metalness={0.9}
        roughness={0.1}
        emissive="#f59e0b"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

// Floating geometric shapes representing gym equipment
function GymEquipment() {
  return (
    <>
      {/* Large dumbbell ring */}
      <AnimatedTorus position={[0, 0, 0]} color="#f59e0b" scale={1.5} />

      {/* Smaller rings at different positions */}
      <AnimatedTorus position={[-3, 1, -2]} color="#d97706" scale={0.8} />
      <AnimatedTorus position={[3, -1, -1]} color="#b45309" scale={0.6} />

      {/* Barbell plates */}
      <BarbellPlate position={[-2, -2, -1]} rotation={[Math.PI / 2, 0, 0]} />
      <BarbellPlate position={[2, 2, -2]} rotation={[Math.PI / 3, 0, 0.5]} />

      {/* Floating spheres (bumper plates) */}
      <Float speed={1.5} floatIntensity={1.5}>
        <mesh position={[-1.5, 2, -1]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            wireframe
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float speed={2.5} floatIntensity={2}>
        <mesh position={[1.8, -1.5, -0.5]}>
          <octahedronGeometry args={[0.6]} />
          <meshStandardMaterial
            color="#d97706"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </Float>
    </>
  );
}

// Main 3D Hero canvas component
export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />

        {/* Gold-colored point light for dramatic effect */}
        <pointLight position={[5, 5, 5]} color="#f59e0b" intensity={2} />
        <pointLight position={[-5, -5, 5]} color="#d97706" intensity={1} />

        {/* White fill light */}
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

        {/* Stars in the background for premium feel */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* 3D gym equipment with suspense loading */}
        <Suspense fallback={null}>
          <GymEquipment />
        </Suspense>

        {/* Subtle orbit controls for interactivity - auto-rotate */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
