#!/bin/bash

# Global Horizon News App - Startup Script

echo "----------------------------------------"
echo "  Global Horizon News App - Starting...  "
echo "----------------------------------------"

# 1. Node.js/npm check
if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed. Please install Node.js first."
    exit 1
fi

# 2. Start Local Server
echo "[1/2] Starting local server with built-in CORS proxy..."
# We use a custom Node.js/Express server
# It serves index.html and provides the /api/proxy endpoint

# Use & to run in background so we can show a message
npm start &

echo "----------------------------------------"
echo "  App is running at http://localhost:8080"
echo "  (If the browser didn't open automatically, please visit the URL above)"
echo "  Press Ctrl+C to stop the server."
echo "----------------------------------------"

# Wait for background process
wait
