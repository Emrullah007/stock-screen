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
  Chip,
  Grid,
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
            color: '#7E57C2'
          }}>
            <AutoAwesomeIcon sx={{ 
              fontSize: '1.2rem',
              color: '#7E57C2'
            }} />
            AI Investment Recommendations
          </Typography>
          
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2,
              '& .MuiAlert-message': {
                width: '100%'
              },
              '& .MuiAlert-icon': {
                color: '#7E57C2'
              },
              bgcolor: 'rgba(126, 87, 194, 0.08)',
              color: '#5E35B1',
              '& .MuiAlert-message': {
                color: '#5E35B1'
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
    <Card 
      elevation={3}
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #7E57C2 0%, #B388FF 100%)',
          borderRadius: '4px 4px 0 0',
        },
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            pb: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <AutoAwesomeIcon 
                  sx={{ 
                    fontSize: '1.2rem',
                    color: '#7E57C2',
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
                <Typography variant="h6" sx={{ 
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#7E57C2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  AI Investment Recommendations
                </Typography>
              </Box>
              <Chip
                label="Active"
                size="small"
                sx={{
                  bgcolor: '#7E57C2',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: '20px'
                }}
              />
            </Box>
          </Box>

          {/* Form Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2,
              bgcolor: 'rgba(126, 87, 194, 0.04)',
              borderRadius: 2,
              border: '1px dashed rgba(126, 87, 194, 0.3)',
              width: '100%',
              maxWidth: '500px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 0.75,
                  color: '#5E35B1',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '0.95rem'
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: '1rem' }} />
                Personalize Your Investment Strategy
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.4,
                  fontSize: '0.85rem'
                }}
              >
                Now that we have analyzed the market sentiment, let's tailor the AI recommendations to your investment preferences. Choose your risk tolerance and investment timeline below to receive personalized investment strategies that align with your goals.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  label="Risk Level"
                  size="small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        width: 'auto',
                        maxHeight: '250px'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(126, 87, 194, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(126, 87, 194, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#7E57C2'
                    }
                  }}
                >
                  <MenuItem value="conservative">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Conservative
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        Lower risk, stable returns
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="moderate">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Moderate
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        Balanced risk-reward ratio
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="aggressive">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Aggressive
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        Higher risk, potential higher returns
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Investment Horizon</InputLabel>
                <Select
                  value={investmentHorizon}
                  onChange={(e) => setInvestmentHorizon(e.target.value)}
                  label="Investment Horizon"
                  size="small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        width: 'auto',
                        maxHeight: '250px'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(126, 87, 194, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(126, 87, 194, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#7E57C2'
                    }
                  }}
                >
                  <MenuItem value="short-term">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Short-term
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        Less than 1 year
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium-term">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Medium-term
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        1-3 years
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="long-term">
                    <Box sx={{ 
                      py: 1,
                      width: '100%'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#5E35B1'
                        }}
                      >
                        Long-term
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'block'
                        }}
                      >
                        3+ years
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              mt: 2.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}>
              <Button
                variant="contained"
                onClick={handleGetRecommendations}
                disabled={loading}
                size="medium"
                sx={{
                  bgcolor: '#7E57C2',
                  color: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(126, 87, 194, 0.25)',
                  '&:hover': {
                    bgcolor: '#5E35B1',
                    boxShadow: '0 4px 12px rgba(126, 87, 194, 0.35)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: 220
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: '1rem' }} />
                Generate AI Recommendations
              </Button>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  maxWidth: 400,
                  fontSize: '0.7rem'
                }}
              >
                Our AI will analyze the sentiment data and your preferences to provide tailored investment recommendations
              </Typography>
            </Box>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  '& .MuiAlert-message': { 
                    width: '100%' 
                  }
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>

          {recommendation && (
            <Paper 
              ref={recommendationRef}
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'background.default',
                borderRadius: 2,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: 'linear-gradient(180deg, #7E57C2 0%, #B388FF 100%)',
                  borderRadius: '4px 0 0 4px',
                },
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateX(10px)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                },
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
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Risk Level: ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(126, 87, 194, 0.15)',
                      color: '#5E35B1',
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        color: '#5E35B1',
                      }
                    }}
                  />
                  <Chip
                    label={`Horizon: ${investmentHorizon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(179, 136, 255, 0.15)',
                      color: '#7E57C2',
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        color: '#7E57C2',
                      }
                    }}
                  />
                </Box>
                <Typography sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  mt: 1,
                  textAlign: 'right'
                }}>
                  Last Updated: {new Date(recommendation.analysis_timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </CardContent>

      <LoadingModal open={loading} type="recommendations" />
    </Card>
  );
};

export default AIRecommendations; 