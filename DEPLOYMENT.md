# Deploying to Vercel

This guide explains how to deploy the GitHub Copilot Premium Calculator to Vercel for free.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)

## Quick Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to configure your deployment.

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Environment Variables

If you need to set environment variables in production:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add any needed variables (none required for this project)

## Project Structure for Vercel

```
premium-request-calculator/
├── api/                    # Serverless functions (backend)
│   ├── _utils.js          # Shared utilities
│   ├── health.js          # GET /api/health
│   ├── models.js          # GET /api/models
│   ├── plans.js           # GET /api/plans
│   └── calculate.js       # POST /api/calculate
├── client/                # React frontend
│   └── build/            # Built frontend (generated)
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json
```

## How It Works

- **Frontend**: React app is built and served as static files
- **Backend**: Express.js routes converted to Vercel serverless functions
- **API Routes**: Available at `/api/*` endpoints
- **CORS**: Configured to allow cross-origin requests

## Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

Vercel provides:
- **Analytics**: Traffic and performance metrics
- **Logs**: Function execution logs
- **Edge Network**: Global CDN for fast loading

## Free Tier Limits

Vercel's free tier includes:
- **Bandwidth**: 100GB per month
- **Function Executions**: 100GB-hrs per month
- **Build Time**: 6,000 minutes per month
- **Serverless Functions**: 12 per deployment

These limits are generous for most hobby projects.

## Troubleshooting

### Build Errors
- Check that all dependencies are listed in `package.json`
- Ensure the build script works locally: `npm run vercel-build`

### API Errors
- Check function logs in Vercel dashboard
- Verify API endpoints are working: `https://your-app.vercel.app/api/health`

### CORS Issues
- CORS is configured to allow all origins (`*`) in production
- For additional security, you can restrict origins in `api/_utils.js`

## Testing Your Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-app.vercel.app`
2. **Health Check**: `https://your-app.vercel.app/api/health`
3. **Models**: `https://your-app.vercel.app/api/models`
4. **Plans**: `https://your-app.vercel.app/api/plans`
5. **Calculate**: POST to `https://your-app.vercel.app/api/calculate`

## Local Development vs Production

- **Local**: Uses Express server on port 5001
- **Production**: Uses Vercel serverless functions at `/api/*`
- **Frontend**: Automatically detects environment and uses correct API URLs
