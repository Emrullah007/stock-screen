import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Grid, Alert, Button, Paper } from '@mui/material';
import StockSearch from '../components/StockSearch';
import StockInfo from '../components/StockInfo';
import StockChart from '../components/StockChart';
import SentimentAnalysis from '../components/SentimentAnalysis';
import AIRecommendations from '../components/AIRecommendations';
import LoadingModal from '../components/LoadingModal';
import SectionCard from '../components/SectionCard';
import SectionNavigator from '../components/SectionNavigator';
import { useNavigation } from '../context/NavigationContext';
import useScrollSnap from '../hooks/useScrollSnap';
import { scrollToElement } from '../utils/scrollUtils';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SearchIcon from '@mui/icons-material/Search';
import { getStockInfo, getHistoricalData, getStockSentiment } from '../services/api';

// Add global styles for handling search results
const GlobalStyles = () => {
  return (
    <style jsx global>{`
      /* Search results styling */
      .search-container {
        position: relative;
        z-index: 1500;
      }
      
      /* Hide the search title when search results are open */
      .search-container-open ~ .search-title {
        display: none !important;
      }
      
      /* Hide any stray blue boxes */
      .MuiBox-root[style*="background-color: rgb(63, 81, 181)"],
      .MuiBox-root[style*="background-color: #1976D2"],
      .MuiBox-root[style*="background-color: #2196F3"],
      .MuiBox-root[style*="background: linear-gradient"] {
        display: none !important;
      }
    `}</style>
  );
};

