import React, { useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import StockSearch from '../components/StockSearch';
import StockDetails from '../components/StockDetails';
import StockChart from '../components/StockChart';

const Home = () => {
  const [selectedStock, setSelectedStock] = useState('');

  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <StockSearch onStockSelect={handleStockSelect} />
          </Box>
          {selectedStock && (
            <StockDetails symbol={selectedStock} />
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <StockChart symbol={selectedStock} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 