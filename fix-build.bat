@echo off
REM 3D-THEGYM build fix script for Windows

echo 🔧 Starting 3D-THEGYM build fix...

REM Backup and clean
copy package.json package.json.backup
rd /s /q node_modules
del package-lock.json
npm cache clean --force

REM Fresh installation
npm install --legacy-peer-deps

REM Test build
npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed. Restoring backup...
    move package.json.backup package.json
    exit /b 1
)

echo 🚀 All fixes applied successfully!