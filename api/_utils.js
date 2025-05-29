// Shared data and utilities for Vercel API functions

// CORS headers for production
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight requests
export const handleCors = (req, res) => {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};

// Model multipliers data
export const modelMultipliers = {
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
export const subscriptionPlans = {
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
