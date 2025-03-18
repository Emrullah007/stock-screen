import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { searchStocks } from '../services/api';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleStockSelect = (stock) => {
    setQuery(stock.symbol);
    setResults([]);
    setError(null);
    setIsSearching(false);
    onSelect(stock.symbol);
  };

  const handleCloseResults = () => {
    setResults([]);
    setError(null);
    setIsSearching(false);
  };

  return (
    <Box 
      className="search-container"
      sx={{ 
        width: '100%',
        maxWidth: { xs: '100%', sm: 600 },
        mx: 'auto',
        mb: 3
      }}
    >
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
                color: 'action.active',
                fontSize: '1.2rem'
              }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'primary.main' }} />
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
                    width: 35,
                    height: 35,
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
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
              transition: 'all 0.3s ease',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(33, 150, 243, 0.2)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            height: '48px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
          },
        }}
        sx={{
          '& .MuiInputBase-input': {
            padding: '12px 14px',
            '&::placeholder': {
              color: 'text.secondary',
              opacity: 0.8,
            },
          },
        }}
      />

      <Collapse in={isSearching} timeout="auto">
        {results.length > 0 && (
          <Paper 
            elevation={3}
            sx={{
              mt: 1,
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box sx={{ 
              position: 'sticky', 
              top: 0, 
              right: 0,
              zIndex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              bgcolor: '#FFFFFF',
              borderBottom: '1px solid',
              borderColor: 'divider',
              px: 1,
              py: 0.5
            }}>
              <IconButton
                onClick={handleCloseResults}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
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
                    onClick={() => handleStockSelect(stock)}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.05)',
                      }
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 1 
                      }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            color: '#2C3E50',
                            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          {stock.info.name} ({stock.symbol})
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          }}
                        >
                          ${stock.info.current_price}
                        </Typography>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 0.5 }}>
                        <Grid item xs={4}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            display="block"
                            sx={{
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.75rem'
                            }}
                          >
                            Day High
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'success.main',
                              fontWeight: 500,
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.85rem'
                            }}
                          >
                            ${stock.info.day_high}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            display="block"
                            sx={{
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.75rem'
                            }}
                          >
                            Day Low
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'error.main',
                              fontWeight: 500,
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.85rem'
                            }}
                          >
                            ${stock.info.day_low}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            display="block"
                            sx={{
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.75rem'
                            }}
                          >
                            Change
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: stock.info.change_percent >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontSize: '0.85rem'
                            }}
                          >
                            {stock.info.change_percent >= 0 ? '+' : ''}{stock.info.change_percent}%
                          </Typography>
                        </Grid>
                      </Grid>

                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          fontSize: '0.75rem',
                          fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        {stock.info.sector} • {stock.info.industry}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {error && (
          <Alert 
            severity="error"
            sx={{
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              '& .MuiAlert-message': {
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseResults}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}
      </Collapse>
    </Box>
  );
};

export default StockSearch; 