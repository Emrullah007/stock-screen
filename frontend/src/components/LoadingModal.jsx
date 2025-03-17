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
      gradient: 'rgba(33, 150, 243, 0.05)', // Light blue for gradient
      shadow: 'rgba(33, 150, 243, 0.15)', // Blue for shadow
      border: 'rgba(33, 150, 243, 0.1)' // Blue for border
    },
    recommendations: {
      primary: '#7E57C2', // Primary purple
      secondary: '#5E35B1', // Darker purple
      gradient: 'rgba(179, 136, 255, 0.05)', // Light purple for gradient
      shadow: 'rgba(126, 87, 194, 0.15)', // Purple for shadow
      border: 'rgba(126, 87, 194, 0.1)' // Purple for border
    }
  };

  const colors = colorScheme[type];

  const config = {
    sentiment: {
      icon: <TrendingUpIcon sx={{ color: colors.primary }} />,
      title: 'Analyzing Sentiment',
      message: 'Please wait while we analyze market sentiment and generate insights...'
    },
    recommendations: {
      icon: <AutoAwesomeIcon sx={{ color: colors.primary }} />,
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
        gap: 2,
        background: `linear-gradient(to bottom, white, ${colors.gradient})`,
        boxShadow: `0 8px 32px ${colors.shadow}`,
        border: `1px solid ${colors.border}`
      }}>
        <Box sx={{ 
          position: 'relative',
          display: 'inline-flex',
          animation: 'pulse 1.5s infinite',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -5,
            left: -5,
            right: -5,
            bottom: -5,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.shadow} 0%, rgba(255, 255, 255, 0) 70%)`,
            animation: 'glow 1.5s infinite alternate',
            zIndex: -1
          }
        }}>
          <CircularProgress 
            size={60} 
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
            fontSize: '1.1rem',
            letterSpacing: '0.01em'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: '0.9rem',
            lineHeight: 1.5,
            maxWidth: '90%',
            mx: 'auto'
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
              transform: 'scale(0.9)',
            },
            '100%': {
              opacity: 0.8,
              transform: 'scale(1.1)',
            },
          },
        }} />
      </Box>
    </Modal>
  );
};

export default LoadingModal; 