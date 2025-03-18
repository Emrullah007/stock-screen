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
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Sticky Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 1, sm: 1.5, md: 2 },
          mb: { xs: 1.5, sm: 2, md: 3 },
          width: '100%',
        }}
      >
        <Container maxWidth="xl" sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          maxWidth: { sm: '100%', md: '1200px', lg: '1400px' },
          mx: 'auto',
          width: '100%',
        }}>
          <Box sx={{ 
            textAlign: 'center'
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: { xs: 0.25, sm: 0.5 },
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' },
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                color: 'primary.main',
                justifyContent: 'center'
              }}
            >
              <AutoAwesomeIcon 
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '1.8rem' },
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 1
                    },
                    '50%': {
                      transform: 'scale(1.2)',
                      opacity: 0.7
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 1
                    }
                  }
                }} 
              />
              AI-Powered Stock Analysis
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              Smart Investment Decisions Powered by Data Science and AI
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="xl" sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        maxWidth: { sm: '100%', md: '1400px' },
        width: '100%',
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        mx: 'auto',
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          {/* AI Agent Architecture Paper */}
          <Box sx={{ 
            mb: { xs: 2, sm: 3 }, 
            width: '100%',
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 },
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1.5, 
                  color: 'text.primary', 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    borderRadius: '50%',
                    p: 0.8
                  }}
                >
                  🤖
                </Box>
                AI Agent Architecture
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3,
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  maxWidth: '900px'
                }}
              >
                Our platform utilizes two specialized AI agents working in sequence to provide comprehensive market analysis and personalized recommendations:
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'rgba(33, 150, 243, 0.03)',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                      bgcolor: 'rgba(33, 150, 243, 0.05)',
                    },
                    '&::before': {
                      content: '"Agent 1"',
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      bgcolor: 'background.paper',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.75rem',
                      color: '#1565C0',
                      fontWeight: 600,
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)'
                    }
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1.5, 
                      color: '#1565C0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}>
                      <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />
                      Sentiment Analysis Agent
                    </Typography>
                    <Typography 
                      variant="body2" 
                      component="div"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                        lineHeight: 1.6
                      }}
                    >
                      An intelligent agent that:
                      <ul style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '20px' }}>
                        <li>Processes real-time market data and financial metrics</li>
                        <li>Analyzes latest news articles and market trends</li>
                        <li>Evaluates technical indicators and price patterns</li>
                        <li>Assesses overall market sentiment and investor positioning</li>
                        <li>Identifies key investment opportunities and potential risks</li>
                      </ul>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'rgba(126, 87, 194, 0.03)',
                    borderRadius: 2,
                    height: '100%',
                    border: '1px solid rgba(126, 87, 194, 0.2)',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(126, 87, 194, 0.1)',
                      bgcolor: 'rgba(126, 87, 194, 0.05)',
                    },
                    '&::before': {
                      content: '"Agent 2"',
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      bgcolor: 'background.paper',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.75rem',
                      color: '#5E35B1',
                      fontWeight: 600,
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(126, 87, 194, 0.15)'
                    }
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1.5, 
                      color: '#5E35B1', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}>
                      <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
                      Investment Recommendation Agent
                    </Typography>
                    <Typography 
                      variant="body2" 
                      component="div"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                        lineHeight: 1.6
                      }}
                    >
                      A strategic agent that:
                      <ul style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '20px' }}>
                        <li>Utilizes sentiment analysis insights from Agent 1</li>
                        <li>Considers your personal risk tolerance preferences</li>
                        <li>Adapts strategies to current market conditions</li>
                        <li>Generates actionable investment recommendations</li>
                        <li>Provides ongoing monitoring guidance and alerts</li>
                      </ul>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: '400px' }, 
            mb: { xs: 2, sm: 3 },
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
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ 
              width: '100%', 
              m: 0, 
              justifyContent: 'center',
              maxWidth: '1200px',
              mx: 'auto'
            }}>
              {/* Left Column - Stock Info */}
              <Grid item xs={12} md={4} lg={4} sx={{ p: { xs: 0.5, sm: 1, md: 2 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  position: { xs: 'static', md: 'sticky' },
                  top: { xs: 'auto', md: '80px' },
                  zIndex: 5,
                  pt: { xs: 0.5, md: 1 },
                  height: 'fit-content'
                }}>
                  {/* Stock Info Card */}
                  <StockInfo 
                    stockInfo={stockInfo}
                    historicalData={historicalData}
                  />
                  
                  {/* Sentiment Analysis Prompt - when sentiment data doesn't exist */}
                  {!sentimentData && (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: { xs: 1, sm: 1.5 },
                      mb: { xs: 1.5, sm: 2 },
                      width: '100%',
                      backgroundColor: 'rgba(33, 150, 243, 0.02)',
                      borderRadius: 2,
                      p: { xs: 1, sm: 1.5 },
                      border: '1px dashed',
                      borderColor: 'primary.light',
                    }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        width: '100%',
                        textAlign: 'center'
                      }}>
                        <Typography
                          variant="subtitle1" 
                          sx={{
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            fontWeight: 600,
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                          }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
                          Ready to Start Your Analysis?
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            lineHeight: 1.4,
                            mb: { xs: 0.5, sm: 1 }
                          }}
                        >
                          Activate AI Sentiment Analysis for {stockInfo?.info?.name}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSentimentAnalysis(stockInfo.symbol)}
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          textTransform: 'none',
                          borderRadius: '20px',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 2px 4px rgba(33, 203, 243, .3)',
                          py: { xs: 0.25, sm: 0.5 },
                          px: { xs: 1.5, sm: 2 },
                          width: { xs: '95%', sm: '90%' },
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 0.5,
                          '& .MuiSvgIcon-root': {
                            fontSize: '0.9rem'
                          }
                        }}>
                          <TrendingUpIcon />
                          AI News Sentiment Analysis
                        </Box>
                      </Button>
                    </Box>
                  )}
                  
                  {/* AI Recommendations - Always visible with stock info */}
                  <Box sx={{ 
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <AIRecommendations
                      symbol={stockInfo.symbol}
                      sentimentData={sentimentData}
                      onGenerateSentiment={() => {
                        if (!sentimentData) {
                          handleSentimentAnalysis(stockInfo.symbol);
                        } else {
                          setShowSentiment(true);
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Right Column - Chart and Analysis */}
              <Grid item xs={12} md={8} lg={8} sx={{ p: { xs: 0.5, sm: 1, md: 2 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: { xs: 1.5, sm: 2, md: 3 },
                  width: '100%',
                  maxWidth: '900px',
                  mx: 'auto'
                }}>
                  {/* Stock Chart */}
                  <Box sx={{ 
                    width: '100%', 
                    overflow: 'hidden',
                    mb: { xs: 1.5, sm: 2, md: 3 },
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    bgcolor: '#FFFFFF',
                    p: { xs: 1, sm: 1.5, md: 2 }
                  }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 600,
                        mb: { xs: 1, sm: 2 },
                        color: 'text.primary',
                        textAlign: 'center'
                      }}
                    >
                      {stockInfo?.info?.name} Stock Price Chart
                    </Typography>
                    <StockChart 
                      data={historicalData} 
                      stockName={stockInfo?.info?.name}
                    />
                  </Box>

                  {/* Analysis Results Section - Conditional */}
                  {sentimentData && showSentiment && (
                    <Box 
                      ref={sentimentRef} 
                      sx={{ 
                        scrollMargin: { xs: '16px', sm: '20px' },
                        width: '100%',
                        maxWidth: '100%',
                        overflowX: 'hidden'
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
        </Box>
      </Container>

      {/* Disclaimer Section - Regular (not sticky) */}
      <Box sx={{
        mt: 'auto',
        pt: { xs: 1.5, sm: 2 },
        pb: { xs: 1.5, sm: 2 },
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: 'background.default',
        width: '100%',
      }}>
        <Container maxWidth="xl" sx={{ 
          maxWidth: { sm: '100%', md: '1400px' },
          width: '100%',
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'transparent',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.primary',
                  fontSize: '0.95rem',
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
                  textAlign: 'left',
                  '& .MuiAlert-icon': {
                    alignItems: 'center'
                  }
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
      </Box>

      {/* Copyright Notice - Sticky Footer */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTop: '1px solid',
          borderColor: 'divider',
          py: { xs: 0.75, sm: 1, md: 1.5 },
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="xl" sx={{ 
          maxWidth: { sm: '100%', md: '1400px' },
          width: '100%',
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              © {new Date().getFullYear()} AI-Powered Stock Analysis. Developed by{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600
                }}
              >
                Emrullah Celik
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 