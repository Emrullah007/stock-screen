import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../services/api';

const StockDetails = ({ symbol }) => {
  const { data: stockInfo, isLoading } = useQuery({
    queryKey: ['stockInfo', symbol],
    queryFn: () => stockApi.getStockInfo(symbol),
    enabled: !!symbol,
  });

  if (!symbol) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {stockInfo.name} ({stockInfo.symbol})
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Current Price
            </Typography>
            <Typography variant="h6">
              ${stockInfo.current_price?.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Market Cap
            </Typography>
            <Typography variant="h6">
              ${(stockInfo.market_cap / 1e9).toFixed(2)}B
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              P/E Ratio
            </Typography>
            <Typography variant="h6">
              {stockInfo.pe_ratio?.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Dividend Yield
            </Typography>
            <Typography variant="h6">
              {(stockInfo.dividend_yield * 100)?.toFixed(2)}%
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Sector
            </Typography>
            <Typography variant="body1">
              {stockInfo.sector}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Industry
            </Typography>
            <Typography variant="body1">
              {stockInfo.industry}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              52 Week High
            </Typography>
            <Typography variant="body1">
              ${stockInfo.fifty_two_week_high?.toFixed(2)}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              52 Week Low
            </Typography>
            <Typography variant="body1">
              ${stockInfo.fifty_two_week_low?.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StockDetails; 