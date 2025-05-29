#!/bin/bash

# Post-creation setup script for DevContainer
echo "🚀 Setting up GitHub Copilot Premium Calculator DevContainer..."

# Make sure we're in the right directory
cd /workspaces/premium-request-calculator

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
# Backend environment variables
NODE_ENV=development
PORT=5001
EOF
fi

if [ ! -f client/.env ]; then
    echo "📝 Creating frontend .env file..."
    cat > client/.env << EOF
# Frontend environment variables
REACT_APP_API_URL=http://localhost:5001/api
EOF
fi

# Set up Git configuration (if not already set)
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️ Please configure Git:"
    echo "git config --global user.name 'Your Name'"
    echo "git config --global user.email 'your.email@example.com'"
fi

echo "✅ DevContainer setup complete!"
echo ""
echo "🎯 Quick Start:"
echo "  1. Run 'npm run dev' to start both frontend and backend"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Backend API will be available at http://localhost:5001/api"
echo ""
echo "📝 Available commands:"
echo "  npm run dev        - Start both servers in development mode"
echo "  npm run server     - Start only the backend server"
echo "  npm run client     - Start only the frontend server"
echo ""
