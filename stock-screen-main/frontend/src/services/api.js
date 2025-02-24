import axios from 'axios';

// Get the base URL from environment variables or use a default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Export individual API functions
export const getStockInfo = async (symbol) => {
  const response = await api.get(`/GetStockData`, {
    params: { symbol }
  });
  return response.data;
};

export const getHistoricalData = async (symbol, period = '1y') => {
  const response = await api.get(`/GetStockHistory`, {
    params: { symbol, period }
  });
  return response.data;
};

export const getStockSentiment = async (symbol) => {
  const response = await api.get(`/GetSentimentAnalysis`, {
    params: { symbol }
  });
  return response.data;
};

export const getAIRecommendations = async (symbol, riskLevel, investmentHorizon, sentimentData) => {
  try {
    const response = await api.post('/GetInvestmentRecommendation', {
      symbol,
      risk_level: riskLevel,
      investment_horizon: investmentHorizon,
      sentiment_analysis: sentimentData.sentiment_analysis,
      market_metrics: sentimentData.market_metrics
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

// Simple stock search function that uses GetStockData
export const searchStocks = async (query) => {
  try {
    const response = await api.get(`/GetStockData`, {
      params: { symbol: query.toUpperCase() }
    });
    return [response.data]; // Return as array to match expected format
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return []; // Return empty array if stock not found
    }
    throw error;
  }
};

export default api; 