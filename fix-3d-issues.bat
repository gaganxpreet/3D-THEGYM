@echo off
echo ===================================================
echo 3D-THEGYM Comprehensive Fix Script (Windows)
echo ===================================================
echo.

echo [1/7] Creating backup of critical files...
if not exist backups mkdir backups
copy package.json backups\package.json.%date:~-4,4%%date:~-7,2%%date:~-10,2%.bak
copy next.config.js backups\next.config.js.%date:~-4,4%%date:~-7,2%%date:~-10,2%.bak
if exist vercel.json copy vercel.json backups\vercel.json.%date:~-4,4%%date:~-7,2%%date:~-10,2%.bak
echo Backups created in ./backups directory
echo.

echo [2/7] Cleaning installation...
rd /s /q node_modules 2>nul
del package-lock.json 2>nul
npm cache clean --force
echo.

echo [3/7] Updating dependencies...
npm uninstall tempus three @studio-freight/hamo 2>nul
npm install --save tempus@^1.0.0-dev.11 three@^0.177.0 @react-three/drei @types/three suspend-react
npm install --save-dev @next/bundle-analyzer
echo.

echo [4/7] Updating package.json configuration...
node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json')); pkg.engines = { node: '>=18.17.0', npm: '>=9.0.0' }; pkg.scripts.analyze = 'set ANALYZE=true && next build'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
echo.

echo [5/7] Updating Next.js configuration...
echo const path = require('path'); > next.config.new.js
echo. >> next.config.new.js
echo /** @type {import('next').NextConfig} */ >> next.config.new.js
echo const withBundleAnalyzer = process.env.ANALYZE === 'true' >> next.config.new.js
echo   ? require('@next/bundle-analyzer')({}) >> next.config.new.js
echo   : (config) =^> config; >> next.config.new.js
echo. >> next.config.new.js
echo const nextConfig = { >> next.config.new.js
echo   reactStrictMode: true, >> next.config.new.js
echo   swcMinify: true, >> next.config.new.js
echo   env: { >> next.config.new.js
echo     NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY, >> next.config.new.js
echo   }, >> next.config.new.js
echo   images: { >> next.config.new.js
echo     formats: ['image/avif', 'image/webp'], >> next.config.new.js
echo     remotePatterns: [ >> next.config.new.js
echo       { >> next.config.new.js
echo         protocol: 'https', >> next.config.new.js
echo         hostname: 'randomuser.me', >> next.config.new.js
echo         pathname: '**', >> next.config.new.js
echo       }, >> next.config.new.js
echo       { >> next.config.new.js
echo         protocol: 'https', >> next.config.new.js
echo         hostname: 'images.unsplash.com', >> next.config.new.js
echo         pathname: '**', >> next.config.new.js
echo       }, >> next.config.new.js
echo     ], >> next.config.new.js
echo   }, >> next.config.new.js
echo   transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'], >> next.config.new.js
echo   webpack: (config) =^> { >> next.config.new.js
echo     // Properly handle shader files >> next.config.new.js
echo     config.module.rules.push({ >> next.config.new.js
echo       test: /\.(glsl^|vs^|fs^|vert^|frag)$/, >> next.config.new.js
echo       exclude: /node_modules/, >> next.config.new.js
echo       use: ['raw-loader'], >> next.config.new.js
echo     }); >> next.config.new.js
echo     >> next.config.new.js
echo     // Add aliases for easier imports >> next.config.new.js
echo     config.resolve.alias = { >> next.config.new.js
echo       ...config.resolve.alias, >> next.config.new.js
echo       '@components': path.join(__dirname, 'src/components'), >> next.config.new.js
echo       '@styles': path.join(__dirname, 'src/styles'), >> next.config.new.js
echo       '@utils': path.join(__dirname, 'src/utils'), >> next.config.new.js
echo     }; >> next.config.new.js
echo     >> next.config.new.js
echo     return config; >> next.config.new.js
echo   }, >> next.config.new.js
echo   // Experimental features for performance >> next.config.new.js
echo   experimental: { >> next.config.new.js
echo     optimizeCss: true, >> next.config.new.js
echo     scrollRestoration: true, >> next.config.new.js
echo   }, >> next.config.new.js
echo }; >> next.config.new.js
echo. >> next.config.new.js
echo module.exports = withBundleAnalyzer(nextConfig); >> next.config.new.js

move /y next.config.new.js next.config.js
echo.

echo [6/7] Creating Vercel configuration...
echo { > vercel.json
echo   "version": 2, >> vercel.json
echo   "buildCommand": "npm run build", >> vercel.json
echo   "installCommand": "npm install --legacy-peer-deps", >> vercel.json
echo   "framework": "nextjs", >> vercel.json
echo   "headers": [ >> vercel.json
echo     { >> vercel.json
echo       "source": "/fonts/(.*)", >> vercel.json
echo       "headers": [ >> vercel.json
echo         { >> vercel.json
echo           "key": "Cache-Control", >> vercel.json
echo           "value": "public, max-age=31536000, immutable" >> vercel.json
echo         } >> vercel.json
echo       ] >> vercel.json
echo     }, >> vercel.json
echo     { >> vercel.json
echo       "source": "/images/(.*)", >> vercel.json
echo       "headers": [ >> vercel.json
echo         { >> vercel.json
echo           "key": "Cache-Control", >> vercel.json
echo           "value": "public, max-age=86400" >> vercel.json
echo         } >> vercel.json
echo       ] >> vercel.json
echo     }, >> vercel.json
echo     { >> vercel.json
echo       "source": "/(.*).js", >> vercel.json
echo       "headers": [ >> vercel.json
echo         { >> vercel.json
echo           "key": "Cache-Control", >> vercel.json
echo           "value": "public, max-age=31536000, immutable" >> vercel.json
echo         } >> vercel.json
echo       ] >> vercel.json
echo     } >> vercel.json
echo   ], >> vercel.json
echo   "env": { >> vercel.json
echo     "NODE_VERSION": "18.17.0" >> vercel.json
echo   } >> vercel.json
echo } >> vercel.json
echo.

echo [7/7] Installing dependencies and testing build...
npm install --legacy-peer-deps
echo.

echo ===================================================
echo Fix script completed!
echo ===================================================
echo.
echo Next steps:
echo 1. Review the implementation-plan.md file for detailed instructions
echo 2. Implement the SSR/CSR architecture fixes from optimized-code-examples.md
echo 3. Run 'npm run build' to test the build
echo 4. Commit and push changes to trigger a new deployment
echo.
echo If you encounter any issues, restore from backups in ./backups directory
echo ===================================================

pause