import axios from 'axios';

const API_URL = 'http://localhost:8003/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Export individual functions for direct import
export const getStockInfo = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock info for ${symbol}:`, error);
    throw error;
  }
};

export const getHistoricalData = async (symbol, period = '1y') => {
  try {
    const response = await api.get(`/stocks/${symbol}/historical`, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await api.get(`/stocks/search/${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching stocks with query ${query}:`, error);
    throw error;
  }
};

export const getAIRecommendations = async (data) => {
  try {
    const response = await api.post('/ai/recommendations', data);
    return response.data;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};

export const getStockSentiment = async (symbol) => {
  try {
    const response = await api.get(`/ai/sentiment/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting sentiment analysis for ${symbol}:`, error);
    throw error;
  }
};

export default api; 