import React from 'react';
import { Box, Typography, Paper, Chip, Grid } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { formatTimestamp } from '../utils/dateUtils';

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
  if (!stockInfo || !stockInfo.info) return null;

  const info = stockInfo.info;
  const { low: yearLow, high: yearHigh } = calculate52WeekRange(historicalData);
  
  return (
    <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
      {/* Header with company name and current price */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: { xs: 2, sm: 2 },
        mb: 2 
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 500, 
            fontSize: { xs: '1rem', sm: '1.1rem' }, 
            mb: 0.5,
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
                  bgcolor: '#303F9F'
                }
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
                  bgcolor: '#512DA8'
                }
              }} 
            />
          </Box>
        </Box>

        {/* Prominent Current Price Display */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', sm: 'flex-start' },
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          p: 1.5,
          borderRadius: 2,
          width: 'fit-content',
          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
        }}>
          <Typography variant="caption" sx={{ color: 'white', mb: 0.5 }}>
            Current Price
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ 
              fontSize: { xs: '1.8rem', sm: '2rem' }, 
              fontWeight: 600, 
              color: 'white',
              lineHeight: 1
            }}>
              ${info.current_price}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              ml: 1,
              gap: 0.5
            }}>
              {info.change_percent >= 0 ? (
                <ArrowUpwardIcon sx={{ 
                  color: '#4caf50',
                  fontSize: '1rem',
                  mb: '-2px'
                }} />
              ) : (
                <ArrowDownwardIcon sx={{ 
                  color: '#f44336',
                  fontSize: '1rem',
                  mb: '-2px'
                }} />
              )}
              <Typography 
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 500,
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
      </Box>

      {/* Market Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            Market Cap
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {formatMarketCap(info.market_cap)}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            P/E Ratio
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {info.pe_ratio || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="caption" color="text.secondary" display="block">
            Dividend Yield
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: 'success.main' }}>
            {formatDividendYield(info.dividend_yield)}
          </Typography>
        </Grid>
      </Grid>

      {/* Daily Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary" display="block">
            Day High
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: 'success.main' }}>
            ${info.day_high}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary" display="block">
            Day Low
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: 'error.main' }}>
            ${info.day_low}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary" display="block">
            Volume
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {info.volume?.toLocaleString() || 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      {/* 52-Week Range */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          52-Week Range
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography color="error.main" sx={{ fontSize: '0.9rem' }}>
            Low: ${yearLow?.toFixed(2) || 'N/A'}
          </Typography>
          <Box 
            sx={{ 
              flexGrow: 1, 
              height: '4px', 
              bgcolor: 'grey.200',
              borderRadius: 1,
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '200px', sm: 'none' },
              mx: { xs: 'auto', sm: 0 }
            }}
          >
            {yearLow && yearHigh && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  height: '8px',
                  width: '8px',
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  top: '-2px',
                  left: `${((info.current_price - yearLow) / (yearHigh - yearLow)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            )}
          </Box>
          <Typography color="success.main" sx={{ fontSize: '0.9rem' }}>
            High: ${yearHigh?.toFixed(2) || 'N/A'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Last Updated: {formatTimestamp(new Date())}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last Trade: {historicalData && historicalData.length > 0 
            ? `${new Date(historicalData[historicalData.length - 1].date).toLocaleDateString(undefined, { 
                month: 'numeric',
                day: 'numeric',
                year: '2-digit'
              })} - Last Close: $${historicalData[historicalData.length - 1].close.toFixed(2)}`
            : 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Currency: {info.currency}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StockInfo; 