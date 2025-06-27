'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WebGLErrorBoundary from '@/components/WebGLErrorBoundary';

// Import the 3D component with SSR disabled
// This prevents hydration errors and server-side rendering of WebGL content
const ThreeScene = dynamic(
  () => import('@/components/3d/ThreeScene'),
  { ssr: false }
);

/**
 * Demo page showing proper implementation of 3D content in Next.js
 * - Uses dynamic imports with SSR disabled
 * - Implements WebGLErrorBoundary for graceful error handling
 * - Provides fallback content when WebGL is not available
 */
export default function ThreeDemoPage() {
  const [showFallback, setShowFallback] = useState(false);
  
  // Fallback content to display when WebGL is not available
  const fallbackContent = (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Alternative Content</h3>
      <p className="text-gray-700 mb-4">
        This is the fallback content shown when 3D visualization is not available.
        We still provide value to users even without WebGL support.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-4 rounded shadow-sm">
            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center mb-3">
              <span className="text-gray-500">Image {item}</span>
            </div>
            <h4 className="font-medium">Feature {item}</h4>
            <p className="text-sm text-gray-600">Description of this amazing gym feature</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">3D Gym Equipment Visualization</h1>
      <p className="text-gray-600 mb-8">
        Experience our state-of-the-art equipment in an interactive 3D environment.
        Rotate and zoom to explore details from every angle.
      </p>
      
      {/* Toggle button for testing fallback */}
      <div className="mb-6">
        <button 
          onClick={() => setShowFallback(!showFallback)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showFallback ? "Show 3D Content" : "Test Fallback Content"}
        </button>
        <span className="ml-3 text-sm text-gray-500">
          (Click to toggle between 3D and fallback content)
        </span>
      </div>
      
      {/* 3D content with error boundary */}
      {!showFallback ? (
        <div className="h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <WebGLErrorBoundary fallback={fallbackContent}>
            <ThreeScene />
          </WebGLErrorBoundary>
        </div>
      ) : (
        fallbackContent
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">About Our Equipment</h2>
        <p className="text-gray-700 mb-4">
          Our gym features premium equipment designed for optimal performance and comfort.
          The 3D visualization above showcases our commitment to providing the best fitness experience.
        </p>
        <p className="text-gray-700">
          Visit our physical location to try out these machines in person, or contact our team
          for more information about specific equipment features and benefits.
        </p>
      </div>
    </main>
  );
}