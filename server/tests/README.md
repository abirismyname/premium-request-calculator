# Server API Unit Tests

This directory contains comprehensive unit tests for the Premium Request Calculator API.

## Test Coverage

The tests cover all API endpoints:

### Health Endpoint (`GET /api/health`)
- Returns correct health status response
- Validates response structure and timestamp

### Models Endpoint (`GET /api/models`)
- Returns all available AI models
- Validates model structure and properties
- Verifies correct multiplier values for each model

### Plans Endpoint (`GET /api/plans`)
- Returns subscription plan data
- Validates plan structure and pricing information

### Calculate Endpoint (`POST /api/calculate`)
- **Validation Tests**: Tests all input validation scenarios
  - Missing required fields
  - Invalid subscription plans
  - Invalid models
  - Negative requests and invalid developer counts
- **Calculation Tests**: Verifies the core business logic
  - Different model multipliers (0x, 1x, 50x, fractional)
  - Multiple developers calculation
  - Business vs Enterprise plan differences
- **Budget Status Tests**: Tests budget validation logic
  - Unlimited budget scenarios
  - Within-budget and over-budget calculations
- **Response Structure Tests**: Validates API response format

### Error Handling
- 404 for non-existent routes
- Proper JSON parsing error handling

## Running Tests

```bash
# Run all server tests
npm run test:server

# Run tests with coverage report
npm run test:server:coverage

# Run tests in watch mode (for development)
npm run test:server:watch

# Run all tests (server + client)
npm test
```

## Test Statistics

- **27 test cases** covering all API functionality
- **91.17% statement coverage**
- **83.67% branch coverage**
- Tests all validation scenarios and business logic calculations

## Files

- `api.test.js` - Main test file containing all API endpoint tests
- Generated coverage reports are available in `/coverage` directory (excluded from git)

## Dependencies

- **Jest** - Test runner and assertion library
- **Supertest** - HTTP endpoint testing library

## Test Philosophy

The tests follow these principles:
- Test all public API endpoints
- Comprehensive input validation testing
- Business logic verification with various scenarios
- Error handling and edge case coverage
- Response structure validation