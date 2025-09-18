#!/bin/bash

echo "🧹 Cleaning up existing processes..."

# Kill any existing processes on ports 3000 and 5000
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 was free"
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "Port 5000 was free"

# Kill any existing node processes for this project
pkill -f "node server.js" 2>/dev/null || echo "No backend server running"
pkill -f "react-scripts" 2>/dev/null || echo "No frontend server running"
pkill -f "nodemon" 2>/dev/null || echo "No nodemon running"

echo "✅ Cleanup complete!"
echo ""
echo "🚀 Starting Real-Time Collaboration Dashboard..."
echo ""

# Start backend
echo "📦 Starting Backend Server..."
cd backend
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "📦 Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Both servers are starting!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
