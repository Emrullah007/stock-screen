import React, { useState, useRef } from 'react';
import { Container, Box, Typography, CircularProgress, Grid, Alert, Button, Paper } from '@mui/material';
import StockSearch from '../components/StockSearch';
import StockInfo from '../components/StockInfo';
import StockChart from '../components/StockChart';
import SentimentAnalysis from '../components/SentimentAnalysis';
import AIRecommendations from '../components/AIRecommendations';
import LoadingModal from '../components/LoadingModal';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getStockInfo, getHistoricalData, getStockSentiment } from '../services/api';

const Home = () => {
  const [stockInfo, setStockInfo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const sentimentRef = useRef(null);

  const clearAnalyses = () => {
    setSentimentData(null);
    setShowSentiment(false);
  };

  const handleStockSelect = async (symbol) => {
    setLoading(true);
    setError(null);
    // Clear all analyses when a new stock is selected
    clearAnalyses();
    setStockInfo(null); // Clear current stock info
    setHistoricalData([]); // Clear historical data

    try {
      const [info, historyResponse] = await Promise.all([
        getStockInfo(symbol),
        getHistoricalData(symbol)
      ]);
      setStockInfo(info);
      // Check if history data exists and has the expected format
      if (historyResponse && historyResponse.history && Array.isArray(historyResponse.history)) {
        setHistoricalData(historyResponse.history);
      } else {
        setHistoricalData([]);
      }
    } catch (err) {
      setError('Error fetching stock data. Please try again.');
      console.error('Error:', err);
      setHistoricalData([]);
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
    <Container maxWidth="xl" sx={{ 
      px: { xs: 2, sm: 3 },
      maxWidth: { xl: '1600px' }
    }}>
      <Box sx={{ 
        py: { xs: 2, sm: 3 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ 
          mb: { xs: 3, sm: 4 }, 
          textAlign: { xs: 'center', sm: 'left' } 
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }} />
            AI-Powered Stock Analysis
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: 2
            }}
          >
            Smart Investment Decisions Powered by Data Science and AI
          </Typography>

          <Box sx={{ 
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontSize: '1rem' }}>
                🤖 AI Agent Architecture
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Our platform utilizes two specialized AI agents working in sequence to provide comprehensive market analysis and personalized recommendations:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    position: 'relative',
                    '&::before': {
                      content: '"Agent 1"',
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      bgcolor: 'background.paper',
                      px: 1,
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      fontWeight: 500
                    }
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      color: 'primary.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      fontWeight: 600
                    }}>
                      <AutoAwesomeIcon sx={{ fontSize: '1rem' }} />
                      Sentiment Analysis Agent
                    </Typography>
                    <Typography variant="body2" component="div">
                      An intelligent agent that:
                      <ul style={{ marginTop: '4px', marginBottom: '4px', paddingLeft: '20px' }}>
                        <li>Processes real-time market data</li>
                        <li>Analyzes latest news and trends</li>
                        <li>Evaluates technical indicators</li>
                        <li>Assesses market sentiment</li>
                        <li>Identifies key opportunities and risks</li>
                      </ul>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'secondary.light',
                    position: 'relative',
                    '&::before': {
                      content: '"Agent 2"',
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      bgcolor: 'background.paper',
                      px: 1,
                      fontSize: '0.75rem',
                      color: 'secondary.main',
                      fontWeight: 500
                    }
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      color: 'secondary.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      fontWeight: 600
                    }}>
                      <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                      Investment Recommendation Agent
                    </Typography>
                    <Typography variant="body2" component="div">
                      A strategic agent that:
                      <ul style={{ marginTop: '4px', marginBottom: '4px', paddingLeft: '20px' }}>
                        <li>Utilizes sentiment analysis insights</li>
                        <li>Considers your risk preferences</li>
                        <li>Adapts to market conditions</li>
                        <li>Generates actionable strategies</li>
                        <li>Provides monitoring guidance</li>
                      </ul>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
        
        <Box sx={{ 
          width: '100%', 
          maxWidth: { xs: '100%', sm: 400 }, 
          mb: 3,
          mx: { xs: 'auto', sm: 0 }
        }}>
          <StockSearch onSelect={handleStockSelect} />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ 
            mt: 1, 
            fontSize: '0.875rem',
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            {error}
          </Typography>
        )}

        {stockInfo && (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} md={5} lg={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 2, sm: 3 }
              }}>
                <StockInfo 
                  stockInfo={stockInfo}
                  historicalData={historicalData}
                />
                {!sentimentData && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: { xs: 1, sm: 2 }
                  }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleSentimentAnalysis(stockInfo.symbol)}
                      sx={{ 
                        fontSize: '0.95rem',
                        height: '48px',
                        width: '100%',
                        maxWidth: '400px',
                        textTransform: 'none',
                        borderRadius: '24px',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        letterSpacing: '0.5px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                          boxShadow: '0 4px 6px 2px rgba(33, 203, 243, .4)',
                          transform: 'translateY(-1px)',
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1,
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.2rem'
                        }
                      }}>
                        <AutoAwesomeIcon />
                        <TrendingUpIcon />
                        AI News Sentiment Analysis
                      </Box>
                    </Button>
                  </Box>
                )}
                <Box>
                  <AIRecommendations 
                    symbol={stockInfo.symbol} 
                    sentimentData={sentimentData}
                    onGenerateSentiment={() => handleSentimentAnalysis(stockInfo.symbol)}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: { xs: 2, sm: 3 }
              }}>
                <StockChart 
                  data={historicalData} 
                  stockName={stockInfo?.info?.name}
                />
                {showSentiment && sentimentData && (
                  <Box 
                    ref={sentimentRef} 
                    sx={{ 
                      scrollMargin: { xs: '16px', sm: '20px' },
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

        <LoadingModal 
          open={sentimentLoading} 
          type="sentiment"
        />

        {/* Disclaimer Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 4,
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            ⚠️ Important Disclaimer
          </Typography>
          <Alert 
            severity="info" 
            sx={{ 
              '& .MuiAlert-message': { 
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              },
              bgcolor: 'rgba(2, 136, 209, 0.05)',
              textAlign: 'left'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Financial Advice Disclaimer:</strong> This platform is for informational purposes only and does not provide financial advice. 
              AI-generated analyses may contain errors or inaccuracies. 
              Please consult with a qualified financial advisor before making investment decisions.
            </Typography>
            <Typography variant="body2">
              <strong>AI Analysis Disclaimer:</strong> The AI agents provide analysis based on available data and market indicators. 
              While we strive for accuracy, markets are inherently unpredictable and past performance does not guarantee future results.
            </Typography>
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 