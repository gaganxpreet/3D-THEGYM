#!/bin/bash

echo "==================================================="
echo "Netlify Deployment Fix Script"
echo "==================================================="
echo 

echo "Creating backup of package.json..."
mkdir -p backups
cp package.json backups/package.json.bak

echo 
echo "Cleaning installation..."
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
  rm package-lock.json
fi

echo 
echo "Clearing npm cache..."
npm cache clean --force

echo 
echo "Installing dependencies..."
npm install --legacy-peer-deps

echo 
echo "Testing build..."
npm run build

echo 
echo "==================================================="
echo "If the build was successful, you can now deploy to Netlify."
echo "Please commit and push the changes to your repository."
echo "==================================================="