import React, { useState } from 'react';
import {
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../services/api';

const StockSearch = ({ onStockSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['stockSearch', searchQuery],
    queryFn: () => stockApi.searchStocks(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400 }}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
              </IconButton>
            ),
          }}
        />
      </form>
      
      {searchResults && searchResults.length > 0 && (
        <List>
          {searchResults.map((stock) => (
            <ListItem
              button
              key={stock.symbol}
              onClick={() => onStockSelect(stock.symbol)}
            >
              <ListItemText
                primary={stock.symbol}
                secondary={stock.name}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default StockSearch; 