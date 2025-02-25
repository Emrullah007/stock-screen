import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReactMarkdown from 'react-markdown';
import { getAIRecommendations } from '../services/api';
import LoadingModal from './LoadingModal';

const AIRecommendations = ({ symbol, sentimentData, onGenerateSentiment }) => {
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState('medium-term');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const recommendationRef = useRef(null);

  const handleGetRecommendations = async () => {
    if (!symbol) {
      setError('Please select a stock first');
      return;
    }

    if (!sentimentData) {
      setError('Please generate sentiment analysis first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAIRecommendations(symbol, riskLevel, investmentHorizon, sentimentData);
      setRecommendation(data);
      // Scroll to recommendation
      setTimeout(() => {
        if (recommendationRef.current) {
          recommendationRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (err) {
      setError('Error getting AI recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!sentimentData) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: '1.1rem',
            fontWeight: 500,
            color: 'primary.main'
          }}>
            <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
            AI Investment Recommendations
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            Please generate an AI News Sentiment Analysis first to receive personalized investment recommendations.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: 'primary.main'
        }}>
          <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
          AI Investment Recommendations
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              label="Risk Level"
            >
              <MenuItem value="conservative">Conservative</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="aggressive">Aggressive</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Investment Horizon</InputLabel>
            <Select
              value={investmentHorizon}
              onChange={(e) => setInvestmentHorizon(e.target.value)}
              label="Investment Horizon"
            >
              <MenuItem value="short-term">Short Term (less than 1 year)</MenuItem>
              <MenuItem value="medium-term">Medium Term (1-3 years)</MenuItem>
              <MenuItem value="long-term">Long Term (3+ years)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGetRecommendations}
            disabled={loading || !symbol}
            sx={{ 
              height: '44px',
              borderRadius: '22px',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              background: 'linear-gradient(45deg, #7E57C2 30%, #B388FF 90%)',
              boxShadow: '0 3px 5px 2px rgba(126, 87, 194, .3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #5E35B1 30%, #7C4DFF 90%)',
                boxShadow: '0 4px 6px 2px rgba(126, 87, 194, .4)',
              }
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
            Generate AI Recommendations
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {recommendation && (
          <Paper 
            ref={recommendationRef}
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default',
              '& h1, & h2, & h3': {
                fontWeight: 600,
                my: 2,
                color: 'primary.main',
                fontSize: '1.1rem'
              },
              '& p': {
                mb: 2,
                color: 'text.primary'
              },
              '& ul, & ol': {
                mt: 0,
                mb: 2,
                pl: 2
              },
              '& li': {
                mb: 1,
                color: 'text.primary'
              },
              '& strong': {
                color: 'primary.main',
                fontWeight: 600
              }
            }}
          >
            <ReactMarkdown components={{
              p: ({ node, children }) => (
                <Typography 
                  component="div" 
                  sx={{ 
                    mb: 2,
                    '& p': {
                      margin: 0,
                      padding: 0
                    }
                  }}
                >
                  {children}
                </Typography>
              ),
              h3: ({ node, children }) => (
                <Typography variant="h6" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {children}
                </Typography>
              )
            }}>
              {recommendation.recommendation}
            </ReactMarkdown>
            <Box sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <Typography sx={{ 
                color: 'text.secondary', 
                fontSize: '0.875rem', 
                mb: 0.5, 
                fontWeight: 600 
              }}>
                Analysis based on:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Typography sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.875rem', 
                  minWidth: '130px' 
                }}>
                  Risk Level:
                </Typography>
                <Typography sx={{ 
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Typography sx={{ 
                  color: 'text.secondary', 
                  fontSize: '0.875rem', 
                  minWidth: '130px' 
                }}>
                  Investment Horizon:
                </Typography>
                <Typography sx={{ 
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {investmentHorizon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
              </Box>
              <Typography sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                mt: 1,
                textAlign: 'right',
                ml: 2
              }}>
                Last Updated: {new Date(recommendation.analysis_timestamp).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        )}
      </CardContent>

      <LoadingModal open={loading} type="recommendations" />
    </Card>
  );
};

export default AIRecommendations; 