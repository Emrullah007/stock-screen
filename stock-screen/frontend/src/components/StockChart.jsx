import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ data, stockName }) => {
  if (!data || data.length === 0) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: window.innerWidth < 600 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: `Stock Price History - ${stockName || ''}`,
        font: {
          size: window.innerWidth < 600 ? 14 : 16,
          weight: 'normal'
        },
        padding: {
          bottom: window.innerWidth < 600 ? 10 : 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        border: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 11,
            family: '"Roboto", "Helvetica", "Arial", sans-serif'
          },
          padding: 8,
          callback: function(value) {
            return value.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        border: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 11,
            family: '"Roboto", "Helvetica", "Arial", sans-serif'
          },
          padding: 5,
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          maxTicksLimit: window.innerWidth < 600 ? 12 : 24,
          align: 'start',
          callback: function(value, index, values) {
            const date = new Date(this.getLabelForValue(value));
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            const dataLength = values.length;
            
            // Only show dates for first, last, and some intermediate points
            if (index === 0 || index === dataLength - 1 || index % Math.ceil(dataLength / (window.innerWidth < 600 ? 12 : 24)) === 0) {
              if (window.innerWidth < 600) {
                return isToday ? 'Today' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              }
              
              // Format like "2023/12/31"
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              return `${year}/${month}/${day}`;
            }
            return '';
          }
        }
      }
    },
    elements: {
      point: {
        radius: 2,
        hoverRadius: 4,
        borderWidth: 1.5,
        pointStyle: 'circle'
      },
      line: {
        tension: 0.2,
        borderWidth: 1.5,
        borderColor: '#1976d2'
      }
    }
  };

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      if (window.innerWidth < 600) {
        return isToday ? 'Today' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
      
      // Format like "2023/12/31"
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }),
    datasets: [
      {
        label: 'Price',
        data: data.map(item => item.close),
        borderColor: '#1976d2',
        backgroundColor: '#1976d2',
        pointBackgroundColor: '#1976d2',
        pointBorderColor: '#1976d2',
        fill: false,
        borderWidth: 1.5,
      },
    ],
  };

  return (
    <Paper elevation={3} sx={{ 
      p: { xs: 1.5, sm: 2 }, 
      mb: { xs: 2, sm: 4 }
    }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          fontSize: { xs: '1rem', sm: '1.1rem' },
          textAlign: { xs: 'center', sm: 'left' },
          fontWeight: 500,
          color: '#2C3E50',
          mb: 2
        }}
      >
        Price History
      </Typography>
      <Box sx={{ 
        height: { xs: 300, sm: 400 },
        width: '100%',
        pt: 1
      }}>
        <Line options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default StockChart; 