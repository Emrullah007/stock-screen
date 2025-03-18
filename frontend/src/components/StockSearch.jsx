import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  InputAdornment,
  CircularProgress,
  IconButton,
  Alert,
  Collapse,
  Grid,
  Typography,
  Fade,
  Popper,
  ClickAwayListener,
  Button,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { searchStocks } from '../services/api';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [resultsPosition, setResultsPosition] = useState({ top: 0, left: 0, width: 0 });

  const updateResultsPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setResultsPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left,
        width: rect.width
      });
    }
  };

  // Update position when search results are shown
  useEffect(() => {
    if (isSearching && results.length > 0) {
      updateResultsPosition();
      // Add event listener for window resize
      window.addEventListener('resize', updateResultsPosition);
      window.addEventListener('scroll', updateResultsPosition);
    }
    
    return () => {
      window.removeEventListener('resize', updateResultsPosition);
      window.removeEventListener('scroll', updateResultsPosition);
    };
  }, [isSearching, results]);

  // Force update position after component mounts
  useEffect(() => {
    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      updateResultsPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const data = await searchStocks(query.trim());
      if (data.length === 0 || !data[0].info || !data[0].info.name || !data[0].info.current_price) {
        setError(`Stock "${query.toUpperCase()}" not found. Please check the symbol and try again.`);
        setResults([]);
      } else {
        setResults(data);
        setIsSearching(true);
        // Force update position after results are loaded
        setTimeout(updateResultsPosition, 10);
      }
    } catch (err) {
      setError('This stock symbol does not exist. Please enter a valid stock symbol.');
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (!value) {
      setResults([]);
      setError(null);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStockSelect = (symbol) => {
    setIsSearching(false);
    setQuery('');
    setResults([]);
    
    // Call the parent component's onSelect handler
    if (onSelect) {
      onSelect(symbol); // The improved mobile scroll logic will be handled in Home.jsx
      
      // Add additional scroll trigger after a longer delay
      setTimeout(() => {
        // Find the Stock Information section and scroll to it as a backup
        const infoSection = document.getElementById('stock-info');
        if (infoSection) {
          const yOffset = -100;
          const y = infoSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 1200);
    }
  };

  const handleCloseResults = () => {
    setResults([]);
    setError(null);
    setIsSearching(false);
  };

  const handleClickAway = () => {
    if (isSearching) {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (results.length === 0 && !loading && !error) {
      setIsSearching(false);
    }
  }, [results, loading, error]);

  // Add a class to the document body when search results are shown
  useEffect(() => {
    // Add a class to the body when search results are open
    if (isSearching && results.length > 0) {
      document.body.classList.add('search-results-open');
    } else {
      document.body.classList.remove('search-results-open');
    }
    
    return () => {
      document.body.classList.remove('search-results-open');
    };
  }, [isSearching, results]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        sx={{ 
          position: 'relative',
          zIndex: 1500,
          width: '100%',
        }}
        className={`search-container ${!loading && results.length > 0 ? 'search-container-open' : ''}`}
        ref={searchRef}
      >
        {/* Search Title - Only show when no results are displayed */}
        {results.length === 0 && (
          <Typography 
            variant="h6"
            sx={{ 
              fontWeight: 600,
              mb: 2,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <SearchIcon sx={{ 
              fontSize: '1.4rem',
              color: '#2196F3'
            }} />
            Search for a Stock
          </Typography>
        )}
        
        <TextField
          fullWidth
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onClick={() => setIsSearching(true)}
          placeholder="Enter stock symbol (e.g., MSFT, AAPL)..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ 
                  color: 'primary.main',
                  fontSize: '1.3rem'
                }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={28} sx={{ color: 'primary.main' }} />
                ) : (
                  <IconButton 
                    onClick={handleSearch}
                    edge="end"
                    sx={{ 
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(1px)'
                      },
                      width: 40,
                      height: 40,
                      boxShadow: '0 2px 5px rgba(33, 203, 243, .3)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: {
              borderRadius: '50px',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.2)',
              },
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.3)',
              },
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.15)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 1.5,
              borderRadius: 2,
              width: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 1200,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <Paper 
            elevation={6} 
            sx={{ 
              position: 'relative',
              maxHeight: 400, 
              overflow: 'auto',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              zIndex: 1500,
              mb: 12, // Add margin bottom to push content down
              backgroundColor: '#ffffff',
            }}
            className="search-results-paper"
          >
            <Box sx={{ 
              position: 'sticky', 
              top: 0, 
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#E3F2FD',
              borderBottom: '1px solid #BBDEFB',
              px: 2,
              py: 1
            }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: '#1976D2',
                  fontSize: '0.85rem'
                }}
              >
                Stock Results
              </Typography>
              <IconButton
                onClick={handleCloseResults}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <List sx={{ py: 0 }}>
              {results.map((stock) => (
                <ListItem key={stock.symbol} disablePadding>
                  <ListItemButton 
                    onClick={() => handleStockSelect(stock.symbol)}
                    sx={{
                      py: 2,
                      px: 2,
                      borderBottom: '1px solid #E0E0E0',
                      '&:hover': {
                        bgcolor: '#F5F9FF',
                      },
                      mb: 1,
                      background: 'white',
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' }, 
                        mb: 1.5,
                        pb: 1,
                        borderBottom: '1px dashed rgba(0, 0, 0, 0.08)'
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            color: '#1565C0',
                            mb: { xs: 0.5, sm: 0 },
                            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {stock.info.name} 
                          <Box component="span" sx={{ 
                            ml: 0.5, 
                            fontSize: '0.9rem',
                            color: 'text.secondary',
                            fontWeight: 500,
                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                          }}>
                            {stock.symbol}
                          </Box>
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          mt: { xs: 0.5, sm: 0 }
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              color: '#2C3E50',
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            }}
                          >
                            ${stock.info.current_price}
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: stock.info.change_percent >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: stock.info.change_percent >= 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                          }}>
                            {stock.info.change_percent >= 0 ? (
                              <ArrowUpwardIcon sx={{ 
                                color: '#4caf50',
                                fontSize: '0.95rem', 
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.7 },
                                  '50%': { opacity: 1 },
                                  '100%': { opacity: 0.7 }
                                }
                              }} />
                            ) : (
                              <ArrowDownwardIcon sx={{ 
                                color: '#f44336',
                                fontSize: '0.95rem', 
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.7 },
                                  '50%': { opacity: 1 },
                                  '100%': { opacity: 0.7 }
                                }
                              }} />
                            )}
                            <Typography 
                              sx={{ 
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: stock.info.change_percent >= 0 ? '#4caf50' : '#f44336',
                              }}
                            >
                              {stock.info.change_percent >= 0 ? '+' : ''}{stock.info.change_percent}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #E0E0E0',
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#1976D2',
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                mb: 0.5
                              }}
                            >
                              Sector
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: '#2C3E50',
                              }}
                            >
                              {stock.info.sector || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #E0E0E0',
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#4CAF50',
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                mb: 0.5
                              }}
                            >
                              Market Cap
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: '#2C3E50',
                              }}
                            >
                              {stock.info.market_cap ? `$${(stock.info.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #E0E0E0',
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#9C27B0',
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                mb: 0.5
                              }}
                            >
                              P/E Ratio
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: '#2C3E50',
                              }}
                            >
                              {stock.info.pe_ratio || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{
                            p: 1,
                            borderRadius: 1,
                            background: 'white',
                            border: '1px solid #E0E0E0',
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#FF9800',
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                mb: 0.5
                              }}
                            >
                              Dividend
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: '#2C3E50',
                              }}
                            >
                              {stock.info.dividend_yield ? `${stock.info.dividend_yield}%` : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
              
              {/* Mobile close button at bottom */}
              <Box sx={{
                display: { xs: 'flex', sm: 'none' },
                justifyContent: 'center',
                p: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                bgcolor: 'white',
                position: 'sticky',
                bottom: 0,
                zIndex: 10
              }}>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleCloseResults}
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Close Results
                </Button>
              </Box>
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default StockSearch; 