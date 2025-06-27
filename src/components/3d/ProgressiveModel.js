'use client';

import { Suspense, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * ProgressiveModel component that loads 3D models with a progress indicator
 * This improves perceived performance by showing loading progress to users
 * 
 * @param {Object} props - Component props
 * @param {string} props.url - URL of the 3D model to load
 * @param {function} props.onLoaded - Callback function called when model is fully loaded
 * @param {Object} props.position - Position of the model [x, y, z]
 * @param {Object} props.scale - Scale of the model [x, y, z]
 * @param {boolean} props.rotate - Whether the model should auto-rotate
 */
export default function ProgressiveModel({
  url,
  onLoaded,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotate = true,
}) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [model, setModel] = useState(null);
  
  // Load the model with progress tracking
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        // Use the useGLTF loader with onProgress callback
        const gltf = await new Promise((resolve) => {
          useGLTF.load(
            url,
            (gltf) => resolve(gltf),
            (xhr) => {
              if (isMounted && xhr.total > 0) {
                const progress = xhr.loaded / xhr.total;
                setLoadingProgress(progress);
              }
            },
            (error) => console.error('Error loading model:', error)
          );
        });
        
        if (isMounted) {
          setModel(gltf.scene);
          // Short delay before showing model to ensure smooth transition
          setTimeout(() => {
            setVisible(true);
            if (onLoaded) onLoaded();
          }, 300);
        }
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };
    
    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, [url, onLoaded]);
  
  // Optional rotation animation
  useFrame((state) => {
    if (model && rotate) {
      model.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  
  // Position and scale the model
  useEffect(() => {
    if (model) {
      model.position.set(...position);
      model.scale.set(...scale);
    }
  }, [model, position, scale]);
  
  return (
    <>
      {/* Loading indicator */}
      {loadingProgress < 1 && (
        <group position={[0, 0, -5]}>
          <mesh>
            <boxGeometry args={[1, 0.1, 0.1]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
          <mesh position={[-0.5 + (loadingProgress * 0.5), 0, 0]} scale={[loadingProgress, 1, 1]}>
            <boxGeometry args={[1, 0.08, 0.08]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </group>
      )}
      
      {/* The actual model */}
      {model && visible && <primitive object={model} />}
    </>
  );
}

/**
 * ProgressiveModelWithFallback component that includes a Suspense boundary
 * and DOM-based loading indicator for better user experience
 */
export function ProgressiveModelWithFallback(props) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {/* DOM-based loading indicator (outside Canvas) */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-700">
              Loading 3D Model: {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      )}
      
      {/* 3D model with progress tracking */}
      <Suspense fallback={null}>
        <ProgressiveModel 
          {...props} 
          onLoaded={() => setLoaded(true)}
          onProgress={setProgress}
        />
      </Suspense>
    </>
  );
}

// Preload common models to improve performance for frequently accessed pages
export function preloadCommonModels() {
  // Add your common models here
  // Example: useGLTF.preload('/models/gym-equipment.glb');
}