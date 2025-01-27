import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockApi = {
  // Get information about a specific stock
  getStockInfo: async (symbol) => {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  },

  // Get historical data for a stock
  getHistoricalData: async (symbol, period = '1y') => {
    const response = await api.get(`/stocks/${symbol}/historical`, {
      params: { period },
    });
    return response.data;
  },

  // Search for stocks
  searchStocks: async (query) => {
    const response = await api.get(`/stocks/search/${query}`);
    return response.data;
  },
};

export default api; 