import React from 'react';
import { Line } from 'react-chartjs-2';
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
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../services/api';

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

const StockChart = ({ symbol, period = '1y' }) => {
  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['historicalData', symbol, period],
    queryFn: () => stockApi.getHistoricalData(symbol, period),
    enabled: !!symbol,
  });

  if (!symbol || isLoading || !historicalData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historical Price Chart
          </Typography>
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              {isLoading ? 'Loading...' : 'Select a stock to view chart'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: 'Close Price',
        data: historicalData.map(data => data.close),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Stock Price History`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Historical Price Chart
        </Typography>
        <Box sx={{ height: 400 }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockChart; 