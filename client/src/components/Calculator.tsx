import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calculator.css';

interface Model {
  name: string;
  multiplier: number;
  description: string;
}

interface Plan {
  name: string;
  price: number;
  includedRequests: number;
  description: string;
}

interface CalculationResult {
  totalPremiumRequests: number;
  includedRequests: number;
  additionalRequests: number;
  additionalCost: number;
  budgetStatus: 'unlimited' | 'within-budget' | 'over-budget';
}

// Dynamic API URL detection for different environments
const getApiBaseUrl = () => {
  // Use environment variable if set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For production (Vercel), use relative URLs to same domain
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }

  // For Codespaces, use the current hostname with backend port
  if (window.location.hostname.includes('github.dev') || window.location.hostname.includes('codespaces')) {
    return `${window.location.protocol}//${window.location.hostname.replace('-3000', '-5001')}/api`;
  }
  
  // Default to localhost for desktop development
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log environment info for debugging
console.log('Environment Detection:', {
  hostname: window.location.hostname,
  isCodespaces: window.location.hostname.includes('github.dev') || window.location.hostname.includes('codespaces'),
  apiUrl: API_BASE_URL,
  envVar: process.env.REACT_APP_API_URL
});

const Calculator: React.FC = () => {
  const [models, setModels] = useState<Record<string, Model>>({});
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [formData, setFormData] = useState({
    subscription: 'business',
    model: 'base-gpt-41',
    requests: 500,
    developers: 1,
    budget: 0
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch models and plans on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from:', API_BASE_URL);

        // Test the connection first
        console.log('Testing connection...');
        const healthRes = await axios.get(`${API_BASE_URL}/health`);
        console.log('Health check successful:', healthRes.data);

        const [modelsRes, plansRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/models`),
          axios.get(`${API_BASE_URL}/plans`)
        ]);
        setModels(modelsRes.data);
        setPlans(plansRes.data);
        console.log('Data loaded successfully');
      } catch (err: any) {
        console.error('Error fetching data:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          url: err.config?.url,
          method: err.config?.method
        });

        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to backend server. Please ensure the server is running on port 5001.');
        } else if (err.response?.status === 0) {
          setError('CORS error: Frontend cannot communicate with backend. Check CORS configuration.');
        } else {
          setError(`Failed to load configuration data: ${err.message}`);
        }
      }
    };

    fetchData();
  }, []);

  // Calculate whenever form data changes
  useEffect(() => {
    if (Object.keys(models).length > 0 && Object.keys(plans).length > 0) {
      calculateCost();
    }
  }, [formData, models, plans]);

  const calculateCost = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/calculate`, formData);
      setResult(response.data.calculation);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Calculation failed');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getBudgetStatusClass = (status: string) => {
    switch (status) {
      case 'over-budget': return 'over-budget';
      case 'within-budget': return 'within-budget';
      default: return '';
    }
  };

  return (
    <div className="calculator-container">
      <div className="header">
        <div className="header-container">
          <svg className="github-logo" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <h1>Copilot Premium Requests Calculator</h1>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="calculator-grid">
          <div className="card">
            <h2><i className="fas fa-cog"></i> Configuration</h2>
            
            <div className="form-group">
              <label htmlFor="subscription">Subscription Plan</label>
              <select 
                id="subscription" 
                className="form-control"
                value={formData.subscription}
                onChange={(e) => handleInputChange('subscription', e.target.value)}
              >
                {Object.entries(plans).map(([key, plan]) => (
                  <option key={key} value={key}>
                    {plan.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="model">AI Model</label>
              <select 
                id="model" 
                className="form-control"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              >
                {Object.entries(models).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="requests">Number of Requests per Developer per Month</label>
              <input 
                type="text" 
                id="requests" 
                className="form-control" 
                value={formData.requests}
                placeholder="Enter number of requests per developer"
                onChange={(e) => handleInputChange('requests', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="developers">Number of Developers</label>
              <input 
                type="text" 
                id="developers" 
                className="form-control" 
                value={formData.developers}
                placeholder="Enter number of developers"
                onChange={(e) => handleInputChange('developers', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Monthly Budget (USD)</label>
              <div className="input-group">
                <span className="input-prefix">$</span>
                <input 
                  type="text" 
                  id="budget" 
                  className="form-control" 
                  value={formData.budget}
                  placeholder="0 = unlimited"
                  onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2><i className="fas fa-calculator"></i> Cost Breakdown</h2>
            
            {loading ? (
              <div className="loading">Calculating...</div>
            ) : result ? (
              <>
                <div className="result-grid">
                  <div className="result-item">
                    <h3>Total Premium Requests</h3>
                    <div className="result-value">{result.totalPremiumRequests}</div>
                  </div>
                  
                  <div className="result-item">
                    <h3>Included in Plan</h3>
                    <div className="result-value">{result.includedRequests}</div>
                  </div>
                  
                  <div className="result-item">
                    <h3>Additional Requests</h3>
                    <div className="result-value">{result.additionalRequests}</div>
                  </div>
                  
                  <div className="result-item">
                    <h3>Additional Cost</h3>
                    <div className="result-value">${result.additionalCost.toFixed(2)}</div>
                  </div>
                </div>

                <div className="result-section">
                  <div className="result-item total-cost">
                    <h3>Total Monthly Cost</h3>
                    <div className={`result-value ${getBudgetStatusClass(result.budgetStatus)}`}>
                      ${result.additionalCost.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="formula-box">
                  <strong>Formula:</strong><br/>
                  Premium Requests = User Requests × Model Multiplier × Developers<br/>
                  Total Allowance = Plan Allowance × Developers<br/>
                  Additional Cost = max(0, Premium Requests - Total Allowance) × $0.04
                </div>
              </>
            ) : (
              <div className="no-result">Configure options to see calculation</div>
            )}
          </div>
        </div>

        <div className="info-box">
          <h3><i className="fas fa-info-circle"></i> Important Information</h3>
          <p>• Premium requests beyond your plan's allowance cost <strong>$0.04 USD per request</strong></p>
          <p>• Business plan includes <strong>300 premium requests</strong> per developer per month</p>
          <p>• Enterprise plan includes <strong>1000 premium requests</strong> per developer per month</p>
          <p>• Each developer gets their own full allowance of premium requests</p>
          <p>• Base model (GPT-4.1) usage is free for paid plans and doesn't count against your allowance</p>
          <p>• Billing starts June 4, 2025. Rate limiting may apply during high demand periods.</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
