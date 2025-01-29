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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchStocks } from '../services/api';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchStocks(query.trim());
      console.log('Search Response:', data);
      if (data.length === 0) {
        setError(`No stock found with symbol "${query.toUpperCase()}". Please check the symbol and try again.`);
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Error searching stocks');
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStockSelect = (stock) => {
    setQuery('');
    setResults([]);
    onSelect(stock.symbol);
  };

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search stocks (e.g., MSFT, AAPL)..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton 
                  onClick={handleSearch}
                  edge="end"
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    width: 35,
                    height: 35,
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
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            boxShadow: 3,
            borderRadius: 2,
          },
        }}
      />

      {results.length > 0 && (
        <Paper 
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1000,
            borderRadius: 2,
          }}
        >
          <List>
            {results.map((stock) => (
              <ListItem key={stock.symbol} disablePadding>
                <ListItemButton onClick={() => handleStockSelect(stock)}>
                  <ListItemText
                    primary={`${stock.name} (${stock.symbol})`}
                    secondary={`${stock.sector} - ${stock.currency} ${stock.current_price}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {error && (
        <Box sx={{ color: 'error.main', mt: 1, textAlign: 'center' }}>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default StockSearch; 