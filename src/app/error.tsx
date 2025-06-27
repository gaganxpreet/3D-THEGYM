'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Oops!</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Something went wrong</h2>
      <p className="text-lg mb-8 max-w-md">
        We're sorry, but there was an error processing your request.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}