# GitHub Copilot Premium Requests Calculator

A full-stack web application for calculating GitHub Copilot premium request costs based on subscription plans, AI models, and usage patterns.

## Features

- **Cost Calculation**: Calculate premium request costs based on usage patterns
- **Multiple Plans**: Support for Business and Enterprise subscription plans
- **AI Model Selection**: Choose from various AI models with different cost multipliers
- **Budget Validation**: Set monthly budgets and get visual feedback on cost status
- **Real-time Updates**: Instant calculation updates as you change parameters
- **GitHub Theme**: UI designed to match GitHub's design system

## Tech Stack

### Backend
- Node.js with Express.js
- RESTful API design
- CORS, Helmet, and Morgan middleware
- Environment-based configuration

### Frontend
- React with TypeScript
- Axios for API communication
- Responsive CSS with GitHub design system
- Real-time form validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Setup

#### Option 1: GitHub Codespaces (Recommended)
1. **Open in Codespaces:**
   - Click the green "Code" button in GitHub
   - Select "Create codespace on main"
   - Wait for the environment to set up automatically

2. **Start Development:**
   ```bash
   npm run dev
   ```

#### Option 2: Local Desktop Development
1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd premium-request-calculator
   npm run setup
   ```

2. **Start Development:**
   ```bash
   npm run dev
   ```

### Environment Configuration

The app automatically detects whether it's running in Codespaces or desktop and configures the API URLs accordingly. No manual configuration needed!

**Manual Configuration (Optional):**
- Copy `.env.example` to `.env` for backend settings
- Copy `client/.env.example` to `client/.env` for frontend settings

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run build` - Build the React app for production
- `npm start` - Start the production server
- `npm run install-all` - Install dependencies for both frontend and backend

## API Documentation

### Endpoints

#### `GET /api/health`
Health check endpoint
- **Response**: `{ status: 'OK', timestamp: ISO string }`

#### `GET /api/models`
Get available AI models and their multipliers
- **Response**: Object with model configurations

#### `GET /api/plans`
Get subscription plan details
- **Response**: Object with plan configurations (Business/Enterprise)

#### `POST /api/calculate`
Calculate premium request costs
- **Request Body**:
  ```json
  {
    "subscription": "business|enterprise",
    "model": "model-key",
    "requests": number,
    "budget": number (optional)
  }
  ```
- **Response**: Calculation results with cost breakdown

## Pricing Information

### Subscription Plans
- **Business**: $19/month, 300 premium requests included
- **Enterprise**: $39/month, 1000 premium requests included

### Additional Costs
- Additional premium requests: $0.04 USD per request
- Base model (GPT-4.1): Free for paid plans

### Model Multipliers
- Base model (GPT-4.1): 0× (free for paid users)
- Standard models (GPT-4o, Claude): 1× multiplier
- Advanced models (GPT-4.5): 50× multiplier
- Premium models (o1, Claude Opus): 10× multiplier
- Efficient models (Gemini Flash, o3-mini): 0.25-0.33× multiplier

## Project Structure

```
premium-request-calculator/
├── server/                 # Backend Express.js application
│   └── index.js           # Main server file with API routes
├── client/                # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Calculator.tsx
│   │   │   └── Calculator.css
│   │   ├── App.tsx        # Main App component
│   │   └── App.css        # Global styles
│   └── package.json       # Frontend dependencies
├── .github/
│   └── copilot-instructions.md
├── package.json           # Root package.json with scripts
├── .env                   # Backend environment variables
└── README.md
```

## Development

### Backend Development
The backend runs on port 5001 and provides a RESTful API for calculations. Key features:
- Express.js with security middleware
- Input validation and error handling
- CORS configuration for frontend communication

### Frontend Development
The React frontend runs on port 3000 with hot reloading. Key features:
- TypeScript for type safety
- Component-based architecture
- Real-time API communication
- Responsive GitHub-themed design

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.
