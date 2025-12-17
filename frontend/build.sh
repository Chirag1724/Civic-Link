#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Setting permissions for vite..."
chmod +x node_modules/.bin/vite || true

echo "Running build..."
npm run build

echo "Creating _redirects file..."
echo '/* /index.html 200' > dist/_redirects

echo "Build completed successfully!"