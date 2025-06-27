'use client';

import { Component } from 'react';

/**
 * Error boundary component specifically designed to catch and handle WebGL-related errors
 * This prevents the entire application from crashing when WebGL is not supported
 * or when there are issues with 3D rendering
 */
export default class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isWebGLError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if the error is related to WebGL
    const isWebGLError = 
      error.message.includes('WebGL') || 
      error.message.includes('WEBGL') ||
      error.message.includes('webgl') ||
      error.message.includes('GL context') ||
      error.message.includes('three') ||
      error.message.includes('Three') ||
      error.message.includes('THREE');
    
    return { hasError: true, isWebGLError };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('WebGL Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-300 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">3D Visualization Unavailable</h2>
          <p className="text-red-600 mb-4">
            {this.state.isWebGLError 
              ? 'Your browser does not support WebGL or it is disabled. Please enable WebGL or try a different browser.'
              : 'There was an error loading the 3D content. Please try again later.'}
          </p>
          {this.props.fallback ? (
            this.props.fallback
          ) : (
            <div className="mt-4">
              <p className="text-gray-700">You can still use all other features of the application.</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}