import React from 'react';
import { Modal, Box, Typography, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const LoadingModal = ({ open, type = 'sentiment' }) => {
  // Define color schemes for each type
  const colorScheme = {
    sentiment: {
      primary: '#1E88E5', // Primary blue
      secondary: '#1565C0', // Darker blue
      shadow: 'rgba(33, 150, 243, 0.2)', // Blue for shadow
      border: 'rgba(33, 150, 243, 0.15)' // Blue for border
    },
    recommendations: {
      primary: '#7E57C2', // Primary purple
      secondary: '#5E35B1', // Darker purple
      shadow: 'rgba(126, 87, 194, 0.2)', // Purple for shadow
      border: 'rgba(126, 87, 194, 0.15)' // Purple for border
    }
  };

  const colors = colorScheme[type];

  const config = {
    sentiment: {
      icon: <TrendingUpIcon sx={{ color: colors.primary, fontSize: '1.8rem' }} />,
      title: 'Analyzing Sentiment',
      message: 'Please wait while we analyze market sentiment and generate insights...'
    },
    recommendations: {
      icon: <AutoAwesomeIcon sx={{ color: colors.primary, fontSize: '1.8rem' }} />,
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
        width: 340,
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2.5,
        boxShadow: `0 10px 40px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <Box sx={{ 
          position: 'relative',
          display: 'inline-flex',
          animation: 'pulse 1.5s infinite',
          mb: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.shadow} 0%, rgba(255, 255, 255, 0) 70%)`,
            animation: 'glow 1.5s infinite alternate',
            zIndex: -1
          }
        }}>
          <CircularProgress 
            size={70} 
            thickness={4} 
            sx={{ 
              color: colors.primary
            }} 
          />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: colors.secondary,
            fontSize: '1.25rem',
            letterSpacing: '0.01em',
            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '95%',
            mx: 'auto',
            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 400,
            color: '#546E7A'
          }}
        >
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
          '@keyframes glow': {
            '0%': {
              opacity: 0.5,
              transform: 'scale(0.95)',
            },
            '100%': {
              opacity: 0.8,
              transform: 'scale(1.05)',
            },
          },
        }} />
      </Box>
    </Modal>
  );
};

export default LoadingModal; 