const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body.environment).toHaveProperty('codespace');
      expect(response.body.environment).toHaveProperty('domain');
      expect(response.body.environment).toHaveProperty('clientOrigin');
      
      // Verify timestamp is a valid ISO string
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /api/models', () => {
    it('should return all available models', async () => {
      const response = await request(app)
        .get('/api/models')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(typeof response.body).toBe('object');
      
      // Check that we have expected models
      expect(response.body).toHaveProperty('base-gpt-41');
      expect(response.body).toHaveProperty('premium-gpt-41');
      expect(response.body).toHaveProperty('gpt-4o');
      
      // Check model structure
      const baseModel = response.body['base-gpt-41'];
      expect(baseModel).toHaveProperty('name');
      expect(baseModel).toHaveProperty('multiplier');
      expect(baseModel).toHaveProperty('description');
      expect(typeof baseModel.name).toBe('string');
      expect(typeof baseModel.multiplier).toBe('number');
      expect(typeof baseModel.description).toBe('string');
    });

    it('should include all expected models with correct multipliers', async () => {
      const response = await request(app)
        .get('/api/models')
        .expect(200);

      const models = response.body;

      // Test specific model multipliers
      expect(models['base-gpt-41'].multiplier).toBe(0);
      expect(models['premium-gpt-41'].multiplier).toBe(1);
      expect(models['gpt-45'].multiplier).toBe(50);
      expect(models['o1'].multiplier).toBe(10);
      expect(models['o3'].multiplier).toBe(5);
      expect(models['o3-mini'].multiplier).toBe(0.33);
    });
  });

  describe('GET /api/plans', () => {
    it('should return subscription plans', async () => {
      const response = await request(app)
        .get('/api/plans')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(typeof response.body).toBe('object');
      
      // Check that we have both plans
      expect(response.body).toHaveProperty('business');
      expect(response.body).toHaveProperty('enterprise');
      
      // Check business plan structure
      const businessPlan = response.body.business;
      expect(businessPlan).toHaveProperty('name', 'Business');
      expect(businessPlan).toHaveProperty('price', 19);
      expect(businessPlan).toHaveProperty('includedRequests', 300);
      expect(businessPlan).toHaveProperty('description');
      
      // Check enterprise plan structure
      const enterprisePlan = response.body.enterprise;
      expect(enterprisePlan).toHaveProperty('name', 'Enterprise');
      expect(enterprisePlan).toHaveProperty('price', 39);
      expect(enterprisePlan).toHaveProperty('includedRequests', 1000);
      expect(enterprisePlan).toHaveProperty('description');
    });
  });

  describe('POST /api/calculate', () => {
    describe('Validation Tests', () => {
      it('should return 400 for missing required fields', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({})
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body.error).toBe('Missing required fields: subscription, model, requests, developers');
      });

      it('should return 400 for missing subscription', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            model: 'base-gpt-41',
            requests: 100,
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Missing required fields: subscription, model, requests, developers');
      });

      it('should return 400 for missing model', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            requests: 100,
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Missing required fields: subscription, model, requests, developers');
      });

      it('should return 400 for missing requests', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'base-gpt-41',
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Missing required fields: subscription, model, requests, developers');
      });

      it('should return 400 for missing developers', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'base-gpt-41',
            requests: 100
          })
          .expect(400);

        expect(response.body.error).toBe('Missing required fields: subscription, model, requests, developers');
      });

      it('should return 400 for invalid subscription plan', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'invalid-plan',
            model: 'base-gpt-41',
            requests: 100,
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Invalid subscription plan');
      });

      it('should return 400 for invalid model', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'invalid-model',
            requests: 100,
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Invalid model');
      });

      it('should return 400 for negative requests', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'base-gpt-41',
            requests: -1,
            developers: 1
          })
          .expect(400);

        expect(response.body.error).toBe('Requests must be non-negative and developers must be at least 1');
      });

      it('should return 400 for less than 1 developer', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'base-gpt-41',
            requests: 100,
            developers: 0
          })
          .expect(400);

        expect(response.body.error).toBe('Requests must be non-negative and developers must be at least 1');
      });
    });

    describe('Calculation Tests', () => {
      it('should calculate correctly for base model (multiplier 0)', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'base-gpt-41',
            requests: 500,
            developers: 1
          })
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('calculation');
        expect(response.body).toHaveProperty('input');
        expect(response.body).toHaveProperty('planDetails');
        expect(response.body).toHaveProperty('modelDetails');

        const calc = response.body.calculation;
        // Base model has 0 multiplier, so 500 * 0 = 0 premium requests
        expect(calc.totalPremiumRequests).toBe(0);
        expect(calc.includedRequests).toBe(300); // Business plan: 300 * 1 developer
        expect(calc.additionalRequests).toBe(0); // No additional requests needed
        expect(calc.additionalCost).toBe(0); // No additional cost
        expect(calc.budgetStatus).toBe('unlimited');
        expect(calc.developers).toBe(1);
      });

      it('should calculate correctly for premium model with multiplier 1', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1
          })
          .expect(200);

        const calc = response.body.calculation;
        // Premium model has 1x multiplier, so 500 * 1 = 500 premium requests
        expect(calc.totalPremiumRequests).toBe(500);
        expect(calc.includedRequests).toBe(300); // Business plan: 300 * 1 developer
        expect(calc.additionalRequests).toBe(200); // 500 - 300 = 200 additional
        expect(calc.additionalCost).toBe(8); // 200 * 0.04 = 8
        expect(calc.budgetStatus).toBe('unlimited');
      });

      it('should calculate correctly for high multiplier model', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'gpt-45',
            requests: 10,
            developers: 1
          })
          .expect(200);

        const calc = response.body.calculation;
        // GPT-4.5 has 50x multiplier, so 10 * 50 = 500 premium requests
        expect(calc.totalPremiumRequests).toBe(500);
        expect(calc.includedRequests).toBe(300); // Business plan: 300 * 1 developer
        expect(calc.additionalRequests).toBe(200); // 500 - 300 = 200 additional
        expect(calc.additionalCost).toBe(8); // 200 * 0.04 = 8
      });

      it('should calculate correctly for multiple developers', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 200,
            developers: 3
          })
          .expect(200);

        const calc = response.body.calculation;
        // 200 requests * 1 multiplier * 3 developers = 600 total premium requests
        expect(calc.totalPremiumRequests).toBe(600);
        expect(calc.includedRequests).toBe(900); // Business plan: 300 * 3 developers
        expect(calc.additionalRequests).toBe(0); // 600 < 900, so no additional requests
        expect(calc.additionalCost).toBe(0);
        expect(calc.developers).toBe(3);
      });

      it('should calculate correctly for enterprise plan', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'enterprise',
            model: 'premium-gpt-41',
            requests: 1200,
            developers: 1
          })
          .expect(200);

        const calc = response.body.calculation;
        expect(calc.totalPremiumRequests).toBe(1200);
        expect(calc.includedRequests).toBe(1000); // Enterprise plan: 1000 * 1 developer
        expect(calc.additionalRequests).toBe(200); // 1200 - 1000 = 200 additional
        expect(calc.additionalCost).toBe(8); // 200 * 0.04 = 8
      });

      it('should calculate correctly with fractional multipliers', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'o3-mini',
            requests: 1000,
            developers: 1
          })
          .expect(200);

        const calc = response.body.calculation;
        // o3-mini has 0.33x multiplier, so 1000 * 0.33 = 330 premium requests
        expect(calc.totalPremiumRequests).toBe(330);
        expect(calc.includedRequests).toBe(300);
        expect(calc.additionalRequests).toBe(30); // 330 - 300 = 30 additional
        expect(calc.additionalCost).toBe(1.2); // 30 * 0.04 = 1.2
      });
    });

    describe('Budget Status Tests', () => {
      it('should return unlimited budget status when no budget provided', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1
          })
          .expect(200);

        expect(response.body.calculation.budgetStatus).toBe('unlimited');
        expect(response.body.input.budget).toBe(0);
      });

      it('should return unlimited budget status when budget is 0', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1,
            budget: 0
          })
          .expect(200);

        expect(response.body.calculation.budgetStatus).toBe('unlimited');
        expect(response.body.input.budget).toBe(0);
      });

      it('should return within-budget status when cost is within budget', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1,
            budget: 10
          })
          .expect(200);

        expect(response.body.calculation.budgetStatus).toBe('within-budget');
        expect(response.body.calculation.additionalCost).toBe(8); // Cost is 8, budget is 10
        expect(response.body.input.budget).toBe(10);
      });

      it('should return over-budget status when cost exceeds budget', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1,
            budget: 5
          })
          .expect(200);

        expect(response.body.calculation.budgetStatus).toBe('over-budget');
        expect(response.body.calculation.additionalCost).toBe(8); // Cost is 8, budget is 5
        expect(response.body.input.budget).toBe(5);
      });

      it('should return within-budget status when cost equals budget', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 500,
            developers: 1,
            budget: 8
          })
          .expect(200);

        expect(response.body.calculation.budgetStatus).toBe('within-budget');
        expect(response.body.calculation.additionalCost).toBe(8); // Cost is 8, budget is 8
      });
    });

    describe('Response Structure Tests', () => {
      it('should return correct response structure', async () => {
        const response = await request(app)
          .post('/api/calculate')
          .send({
            subscription: 'business',
            model: 'premium-gpt-41',
            requests: 100,
            developers: 1,
            budget: 50
          })
          .expect(200);

        // Check main structure
        expect(response.body).toHaveProperty('calculation');
        expect(response.body).toHaveProperty('input');
        expect(response.body).toHaveProperty('planDetails');
        expect(response.body).toHaveProperty('modelDetails');

        // Check calculation structure
        const calc = response.body.calculation;
        expect(calc).toHaveProperty('totalPremiumRequests');
        expect(calc).toHaveProperty('includedRequests');
        expect(calc).toHaveProperty('additionalRequests');
        expect(calc).toHaveProperty('additionalCost');
        expect(calc).toHaveProperty('budgetStatus');
        expect(calc).toHaveProperty('developers');

        // Check input structure
        const input = response.body.input;
        expect(input).toHaveProperty('subscription', 'business');
        expect(input).toHaveProperty('model', 'premium-gpt-41');
        expect(input).toHaveProperty('requests', 100);
        expect(input).toHaveProperty('developers', 1);
        expect(input).toHaveProperty('budget', 50);

        // Check planDetails structure
        const planDetails = response.body.planDetails;
        expect(planDetails).toHaveProperty('name');
        expect(planDetails).toHaveProperty('price');
        expect(planDetails).toHaveProperty('includedRequests');
        expect(planDetails).toHaveProperty('description');

        // Check modelDetails structure
        const modelDetails = response.body.modelDetails;
        expect(modelDetails).toHaveProperty('name');
        expect(modelDetails).toHaveProperty('multiplier');
        expect(modelDetails).toHaveProperty('description');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });

    it('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      // Express should handle malformed JSON and return 400
    });
  });
});