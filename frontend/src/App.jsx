import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E88E5',
      light: '#64B5F6',
      dark: '#1565C0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#ffffff',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5E6E7D',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, color: '#2C3E50' },
    h5: { fontWeight: 500, color: '#2C3E50' },
    h6: { fontWeight: 500, color: '#2C3E50' },
    subtitle1: { color: '#5E6E7D' },
    body1: { color: '#2C3E50' },
    body2: { color: '#5E6E7D' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: '12px' },
      },
    },
  },
});

function App() {
  const currentYear = new Date().getFullYear();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}>
        <Home />
        <Box 
          component="footer" 
          sx={{ 
            py: 3, 
            mt: 'auto', 
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} AI-Powered Stock Analysis. Developed by Emrullah Celik
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
