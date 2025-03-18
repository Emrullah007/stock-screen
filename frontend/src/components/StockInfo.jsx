import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Grid, Slide, Fade, useTheme, useMediaQuery } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const formatMarketCap = (value) => {
  if (!value) return 'N/A';
  const trillion = 1e12;
  const billion = 1e9;
  if (value >= trillion) {
    return `$${(value / trillion).toFixed(2)}T`;
  }
  if (value >= billion) {
    return `$${(value / billion).toFixed(2)}B`;
  }
  return `$${value.toLocaleString()}`;
};

const formatDividendYield = (value) => {
  // Debug logging
  console.log('Raw dividend yield:', value);
  
  if (!value || value === 0) return 'N/A';
  
  // Value is already a percentage, just format it
  return `${Number(value).toFixed(2)}%`;
};

const calculate52WeekRange = (historicalData) => {
  if (!historicalData || historicalData.length === 0) return { low: null, high: null };
  
  // Get data for the last 52 weeks (approximately 252 trading days)
  const yearData = historicalData.slice(-252);
  
  const low = Math.min(...yearData.map(item => item.low));
  const high = Math.max(...yearData.map(item => item.high));
  
  return { low, high };
};

const StockInfo = ({ stockInfo, historicalData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Trigger animation when component mounts or stockInfo changes
    setShowContent(false);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [stockInfo?.symbol]);
  
  if (!stockInfo || !stockInfo.info) return null;

  const info = stockInfo.info;
  const { low: yearLow, high: yearHigh } = calculate52WeekRange(historicalData);
  
  // Calculate current price position in 52-week range
  const calculateRangePercentage = () => {
    if (!yearLow || !yearHigh || yearLow === yearHigh) return 50;
    const range = yearHigh - yearLow;
    const positionFromLow = info.current_price - yearLow;
    return Math.min(100, Math.max(0, (positionFromLow / range) * 100));
  };
  
  const rangePercentage = calculateRangePercentage();
  
  // Debug logging
  console.log('Stock Info:', info);
  console.log('Dividend Yield from API:', info.dividend_yield);

  return (
    <Box sx={{ 
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Header with company name and current price */}
      <Fade in={showContent} timeout={800}>
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: { xs: 2, sm: 2.5 },
            mb: 2.5 
          }}>
            <Slide direction="down" in={showContent} timeout={500} mountOnEnter unmountOnExit>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  fontSize: { xs: '1.1rem', sm: '1.2rem' }, 
                  mb: 0.8,
                  color: 'primary.dark',
                  textAlign: { xs: 'center', sm: 'left' }
                }}>
                  {info.name} ({stockInfo.symbol})
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Chip 
                    label={`Sector: ${info.sector}`} 
                    size="small"
                    sx={{ 
                      bgcolor: '#3949AB', // Indigo 600 - darker, professional blue
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '24px',
                      '&:hover': {
                        bgcolor: '#303F9F',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                  <Chip 
                    label={`Industry: ${info.industry}`} 
                    size="small"
                    sx={{ 
                      bgcolor: '#5E35B1', // Deep Purple 600 - rich purple
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '24px',
                      '&:hover': {
                        bgcolor: '#512DA8',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                      },
                      transition: 'all 0.2s ease'
                    }} 
                  />
                </Box>
              </Box>
            </Slide>

            {/* Prominent Current Price Display */}
            <Slide direction="up" in={showContent} timeout={700} mountOnEnter unmountOnExit>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                p: 1.8,
                borderRadius: 2,
                width: 'fit-content',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                transform: 'perspective(1000px) rotateX(0deg)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
                  transform: 'perspective(1000px) rotateX(2deg) translateY(-2px)'
                },
                position: 'relative',
                mx: { xs: 'auto', sm: 0 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, 
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  borderRadius: 2,
                  zIndex: 0
                }
              }}>
                <Typography variant="caption" sx={{ color: 'white', mb: 0.5, zIndex: 1 }}>
                  Current Price
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, zIndex: 1 }}>
                  <Typography sx={{ 
                    fontSize: { xs: '1.8rem', sm: '2rem' }, 
                    fontWeight: 600, 
                    color: 'white',
                    lineHeight: 1,
                    letterSpacing: '-0.02em'
                  }}>
                    ${info.current_price}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 1.5,
                    ml: 1,
                    gap: 0.5,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
                    }
                  }}>
                    {info.change_percent >= 0 ? (
                      <ArrowUpwardIcon sx={{ 
                        color: '#4caf50',
                        fontSize: '1rem',
                        mb: '-2px',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'translateY(0px)',
                            opacity: 1
                          },
                          '50%': {
                            transform: 'translateY(-2px)',
                            opacity: 0.8
                          },
                          '100%': {
                            transform: 'translateY(0px)',
                            opacity: 1
                          }
                        }
                      }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ 
                        color: '#f44336',
                        fontSize: '1rem',
                        mb: '-2px',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'translateY(0px)',
                            opacity: 1
                          },
                          '50%': {
                            transform: 'translateY(2px)',
                            opacity: 0.8
                          },
                          '100%': {
                            transform: 'translateY(0px)',
                            opacity: 1
                          }
                        }
                      }} />
                    )}
                    <Typography 
                      sx={{ 
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: info.change_percent >= 0 ? '#4caf50' : '#f44336',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {info.change_percent >= 0 ? '+' : ''}{info.change_percent}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Slide>
          </Box>

          {/* Market Stats */}
          <Slide direction="right" in={showContent} timeout={900} mountOnEnter unmountOnExit>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1.5, 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 0.5
              }}>
                Market Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(33, 150, 243, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Market Cap
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: 'primary.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatMarketCap(info.market_cap)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(33, 150, 243, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      P/E Ratio
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: 'primary.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {info.pe_ratio || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(33, 150, 243, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Dividend Yield
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: 'success.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatDividendYield(info.dividend_yield)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Slide>

          {/* Daily Stats */}
          <Slide direction="left" in={showContent} timeout={1100} mountOnEnter unmountOnExit>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1.5, 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 0.5
              }}>
                Trading Data
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(76, 175, 80, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Day High
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: 'success.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ${info.day_high}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(244, 67, 54, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Day Low
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: 'error.main',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ${info.day_low}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.2 }, 
                    bgcolor: 'rgba(103, 58, 183, 0.05)', 
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(103, 58, 183, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                      Volume
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' }, 
                        fontWeight: 600, 
                        color: '#673AB7',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {info.volume?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Slide>

          {/* 52-Week Range - Redesigned to be more professional */}
          <Slide direction="up" in={showContent} timeout={1300} mountOnEnter unmountOnExit>
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1.5, 
                fontSize: '0.9rem', 
                color: 'text.secondary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 0.5
              }}>
                52-Week Range
              </Typography>
              <Box sx={{ 
                p: { xs: 1.5, sm: 2 },
                bgcolor: 'rgba(33, 150, 243, 0.03)',
                borderRadius: 2,
                border: '1px solid rgba(33, 150, 243, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
                  bgcolor: 'rgba(33, 150, 243, 0.05)',
                },
              }}>
                <Grid container spacing={2} sx={{ mb: 1.5 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary', 
                      display: 'block', 
                      fontSize: '0.75rem',
                      mb: 0.5
                    }}>
                      52-Week Low
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'error.main'
                    }}>
                      ${yearLow?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ 
                      color: 'text.secondary', 
                      display: 'block', 
                      fontSize: '0.75rem',
                      mb: 0.5
                    }}>
                      52-Week High
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'success.main'
                    }}>
                      ${yearHigh?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                
                {/* Progress bar for current price position */}
                <Box sx={{ mb: 1.5 }}>
                  <Box 
                    sx={{ 
                      height: '8px', 
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 4,
                      position: 'relative',
                      width: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    {yearLow && yearHigh && (
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${rangePercentage}%`,
                          bgcolor: 'primary.main',
                          borderRadius: 4,
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    )}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        left: `${rangePercentage}%`,
                        top: '-6px',
                        transform: 'translateX(-50%)',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        bgcolor: 'white',
                        border: '2px solid #1976d2',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                        transition: 'left 1s ease-in-out',
                        zIndex: 2
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Additional stock information */}
                <Box sx={{ 
                  mt: 2, 
                  px: 1.5, 
                  py: 1.5, 
                  bgcolor: 'rgba(25, 118, 210, 0.04)', 
                  borderRadius: 2,
                  border: '1px solid rgba(25, 118, 210, 0.08)'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ 
                        color: 'text.secondary', 
                        fontSize: '0.85rem', 
                        display: 'block', 
                        mb: 1,
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        Current Price: <strong style={{ color: '#1976d2' }}>${info.current_price}</strong> is at <strong style={{ color: '#1976d2' }}>{rangePercentage.toFixed(0)}%</strong> of the 52-week range
                      </Typography>
                    </Grid>
                    
                    {/* Trading metrics in 3 columns now */}
                    <Grid item xs={4}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        height: '100%'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: 'primary.main', 
                          fontSize: '0.7rem', 
                          display: 'block',
                          fontWeight: 600,
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Last Trade
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.85rem',
                          color: 'text.primary'
                        }}>
                          {info.last_trade_time ? 
                            new Date(info.last_trade_time).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            }) : 
                            new Date().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          }
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        height: '100%'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: 'primary.main', 
                          fontSize: '0.7rem', 
                          display: 'block',
                          fontWeight: 600,
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Last Close
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.85rem',
                          color: info.current_price > (info.previous_close || 0) ? 'success.main' : 'error.main'
                        }}>
                          ${info.previous_close?.toFixed(2) || info.current_price}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        height: '100%'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: 'primary.main', 
                          fontSize: '0.7rem', 
                          display: 'block',
                          fontWeight: 600,
                          mb: 0.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Currency
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.85rem',
                          color: '#2C3E50'
                        }}>
                          {info.currency || 'USD'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Last Updated shown separately */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  mt: 1.5,
                  px: 1
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    Last Updated: {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                    })}, {new Date().toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: 'numeric',
                      hour12: true 
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Box>
  );
};

export default StockInfo; 