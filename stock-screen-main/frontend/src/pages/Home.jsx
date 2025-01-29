import React, { useState, useRef } from 'react';
import { Container, Box, Typography, CircularProgress, Grid, Alert } from '@mui/material';
import StockSearch from '../components/StockSearch';
import StockInfo from '../components/StockInfo';
import StockChart from '../components/StockChart';
import SentimentAnalysis from '../components/SentimentAnalysis';
import AIRecommendations from '../components/AIRecommendations';
import LoadingModal from '../components/LoadingModal';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getStockInfo, getHistoricalData, getStockSentiment } from '../services/api';

const Home = () => {
  const [stockInfo, setStockInfo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const sentimentRef = useRef(null);

  const clearAnalyses = () => {
    // Clear sentiment analysis
    setSentimentData(null);
    setShowSentiment(false);
    // Clear selected stocks (which will clear recommendations)
    setSelectedStocks([]);
  };

  const handleStockSelect = async (symbol) => {
    setLoading(true);
    setError(null);
    // Clear previous analyses when new stock is selected
    clearAnalyses();

    try {
      const [info, history] = await Promise.all([
        getStockInfo(symbol),
        getHistoricalData(symbol)
      ]);
      setStockInfo(info);
      setHistoricalData(history);
      setSelectedStocks([symbol]); // Set new selected stock
    } catch (err) {
      setError('Error fetching stock data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSentimentAnalysis = async (symbol) => {
    setSentimentLoading(true);
    setError(null);
    
    try {
      const sentiment = await getStockSentiment(symbol);
      setSentimentData(sentiment);
      setShowSentiment(true);
      setTimeout(() => {
        if (sentimentRef.current) {
          sentimentRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (err) {
      setError('Error fetching sentiment analysis. Please try again.');
      console.error('Error:', err);
    } finally {
      setSentimentLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ px: 3 }}>
      <Box sx={{ 
        py: 3,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              fontSize: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main'
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: '1.8rem' }} />
            AI-Powered Stock Analysis
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              fontSize: '1rem',
              mb: 3
            }}
          >
            Market Insights Enhanced by Artificial Intelligence
          </Typography>
          <Alert 
            severity="info" 
            sx={{ 
              '& .MuiAlert-message': { 
                fontSize: '0.875rem' 
              },
              bgcolor: 'rgba(2, 136, 209, 0.05)'
            }}
          >
            <Typography variant="body2">
              <strong>Disclaimer:</strong> This platform is for informational purposes only and does not provide financial advice. 
              AI-generated analyses may contain errors or inaccuracies. 
              Please consult with a qualified financial advisor before making investment decisions.
            </Typography>
          </Alert>
        </Box>
        
        <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
          <StockSearch onSelect={handleStockSelect} />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
            {error}
          </Typography>
        )}

        {stockInfo && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={5} lg={4}>
              <Box>
                <StockInfo 
                  stockInfo={stockInfo} 
                  onSentimentAnalysis={handleSentimentAnalysis}
                />
                <Box sx={{ mt: 3 }}>
                  <AIRecommendations selectedStocks={selectedStocks} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <Box>
                <StockChart 
                  data={historicalData} 
                  stockName={stockInfo?.name}
                />
                {showSentiment && sentimentData && (
                  <Box 
                    ref={sentimentRef} 
                    sx={{ 
                      mt: 3,
                      scrollMargin: '20px',
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    <SentimentAnalysis 
                      data={sentimentData}
                      onClose={() => setShowSentiment(false)}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        )}

        <LoadingModal open={sentimentLoading} type={sentimentLoading ? 'sentiment' : 'recommendations'} />
      </Box>
    </Container>
  );
};

export default Home; 