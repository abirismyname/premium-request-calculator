import { handleCors, modelMultipliers, subscriptionPlans } from './_utils.js';

export default function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method === 'POST') {
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

      res.status(200).json(result);
    } catch (error) {
      console.error('Calculation error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
