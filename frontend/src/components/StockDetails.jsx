import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { getStockInfo, getHistoricalData } from '../services/api';
import StockChart from './StockChart';

const StockDetails = ({ symbol }) => {
  const [stockInfo, setStockInfo] = React.useState(null);
  const [historicalData, setHistoricalData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);

      try {
        const [info, history] = await Promise.all([
          getStockInfo(symbol),
          getHistoricalData(symbol)
        ]);
        setStockInfo(info);
        setHistoricalData(history);
      } catch (err) {
        setError('Error fetching stock data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (!symbol) return null;
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!stockInfo) return null;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {stockInfo.name} ({stockInfo.symbol})
            </Typography>
            <Typography variant="h6" color="primary">
              ${stockInfo.current_price}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <StockChart data={historicalData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDetails; 