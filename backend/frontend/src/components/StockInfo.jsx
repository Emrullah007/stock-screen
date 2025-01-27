import React from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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

const StockInfo = ({ stockInfo, onSentimentAnalysis }) => {
  if (!stockInfo) return null;

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      {/* Header with company name and button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem', mb: 0.5 }}>
            {stockInfo.name} ({stockInfo.symbol})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`Sector: ${stockInfo.sector}`} 
              size="small"
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                fontSize: '0.75rem',
                height: '24px'
              }} 
            />
            <Chip 
              label={`Industry: ${stockInfo.industry}`} 
              size="small"
              sx={{ 
                bgcolor: 'secondary.main', 
                color: 'white',
                fontSize: '0.75rem',
                height: '24px'
              }} 
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => onSentimentAnalysis(stockInfo.symbol)}
          sx={{ 
            fontSize: '0.85rem',
            height: '36px',
            textTransform: 'none',
            borderRadius: '18px',
            px: 2.5,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            letterSpacing: '0.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
              boxShadow: '0 4px 6px 2px rgba(33, 203, 243, .4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(1px)',
            }
          }}
        >
          <Box component="span" sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: 0.8,
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            fontWeight: 600,
            '& svg': {
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
            }
          }}>
            <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />
            Analyze
            <Box component="span" sx={{ 
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}>
              Sentiment
            </Box>
          </Box>
        </Button>
      </Box>

      {/* Price and Market Cap */}
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
            Current Price
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, color: 'success.main', lineHeight: 1 }}>
            ${stockInfo.current_price}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Last Updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
            Market Cap
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1 }}>
            {formatMarketCap(stockInfo.market_cap)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>USD</Typography>
        </Box>
      </Box>

      {/* Additional Metrics */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: '80px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
            P/E Ratio
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {stockInfo.pe_ratio || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ minWidth: '80px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
            Dividend Yield
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: 'success.main' }}>
            {stockInfo.dividend_yield ? `${stockInfo.dividend_yield}%` : 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
            52 Week Range
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography color="error.main" sx={{ fontSize: '0.9rem' }}>
              Low: ${stockInfo.fifty_two_week_low}
            </Typography>
            <Box 
              sx={{ 
                flexGrow: 1, 
                height: '4px', 
                bgcolor: 'grey.200',
                borderRadius: 1,
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  height: '8px',
                  width: '8px',
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  top: '-2px',
                  left: `${((stockInfo.current_price - stockInfo.fifty_two_week_low) / 
                    (stockInfo.fifty_two_week_high - stockInfo.fifty_two_week_low)) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
              />
            </Box>
            <Typography color="success.main" sx={{ fontSize: '0.9rem' }}>
              High: ${stockInfo.fifty_two_week_high}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StockInfo; 