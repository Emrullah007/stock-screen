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
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `Stock Price History - ${stockName || ''}`,
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: {
          bottom: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 6,
        borderWidth: 2,
        pointStyle: 'circle'
      },
      line: {
        tension: 0.2
      }
    }
  };

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Price',
        data: data.map(item => item.close),
        borderColor: '#1976d2',  // Primary blue color
        backgroundColor: '#1976d2',
        pointBackgroundColor: '#1976d2',
        pointBorderColor: '#1976d2',
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Price History
      </Typography>
      <Box sx={{ height: 400 }}>
        <Line options={options} data={chartData} />
      </Box>
    </Paper>
  );
};

export default StockChart; 