#!/bin/bash
# 3D-THEGYM build fix script

echo "🔧 Starting 3D-THEGYM build fix..."

# Backup and clean
cp package.json package.json.backup
rm -rf node_modules package-lock.json
npm cache clean --force

# Fresh installation
npm install --legacy-peer-deps

# Test build
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Restoring backup..."
    mv package.json.backup package.json
    exit 1
fi

echo "🚀 All fixes applied successfully!"