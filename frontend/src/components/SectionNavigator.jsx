import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const SectionNavigator = ({ sections, activeSection, onSectionClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        position: 'fixed',
        ...(isMobile ? {
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          flexDirection: 'row',
          borderRadius: '24px',
          py: 0.5,
          px: 1,
        } : {
          top: '50%',
          right: '16px',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          borderRadius: '24px',
          py: 1,
          px: 0.5,
        }),
        display: 'flex',
        gap: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {sections.map((section, index) => {
        // Determine which icon to show based on section ID
        let icon;
        let color;
        
        switch(section.id) {
          case 'stock-info':
            icon = <InfoIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }} />;
            color = '#2196F3';
            break;
          case 'stock-chart':
            icon = <ShowChartIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }} />;
            color = '#009688';
            break;
          case 'sentiment-analysis':
            icon = <TrendingUpIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }} />;
            color = '#2196F3';
            break;
          case 'ai-recommendations':
            icon = <AutoAwesomeIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }} />;
            color = '#7E57C2';
            break;
          default:
            icon = <InfoIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.4rem' }} />;
            color = '#2196F3';
        }
        
        const isActive = activeSection === section.id;
        
        return (
          <Tooltip
            key={section.id}
            title={section.label}
            placement={isMobile ? "top" : "left"}
          >
            <IconButton
              onClick={() => onSectionClick(section.id)}
              sx={{
                width: isMobile ? '40px' : '46px',
                height: isMobile ? '40px' : '46px',
                position: 'relative',
                color: isActive ? color : 'text.secondary',
                backgroundColor: isActive ? `${color}10` : 'transparent',
                '&:hover': {
                  backgroundColor: `${color}20`,
                },
                transition: 'all 0.2s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  ...(isMobile ? {
                    bottom: '3px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '2px',
                  } : {
                    right: '3px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2px',
                    height: '8px',
                  }),
                  backgroundColor: color,
                  borderRadius: '4px',
                } : {},
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default SectionNavigator; 