# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack web application for calculating GitHub Copilot Premium Request costs. The project consists of:

- **Backend**: Node.js with Express.js API server (port 5000)
- **Frontend**: React with TypeScript application (port 3000)
- **Architecture**: RESTful API with React SPA frontend

## Technology Stack
- **Backend**: Node.js, Express.js, CORS, Helmet, Morgan
- **Frontend**: React, TypeScript, Axios
- **Styling**: Custom CSS with GitHub design system theme
- **Development**: Nodemon, Concurrently for development workflow

## Key Features
- Calculate premium request costs based on subscription plans (Business/Enterprise)
- Support for multiple AI models with different cost multipliers
- Budget validation and cost breakdown
- Real-time calculations via API calls
- GitHub-themed responsive UI

## Development Guidelines
- Follow GitHub's design system for UI components
- Use TypeScript for type safety in React components
- Implement proper error handling in both frontend and backend
- Keep API routes RESTful and well-documented
- Use environment variables for configuration
- Maintain responsive design principles

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/models` - Available AI models and multipliers
- `GET /api/plans` - Subscription plans data
- `POST /api/calculate` - Calculate premium request costs

## File Structure
- `/server/` - Backend Express.js application
- `/client/` - React frontend application
- `/client/src/components/` - React components
- Environment variables in `.env` files for both frontend and backend
