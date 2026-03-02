#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Setup a trap to kill background processes when the script exits (e.g. via Ctrl+C)
trap "kill 0" EXIT

echo "🚀 Starting AI Travel Blogger Squad..."
echo "======================================"

# 1. Start the FastAPI backend in the background
echo "🐍 Starting Backend (FastAPI on port 8000)..."
.venv/bin/python app.py &

# 2. Start the Next.js frontend in the background
echo "⚛️  Starting Frontend (Next.js on port 3000)..."
cd frontend && npm run dev &

# Wait for all background processes to finish
wait
