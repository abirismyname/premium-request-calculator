// Test script for Vercel API functions
// Run with: node test-api.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Vercel request/response objects
const createMockReq = (method = 'GET', body = null) => ({
  method,
  body,
  headers: {}
});

const createMockRes = () => {
  const res = {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      console.log(`Response ${this.statusCode}:`, JSON.stringify(data, null, 2));
      return this;
    },
    end() {
      console.log('Response ended');
      return this;
    }
  };
  return res;
};

async function testAPI() {
  console.log('🧪 Testing Vercel API Functions\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health');
    const { default: healthHandler } = await import('./api/health.js');
    await healthHandler(createMockReq('GET'), createMockRes());

    console.log('\n2. Testing /api/models');
    const { default: modelsHandler } = await import('./api/models.js');
    await modelsHandler(createMockReq('GET'), createMockRes());

    console.log('\n3. Testing /api/plans');
    const { default: plansHandler } = await import('./api/plans.js');
    await plansHandler(createMockReq('GET'), createMockRes());

    console.log('\n4. Testing /api/calculate');
    const { default: calculateHandler } = await import('./api/calculate.js');
    const testBody = {
      subscription: 'business',
      model: 'gpt-4o',
      requests: 500,
      developers: 2,
      budget: 50
    };
    await calculateHandler(createMockReq('POST', testBody), createMockRes());

    console.log('\n✅ All API tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export { testAPI };
