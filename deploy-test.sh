#!/bin/bash

# Quick deployment test script
echo "🚀 GitHub Copilot Premium Calculator - Deployment Test"
echo "=================================================="

# Test if we can build the project
echo "📦 Testing build process..."
cd client
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

cd ..

# Test API functions
echo "🧪 Testing API functions..."
node test-api.js
if [ $? -eq 0 ]; then
    echo "✅ API tests passed!"
else
    echo "❌ API tests failed!"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Ready for Vercel deployment."
echo ""
echo "Next steps:"
echo "1. git add . && git commit -m 'Ready for Vercel deployment'"
echo "2. git push origin main"
echo "3. Import your repository on vercel.com"
echo ""
echo "Your app will be available at: https://your-app-name.vercel.app"
