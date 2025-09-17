#!/bin/bash

echo "🚀 Starting Real-Time Collaboration Dashboard..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   - On macOS: brew services start mongodb-community"
    echo "   - On Ubuntu: sudo systemctl start mongod"
    echo "   - On Windows: net start MongoDB"
    echo ""
    read -p "Press Enter to continue anyway (if using MongoDB Atlas)..."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Seed the database if it's empty
echo "🌱 Checking database..."
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/collaboration_dashboard', {useNewUrlParser: true, useUnifiedTopology: true});
const Task = require('./models/Task');
Task.countDocuments().then(count => {
  if (count === 0) {
    console.log('🌱 Seeding database with sample data...');
    require('./seed.js');
  } else {
    console.log('✅ Database already has data');
    mongoose.connection.close();
  }
}).catch(err => {
  console.log('⚠️  Could not connect to database:', err.message);
  mongoose.connection.close();
});
"
cd ..

echo ""
echo "🎉 Setup complete! Starting the application..."
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start both frontend and backend
npm run dev
