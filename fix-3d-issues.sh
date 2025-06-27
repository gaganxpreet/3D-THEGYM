#!/bin/bash

echo "==================================================="
echo "3D-THEGYM Comprehensive Fix Script (Linux/Mac)"
echo "==================================================="
echo 

echo "[1/7] Creating backup of critical files..."
mkdir -p backups
cp package.json backups/package.json.$(date +%Y%m%d).bak
cp next.config.js backups/next.config.js.$(date +%Y%m%d).bak
[ -f vercel.json ] && cp vercel.json backups/vercel.json.$(date +%Y%m%d).bak
echo "Backups created in ./backups directory"
echo

echo "[2/7] Cleaning installation..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force
echo

echo "[3/7] Updating dependencies..."
npm uninstall tempus three @studio-freight/hamo 2>/dev/null
npm install --save tempus@^1.0.0-dev.11 three@^0.177.0 @react-three/drei @types/three suspend-react
npm install --save-dev @next/bundle-analyzer
echo

echo "[4/7] Updating package.json configuration..."
node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json')); pkg.engines = { node: '>=18.17.0', npm: '>=9.0.0' }; pkg.scripts.analyze = 'ANALYZE=true next build'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
echo

echo "[5/7] Updating Next.js configuration..."
cat > next.config.new.js << 'EOL'
const path = require('path');

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
EOL

mv next.config.new.js next.config.js
echo

echo "[6/7] Creating Vercel configuration..."
cat > vercel.json << 'EOL'
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
EOL
echo

echo "[7/7] Installing dependencies and testing build..."
npm install --legacy-peer-deps
echo

echo "==================================================="
echo "Fix script completed!"
echo "==================================================="
echo
echo "Next steps:"
echo "1. Review the implementation-plan.md file for detailed instructions"
echo "2. Implement the SSR/CSR architecture fixes from optimized-code-examples.md"
echo "3. Run 'npm run build' to test the build"
echo "4. Commit and push changes to trigger a new deployment"
echo
echo "If you encounter any issues, restore from backups in ./backups directory"
echo "==================================================="