import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">500</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Server Error</h2>
      <p className="text-lg mb-8 max-w-md">
        We're sorry, but there was an error with our server. Please try again later.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}