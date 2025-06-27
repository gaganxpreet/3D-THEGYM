@echo off
echo ===================================================
echo Netlify Deployment Fix Script
echo ===================================================
echo.

echo Creating backup of package.json...
if not exist backups mkdir backups
copy package.json backups\package.json.bak

echo.
echo Cleaning installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Clearing npm cache...
npm cache clean --force

echo.
echo Installing dependencies...
npm install --legacy-peer-deps

echo.
echo Testing build...
npm run build

echo.
echo ===================================================
echo If the build was successful, you can now deploy to Netlify.
echo Please commit and push the changes to your repository.
echo ===================================================

pause