# Optimized Configuration Files

## Updated package.json

```json
{
  "name": "3d-the-gym",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=18.17.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@radix-ui/react-slot": "^1.2.3",
    "@react-three/drei": "^9.92.7",
    "@react-three/fiber": "^9.1.2",
    "@types/three": "^0.159.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^10.18.0",
    "googleapis": "^150.0.1",
    "gsap": "^3.13.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.1",
    "lenis": "^1.3.4",
    "tempus": "^1.0.0-dev.11",
    "lucide-react": "^0.514.0",
    "motion": "^12.18.1",
    "next": "^14.2.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.12.0",
    "suspend-react": "^0.1.3",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.177.0"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^14.2.0",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
```

## Updated next.config.js

```javascript
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({})
  : (config) => config;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config) => {
    // Properly handle shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });
    
    // Add aliases for easier imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.join(__dirname, 'src/components'),
      '@styles': path.join(__dirname, 'src/styles'),
      '@utils': path.join(__dirname, 'src/utils'),
    };
    
    return config;
  },
  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

## Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "NODE_VERSION": "18.17.0"
  }
}
```