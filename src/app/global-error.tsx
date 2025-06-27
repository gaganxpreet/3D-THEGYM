'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-dark text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">Critical Error</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Something went seriously wrong</h2>
          <p className="text-lg mb-8 max-w-md">
            We're sorry, but there was a critical error with the application.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}