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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Stock Price History',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};

const StockChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Price',
        data: data.map(item => item.close),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
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