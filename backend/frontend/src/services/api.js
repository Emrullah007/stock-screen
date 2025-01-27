import axios from 'axios';

// Get the base URL from environment variables or use a default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003/api/v1';

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
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

export const getHistoricalData = async (symbol, period = '1y') => {
  const response = await api.get(`/stocks/${symbol}/historical/${period}`);
  return response.data;
};

export const searchStocks = async (query) => {
  const response = await api.get(`/stocks/search?query=${query}`);
  return response.data;
};

export const getAIRecommendations = async (stocks, riskLevel, investmentHorizon) => {
  const response = await api.post('/ai/recommendations', {
    stocks,
    risk_level: riskLevel,
    investment_horizon: investmentHorizon,
  });
  return response.data;
};

export const getStockSentiment = async (symbol) => {
  const response = await api.get(`/ai/sentiment/${symbol}`);
  return response.data;
};

export default api; 