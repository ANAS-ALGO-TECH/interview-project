#!/bin/bash

echo "🚀 Real-Time Collaboration Dashboard Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm is installed: $(npm --version)"

# Install root dependencies
print_status "Installing root dependencies..."
if npm install; then
    print_success "Root dependencies installed successfully"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
if npm install; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

print_success "All dependencies installed successfully!"
echo ""

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. Please start MongoDB:"
        echo "  - On macOS: brew services start mongodb-community"
        echo "  - On Ubuntu: sudo systemctl start mongod"
        echo "  - On Windows: net start MongoDB"
        echo ""
        read -p "Press Enter to continue anyway (if using MongoDB Atlas)..."
    fi
else
    print_warning "MongoDB is not installed. Please install MongoDB or use MongoDB Atlas"
    echo ""
    read -p "Press Enter to continue anyway (if using MongoDB Atlas)..."
fi

echo ""
print_status "Starting the application..."
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start both servers
npm run dev
