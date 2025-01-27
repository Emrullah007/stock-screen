import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getAIRecommendations } from '../services/api';
import LoadingModal from './LoadingModal';

const AIRecommendations = ({ selectedStocks }) => {
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState('medium-term');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const recommendationsRef = useRef(null);

  // Clear recommendations when selected stocks change
  useEffect(() => {
    setRecommendations(null);
    setError(null);
  }, [selectedStocks]);

  const handleGetRecommendations = async () => {
    if (!selectedStocks || selectedStocks.length === 0) {
      setError('Please select at least one stock first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAIRecommendations({
        stocks: selectedStocks,
        risk_level: riskLevel,
        investment_horizon: investmentHorizon,
      });
      setRecommendations(data);
      // Wait for the component to render before scrolling
      setTimeout(() => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (err) {
      setError('Error getting AI recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: 'primary.main'
        }}>
          <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
          AI Investment Recommendations
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              label="Risk Level"
            >
              <MenuItem value="conservative">Conservative</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="aggressive">Aggressive</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Investment Horizon</InputLabel>
            <Select
              value={investmentHorizon}
              onChange={(e) => setInvestmentHorizon(e.target.value)}
              label="Investment Horizon"
            >
              <MenuItem value="short-term">Short Term (less than 1 year)</MenuItem>
              <MenuItem value="medium-term">Medium Term (1-3 years)</MenuItem>
              <MenuItem value="long-term">Long Term (3+ years)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGetRecommendations}
            disabled={loading || !selectedStocks || selectedStocks.length === 0}
            sx={{ 
              height: '44px',
              borderRadius: '22px',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              background: 'linear-gradient(45deg, #7E57C2 30%, #B388FF 90%)',
              boxShadow: '0 3px 5px 2px rgba(126, 87, 194, .3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #5E35B1 30%, #7C4DFF 90%)',
                boxShadow: '0 4px 6px 2px rgba(126, 87, 194, .4)',
              }
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: '1.2rem' }} />
            Generate AI Recommendations
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {recommendations && (
          <Paper 
            ref={recommendationsRef}
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              mt: 2,
              '& h1, & h2, & h3': {
                fontFamily: 'inherit',
                fontWeight: 600,
                my: 2
              },
              '& p': {
                mb: 2
              }
            }}
          >
            {recommendations.analysis}
          </Paper>
        )}
      </CardContent>

      <LoadingModal open={loading} type="recommendations" />
    </Card>
  );
};

export default AIRecommendations; 