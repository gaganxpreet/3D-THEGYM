# Optimized Code Examples

## Dynamic Import for 3D Components

Implement dynamic imports for all 3D components to prevent SSR rendering issues:

```javascript
// src/components/3d/ThreeScene.js
'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Preload } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ThreeScene({ modelUrl }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Suspense fallback={null}>
        <Model url={modelUrl} />
        <Environment preset="city" />
        <Preload all />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
```

```javascript
// src/app/3d-page/page.js
import dynamic from 'next/dynamic';

// Import the 3D component with SSR disabled
const ThreeScene = dynamic(
  () => import('@/components/3d/ThreeScene'),
  { ssr: false }
);

export default function ThreeDPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">3D Visualization</h1>
      
      {/* Wrap 3D content in error boundary */}
      <WebGLErrorBoundary>
        <div className="h-[500px] w-full">
          <ThreeScene modelUrl="/models/gym-equipment.glb" />
        </div>
      </WebGLErrorBoundary>
    </main>
  );
}
```

## WebGL Error Boundary

Create an error boundary to gracefully handle WebGL context failures:

```javascript
// src/components/WebGLErrorBoundary.js
'use client';

import { Component } from 'react';

export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if the error is related to WebGL
    const isWebGLError = 
      error.message.includes('WebGL') || 
      error.message.includes('WEBGL') ||
      error.message.includes('webgl') ||
      error.message.includes('GL context');
    
    return { hasError: true, isWebGLError };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WebGL Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-300 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">3D Visualization Unavailable</h2>
          <p className="text-red-600">
            {this.state.isWebGLError 
              ? 'Your browser does not support WebGL or it is disabled. Please enable WebGL or try a different browser.'
              : 'There was an error loading the 3D content. Please try again later.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Optimized Animation with LazyMotion

Reduce Framer Motion bundle size with selective imports:

```javascript
// src/components/ui/OptimizedAnimation.js
'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

export default function OptimizedAnimation({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
```

## Progressive Loading for 3D Models

Implement progressive loading for 3D models using suspend-react:

```javascript
// src/components/3d/ProgressiveModel.js
'use client';

import { Suspense, useState } from 'react';
import { suspend } from 'suspend-react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Cache key for suspend-react
const glbCache = new Map();

// Progressive model loading
function Model({ url, onProgress }) {
  const [visible, setVisible] = useState(false);
  
  // Use suspend-react to handle the async loading
  const { scene } = suspend(
    () => new Promise((resolve) => {
      const loader = useGLTF.preload(url, (xhr) => {
        const progress = xhr.loaded / xhr.total;
        onProgress(progress);
        if (progress === 1) {
          setTimeout(() => setVisible(true), 300);
        }
      });
      resolve(loader);
    }),
    [url],
    { key: `glb-${url}` }
  );

  useFrame((state) => {
    if (scene) {
      scene.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return visible ? <primitive object={scene} /> : null;
}

export default function ProgressiveModel({ url }) {
  const [progress, setProgress] = useState(0);
  
  return (
    <>
      {progress < 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-center">
            Loading 3D Model: {Math.round(progress * 100)}%
          </div>
        </div>
      )}
      
      <Suspense fallback={null}>
        <Model url={url} onProgress={setProgress} />
      </Suspense>
    </>
  );
}
```

## Optimized Three.js Imports

Replace full Three.js imports with specific module imports:

```javascript
// BEFORE
import * as THREE from 'three';

// AFTER
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { Scene } from 'three/src/scenes/Scene';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial';
import { Mesh } from 'three/src/objects/Mesh';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
```

## Content Security Policy for 3D Applications

Implement a Content Security Policy that allows WebGL while maintaining security:

```javascript
// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add security headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https:;
    media-src 'self';
    worker-src 'self' blob:;
    child-src 'none';
    object-src 'none';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```