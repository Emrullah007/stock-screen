import axios from 'axios';

// Get the base URL from environment variables or use a default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

/**
 * Centralized API client for all backend communications
 * Preconfigured with base URL and common headers
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Global response interceptor for consistent error handling
 * Logs errors to console and propagates them to the calling component
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Retrieves basic stock information for a given symbol
 * 
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL')
 * @returns {Promise<Object>} - Stock information including price, company data, and metrics
 */
export const getStockInfo = async (symbol) => {
  const response = await api.get(`/GetStockData`, {
    params: { symbol }
  });
  return response.data;
};

/**
 * Fetches historical price data for charting
 * 
 * @param {string} symbol - Stock ticker symbol
 * @param {string} period - Time period for historical data (default: '1y')
 * @returns {Promise<Object>} - Historical price data with OHLC values
 */
export const getHistoricalData = async (symbol, period = '1y') => {
  const response = await api.get(`/GetStockHistory`, {
    params: { symbol, period }
  });
  return response.data;
};

/**
 * Retrieves AI-generated sentiment analysis for a stock
 * Analyzes news, technical indicators, and market metrics
 * 
 * @param {string} symbol - Stock ticker symbol
 * @returns {Promise<Object>} - Sentiment analysis data including market context and metrics
 */
export const getStockSentiment = async (symbol) => {
  const response = await api.get(`/GetSentimentAnalysis`, {
    params: { symbol }
  });
  return response.data;
};

/**
 * Gets personalized investment recommendations based on sentiment analysis
 * and user preferences for risk and investment horizon
 * 
 * @param {string} symbol - Stock ticker symbol
 * @param {string} riskLevel - User's risk tolerance ('conservative', 'moderate', 'aggressive')
 * @param {string} investmentHorizon - Time horizon ('short-term', 'medium-term', 'long-term')
 * @param {Object} sentimentData - Sentiment analysis data from previous API call
 * @returns {Promise<Object>} - Personalized investment recommendations
 */
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

/**
 * Simple stock search function that leverages the GetStockData endpoint
 * Used for stock symbol lookup in the search component
 * 
 * @param {string} query - Stock symbol to search for
 * @returns {Promise<Array>} - Array of matching stocks (or empty array if none found)
 */
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