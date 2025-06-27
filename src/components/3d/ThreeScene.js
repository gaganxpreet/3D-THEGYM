'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';

/**
 * Model component that loads and renders a 3D model
 * Uses useGLTF from drei to efficiently load GLTF models
 */
function Model({ url }) {
  const { scene } = useGLTF(url);
  
  // Apply any model-specific transformations or animations here
  useEffect(() => {
    if (scene) {
      // Example: Set initial position or scale
      scene.position.y = -1;
      scene.scale.set(1.5, 1.5, 1.5);
    }
  }, [scene]);
  
  return <primitive object={scene} />;
}

/**
 * Loading component shown while 3D content is loading
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-primary font-medium">Loading 3D Model...</p>
      </div>
    </div>
  );
}

/**
 * Main ThreeScene component that sets up the 3D environment
 * This component should be imported with dynamic() and { ssr: false }
 */
export default function ThreeScene({ modelUrl = '/models/gym-equipment.glb' }) {
  const containerRef = useRef();
  
  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
        dpr={[1, 2]} // Responsive pixel ratio
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Content */}
        <Suspense fallback={null}>
          <Model url={modelUrl} />
          <Environment preset="city" />
          <Preload all />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Fallback shown outside Canvas during loading */}
      <Suspense fallback={<LoadingFallback />}>
        <div className="sr-only">3D Content Loaded</div>
      </Suspense>
    </div>
  );
}

// Preload the model to avoid jank when it's first displayed
// This is optional but recommended for frequently used models
// useGLTF.preload('/models/gym-equipment.glb');