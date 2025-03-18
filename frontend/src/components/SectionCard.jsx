import React, { forwardRef, useEffect } from 'react';
import { Box, Paper, Typography, useMediaQuery, useTheme, Divider } from '@mui/material';
import { useNavigation } from '../context/NavigationContext';

const SectionCard = forwardRef(({ 
  id, 
  label, 
  icon, 
  color = 'primary.main', 
  children, 
  noPadding = false,
  fullWidth = false,
  noShadow = false,
  className
}, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { registerSection } = useNavigation();

  useEffect(() => {
    // Register this section with the navigation context
    if (id && ref) {
      registerSection(id, ref, label);
    }
  }, [id, ref, label, registerSection]);

  return (
    <Paper
      id={id}
      ref={ref}
      elevation={0}
      className={className}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        width: '100%',
        mb: 0.5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ 
        px: { xs: 1.5, sm: 2 },
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {icon && (
          <Box sx={{ 
            display: 'flex', 
            color,
            alignItems: 'center'
          }}>
            {icon}
          </Box>
        )}
        <Typography 
          variant="subtitle1" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            lineHeight: 1.4
          }}
        >
          {label}
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: noPadding ? 0 : { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper'
      }}>
        {children}
      </Box>
    </Paper>
  );
});

export default SectionCard; 