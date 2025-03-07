import React from 'react';
import { Modal, Box, Typography, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const LoadingModal = ({ open, type = 'sentiment' }) => {
  const config = {
    sentiment: {
      icon: <TrendingUpIcon color="primary" />,
      title: 'Analyzing Sentiment',
      message: 'Please wait while we analyze market sentiment and generate insights...'
    },
    recommendations: {
      icon: <AutoAwesomeIcon color="primary" />,
      title: 'Generating AI Recommendations',
      message: 'Please wait while our AI analyzes market data and generates personalized recommendations...'
    }
  };

  const { icon, title, message } = config[type];

  return (
    <Modal
      open={open}
      aria-labelledby="loading-modal"
      aria-describedby="loading-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ 
          position: 'relative',
          display: 'inline-flex',
          animation: 'pulse 1.5s infinite'
        }}>
          <CircularProgress size={60} thickness={4} />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Box sx={{
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }} />
      </Box>
    </Modal>
  );
};

export default LoadingModal; 