const Home = () => {
  const [stockInfo, setStockInfo] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [shouldScrollToInfo, setShouldScrollToInfo] = useState(false);
  
  // Section references
  const infoSectionRef = useRef(null);
  const chartSectionRef = useRef(null);
  const sentimentSectionRef = useRef(null);
  const recommendationsSectionRef = useRef(null);
  
  const { activeSection, sections, navigateToSection } = useNavigation();
  
  // Disable scroll snapping to prevent conflicts with manual navigation
  useScrollSnap({ enabled: false });

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
      
      // Set flag to trigger scrolling after rendering is complete
      setShouldScrollToInfo(true);
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
      
      // Scroll to the sentiment section after loading - with longer timeout for mobile
      setTimeout(() => {
        if (sentimentSectionRef.current) {
          // For mobile devices specifically, use the scroll utility
          if (window.innerWidth < 600) {
            scrollToElement(sentimentSectionRef, -70);
          } else {
            // Use navigation system for desktop
            navigateToSection('sentiment-analysis');
          }
        }
      }, 500); // Increased timeout for mobile devices
    } catch (err) {
      setError('Error fetching sentiment analysis. Please try again.');
      console.error('Error:', err);
    } finally {
      setSentimentLoading(false);
    }
  };

  // Add effect to scroll to info section when data is loaded
  useEffect(() => {
    if (shouldScrollToInfo && stockInfo && infoSectionRef.current) {
      // Wait for the component to be fully rendered
      const timer = setTimeout(() => {
        try {
          // Direct scroll to element
          const element = infoSectionRef.current;
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          
          // Also try using the navigation system as backup
          if (window.innerWidth >= 600) {
            navigateToSection('stock-info');
          }
          
          setShouldScrollToInfo(false); // Reset the flag
        } catch (err) {
          console.error('Error scrolling to stock info:', err);
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [shouldScrollToInfo, stockInfo, infoSectionRef, navigateToSection]);

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <GlobalStyles />
      
      {/* Desktop-only header */}
      <Box sx={{ 
        mb: 3, 
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AutoAwesomeIcon /> 
          AI-Powered Stock Analysis
        </Typography>
      </Box>
      
      {/* Main Content Container */}
      <Container maxWidth="xl" sx={{ 
        px: { xs: 1, sm: 1.5, md: 2 },
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
          gap: 2,
        }}>
          {/* AI Agent Architecture Paper - Moved to the top */}
          <SectionCard
            id="ai-agent-architecture"
            label="AI Agent Architecture"
            icon={<AutoAwesomeIcon sx={{ fontSize: '1.4rem' }} />}
            color="#1976D2"
            className="section-card ai-agent-architecture"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1.5,
                color: 'text.secondary',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                maxWidth: '1200px'
              }}
            >
              Our platform utilizes two specialized AI agents working in sequence to provide comprehensive market analysis and personalized recommendations:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(33, 150, 243, 0.03)',
                  borderRadius: 2,
                  height: '100%',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  width: '100%',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                  },
                  '&::before': {
                    content: '"Agent 1"',
                    position: 'absolute',
                    top: -10,
                    left: 12,
                    bgcolor: 'background.paper',
                    px: 1,
                    py: 0.25,
                    fontSize: '0.7rem',
                    color: '#1565C0',
                    fontWeight: 600,
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(33, 150, 243, 0.15)'
                  }
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: 0.5, 
                    color: '#1565C0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                    Sentiment Analysis Agent
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="div"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      lineHeight: 1.3
                    }}
                  >
                    An intelligent agent that:
                    <ul style={{ marginTop: '4px', marginBottom: '4px', paddingLeft: '18px' }}>
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
                  p: 1.5, 
                  bgcolor: 'rgba(126, 87, 194, 0.03)',
                  borderRadius: 2,
                  height: '100%',
                  border: '1px solid rgba(126, 87, 194, 0.2)',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  width: '100%',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.1)',
                    bgcolor: 'rgba(126, 87, 194, 0.05)',
                  },
                  '&::before': {
                    content: '"Agent 2"',
                    position: 'absolute',
                    top: -10,
                    left: 12,
                    bgcolor: 'background.paper',
                    px: 1,
                    py: 0.25,
                    fontSize: '0.7rem',
                    color: '#5E35B1',
                    fontWeight: 600,
                    borderRadius: '4px',
                    boxShadow: '0 2px 6px rgba(126, 87, 194, 0.15)'
                  }
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: 0.5, 
                    color: '#5E35B1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    <AutoAwesomeIcon sx={{ fontSize: '1rem' }} />
                    Investment Recommendation Agent
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="div"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      lineHeight: 1.3
                    }}
                  >
                    A strategic agent that:
                    <ul style={{ marginTop: '4px', marginBottom: '4px', paddingLeft: '18px' }}>
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
          </SectionCard>

          {/* Search Bar - Moved below the AI Agent Architecture */}
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 2, sm: 3 },
            mt: { xs: 0, md: 2 }
          }}>
            <Box sx={{ 
              width: '100%', 
              maxWidth: '700px',
              mx: 'auto',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              bgcolor: 'white',
              border: '1px solid rgba(25, 118, 210, 0.12)',
              position: 'relative',
              zIndex: 1
            }}>
              <StockSearch onSelect={handleStockSelect} />
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                maxWidth: '600px', 
                mx: 'auto',
                width: '100%'
              }}
            >
              {error}
            </Alert>
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
                  <SectionCard
                    ref={infoSectionRef}
                    id="stock-info"
                    label="Stock Information"
                    icon={<InfoIcon sx={{ fontSize: '1.2rem' }} />}
                    color="#2196F3"
                    className="section-card"
                  >
                    <StockInfo 
                      stockInfo={stockInfo}
                      historicalData={historicalData}
                    />
                  </SectionCard>
                  
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
                  <SectionCard
                    ref={recommendationsSectionRef}
                    id="ai-recommendations"
                    color="#7E57C2"
                    noPadding={true}
                    className="section-card"
                  >
                    <AIRecommendations
                      symbol={stockInfo.symbol}
                      sentimentData={sentimentData}
                      onGenerateSentiment={() => {
                        if (!sentimentData) {
                          handleSentimentAnalysis(stockInfo.symbol);
                        } else {
                          setShowSentiment(true);
                          // For mobile, use scroll utility for more reliable scrolling
                          setTimeout(() => {
                            if (sentimentSectionRef.current) {
                              if (window.innerWidth < 600) {
                                scrollToElement(sentimentSectionRef, -70);
                              } else {
                                navigateToSection('sentiment-analysis');
                              }
                            }
                          }, 300);
                        }
                      }}
                    />
                  </SectionCard>
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
                  <SectionCard
                    ref={chartSectionRef}
                    id="stock-chart"
                    label={`${stockInfo?.info?.name} Stock Price Chart`}
                    icon={<ShowChartIcon sx={{ fontSize: '1.2rem' }} />}
                    color="#009688"
                    className="section-card"
                  >
                    <StockChart 
                      data={historicalData} 
                      stockName={stockInfo?.info?.name}
                    />
                  </SectionCard>

                  {/* Analysis Results Section - Conditional */}
                  {sentimentData && showSentiment && (
                    <SectionCard
                      ref={sentimentSectionRef}
                      id="sentiment-analysis"
                      label="AI News Sentiment Analysis"
                      icon={<TrendingUpIcon sx={{ fontSize: '1.2rem' }} />}
                      color="#2196F3"
                      noPadding={true}
                      className="section-card"
                    >
                      <SentimentAnalysis 
                        data={sentimentData}
                        onClose={() => setShowSentiment(false)}
                      />
                    </SectionCard>
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

      {/* Section Navigator */}
      {stockInfo && sections.length > 0 && (
        <SectionNavigator 
          sections={sections}
          activeSection={activeSection}
          onSectionClick={navigateToSection}
        />
      )}

      {/* Disclaimer Section - Modified to be thinner */}
      <Box sx={{
        mt: 'auto',
        pt: { xs: 1, sm: 1 },
        pb: { xs: 1, sm: 1 },
        px: { xs: 1, sm: 1.5, md: 2 },
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
            gap: 1
          }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1, 
                bgcolor: 'rgba(2, 136, 209, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(2, 136, 209, 0.1)'
              }}
            >
              <Alert 
                severity="info" 
                sx={{ 
                  '& .MuiAlert-message': { 
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    width: '100%'
                  },
                  bgcolor: 'transparent',
                  border: 'none',
                  p: 0,
                  textAlign: 'left',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                    color: '#0288d1',
                    mr: 0.5
                  }
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  ⚠️ Important Disclaimer: This platform is for informational purposes only and does not provide financial advice. AI-generated analyses may contain errors. Markets are unpredictable and past performance does not guarantee future results.
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
          py: { xs: 0.5, sm: 0.75 },
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
                fontSize: '0.7rem',
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