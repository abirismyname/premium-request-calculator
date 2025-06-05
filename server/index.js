const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Dynamic CORS configuration for different environments
const getCorsOrigins = () => {
  const origins = ['http://localhost:3000'];

  // Add Codespaces URLs if we're in a Codespace environment
  const codespace = process.env.CODESPACE_NAME;
  const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;

  if (codespace && domain) {
    origins.push(
      `https://${codespace}-3000.${domain}`,
      `https://${codespace}-3000.app.github.dev`
    );
  }

  // Allow custom CLIENT_URL from environment
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }

  console.log('CORS Origins:', origins);
  return origins;
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: getCorsOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());

// Model multipliers data
const modelMultipliers = {
  'base-gpt-41': { name: 'Base model (GPT-4.1)', multiplier: 0, description: 'Free for paid users' },
  'premium-gpt-41': { name: 'Premium GPT-4.1', multiplier: 1, description: '1× multiplier' },
  'gpt-4o': { name: 'GPT-4o', multiplier: 1, description: '1× multiplier' },
  'gpt-45': { name: 'GPT-4.5', multiplier: 50, description: '50× multiplier' },
  'claude-35-sonnet': { name: 'Claude 3.5 Sonnet', multiplier: 1, description: '1× multiplier' },
  'claude-37-sonnet': { name: 'Claude 3.7 Sonnet', multiplier: 1, description: '1× multiplier' },
  'claude-37-sonnet-thinking': { name: 'Claude 3.7 Sonnet Thinking', multiplier: 1.25, description: '1.25× multiplier' },
  'claude-sonnet-4': { name: 'Claude Sonnet 4', multiplier: 1, description: '1× multiplier' },
  'claude-opus-4': { name: 'Claude Opus 4', multiplier: 10, description: '10× multiplier' },
  'gemini-20-flash': { name: 'Gemini 2.0 Flash', multiplier: 0.25, description: '0.25× multiplier' },
  'gemini-25-pro': { name: 'Gemini 2.5 Pro', multiplier: 1, description: '1× multiplier' },
  'o1': { name: 'o1', multiplier: 10, description: '10× multiplier' },
  'o3': { name: 'o3', multiplier: 5, description: '5× multiplier' },
  'o3-mini': { name: 'o3-mini', multiplier: 0.33, description: '0.33× multiplier' },
  'o4-mini': { name: 'o4-mini', multiplier: 0.33, description: '0.33× multiplier' }
};

// Subscription plans data
const subscriptionPlans = {
  business: {
    name: 'Business',
    price: 19,
    includedRequests: 300,
    description: '$19/month - 300 premium requests included'
  },
  enterprise: {
    name: 'Enterprise',
    price: 39,
    includedRequests: 1000,
    description: '$39/month - 1000 premium requests included'
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: {
      codespace: process.env.CODESPACE_NAME || 'Not in Codespaces',
      domain: process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'No Codespaces domain',
      clientOrigin: req.headers.origin || 'No origin header'
    }
  });
});

app.get('/api/models', (req, res) => {
  res.json(modelMultipliers);
});

app.get('/api/plans', (req, res) => {
  res.json(subscriptionPlans);
});

app.post('/api/calculate', (req, res) => {
  try {
    const { subscription, model, requests, developers, budget } = req.body;

    // Validation
    if (!subscription || !model || requests === undefined || developers === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: subscription, model, requests, developers'
      });
    }

    if (!subscriptionPlans[subscription]) {
      return res.status(400).json({
        error: 'Invalid subscription plan'
      });
    }

    if (!modelMultipliers[model]) {
      return res.status(400).json({
        error: 'Invalid model'
      });
    }

    if (requests < 0 || developers < 1) {
      return res.status(400).json({
        error: 'Requests must be non-negative and developers must be at least 1'
      });
    }

    // Calculate premium requests per developer
    const modelMultiplier = modelMultipliers[model].multiplier;
    const totalPremiumRequestsPerDeveloper = requests * modelMultiplier;
    const totalPremiumRequests = totalPremiumRequestsPerDeveloper * developers;
    
    // Get plan details - each developer gets the full allowance
    const plan = subscriptionPlans[subscription];
    const includedRequestsTotal = plan.includedRequests * developers;
    
    // Calculate additional requests and cost
    const additionalRequests = Math.max(0, totalPremiumRequests - includedRequestsTotal);
    const additionalCost = additionalRequests * 0.04;
    
    // Check budget status
    let budgetStatus = 'unlimited';
    if (budget && budget > 0) {
      budgetStatus = additionalCost <= budget ? 'within-budget' : 'over-budget';
    }

    const result = {
      calculation: {
        totalPremiumRequests: parseFloat(totalPremiumRequests.toFixed(2)),
        includedRequests: includedRequestsTotal,
        additionalRequests: parseFloat(additionalRequests.toFixed(2)),
        additionalCost: parseFloat(additionalCost.toFixed(2)),
        budgetStatus,
        developers: developers
      },
      input: {
        subscription,
        model,
        requests,
        developers,
        budget: budget || 0
      },
      planDetails: plan,
      modelDetails: modelMultipliers[model]
    };

    res.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Codespace info:', {
    CODESPACE_NAME: process.env.CODESPACE_NAME,
    GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN,
    isCodespaces: !!(process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN)
  });

  // In Codespaces, log the expected frontend URL
  if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    console.log(`Expected frontend URL: https://${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
  }
});

module.exports = app;
