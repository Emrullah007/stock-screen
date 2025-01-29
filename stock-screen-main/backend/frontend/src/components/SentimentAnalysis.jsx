import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SentimentAnalysis = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Card elevation={3} sx={{ mt: 4, mb: 4, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Sentiment Analysis: {data.symbol}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: 'background.default',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
            lineHeight: 1.6,
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
          {data.analysis}
        </Paper>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {new Date(data.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis; 