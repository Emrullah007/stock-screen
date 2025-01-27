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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchStocks } from '../services/api';
import { debounce } from 'lodash';

const StockSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchStocks(searchQuery);
      setResults(data);
    } catch (err) {
      setError('Error searching stocks');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    handleSearch(value);
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
        placeholder="Search stocks..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
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
                    secondary={`${stock.exchange} - ${stock.currency} ${stock.price}`}
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