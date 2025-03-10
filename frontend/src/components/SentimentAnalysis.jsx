import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReactMarkdown from 'react-markdown';

// Market metrics explanations
const metricExplanations = {
  Technical: {
    "Current Price": "The latest trading price of the stock",
    "50-Day MA": "50-Day Moving Average - Average closing price over the last 50 trading days, used to identify medium-term trends",
    "200-Day MA": "200-Day Moving Average - Average closing price over the last 200 trading days, used to identify long-term trends",
    "RSI": "Relative Strength Index - Momentum indicator that measures the speed and magnitude of recent price changes to evaluate overbought or oversold conditions",
    "52-Week High": "Highest trading price of the stock over the past 52 weeks",
    "52-Week Low": "Lowest trading price of the stock over the past 52 weeks",
    "Beta": "Measure of stock's volatility compared to the overall market. Beta > 1 means more volatile than market, < 1 means less volatile"
  },
  Valuation: {
    "Market Cap": "Total market value of the company's outstanding shares",
    "P/E Ratio": "Price-to-Earnings Ratio - Stock price divided by earnings per share, indicates how much investors are willing to pay for $1 of earnings",
    "Forward P/E": "Forward Price-to-Earnings Ratio - Stock price divided by predicted future earnings per share",
    "PEG Ratio": "Price/Earnings to Growth Ratio - P/E ratio divided by earnings growth rate, helps determine stock's value while considering growth",
    "Price/Book": "Price-to-Book Ratio - Stock price divided by book value per share, indicates if stock is overvalued or undervalued relative to assets"
  },
  "Growth & Performance": {
    "Revenue Growth": "Year-over-year increase in company's revenue",
    "Profit Margins": "Net profit divided by revenue, shows how much profit company makes from its revenue",
    "Return on Equity": "Net income divided by shareholders' equity, measures company's profitability relative to stockholders' investment"
  },
  "Market Sentiment": {
    "Analyst Rating": "Consensus recommendation from financial analysts (Buy, Hold, or Sell)",
    "Short % of Float": "Percentage of freely tradable shares that are currently sold short, high percentage indicates bearish sentiment"
  }
};

const MetricsSection = ({ title, metrics, icon }) => {
  // Don't render section if no metrics or all values are N/A
  if (!metrics || Object.values(metrics).every(value => value === 'N/A')) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          fontSize: '1rem',
          fontWeight: 500,
          color: 'primary.main'
        }}
      >
        {icon}
        {title}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(metrics).map(([key, value]) => {
          // Skip metrics with N/A value
          if (value === 'N/A') return null;

          // Determine if this is a percentage or price change metric
          const isChangeMetric = key.toLowerCase().includes('change') || 
                               key.toLowerCase().includes('growth') || 
                               key.toLowerCase().includes('margins') ||
                               key.toLowerCase().includes('return');

          // Determine text color based on metric type and value
          const getValueColor = () => {
            if (isChangeMetric) {
              return value.startsWith('-') ? 'error.main' : 'success.main';
            }
            if (key === 'Analyst Rating') {
              switch (value) {
                case 'BUY':
                case 'STRONG_BUY':
                  return 'success.main';
                case 'SELL':
                case 'STRONG_SELL':
                  return 'error.main';
                default:
                  return 'text.primary';
              }
            }
            return 'text.primary';
          };

          return (
            <Grid item xs={6} sm={4} key={key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {key}
                </Typography>
                <Tooltip 
                  title={metricExplanations[title]?.[key] || ""}
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ padding: 0.2 }}>
                    <HelpOutlineIcon sx={{ fontSize: '0.9rem', color: 'action.active' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: getValueColor(),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                {value}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

const SentimentAnalysis = ({ data, onClose }) => {
  if (!data || !data.articles) return null;

  const metricsConfig = {
    Technical: {
      icon: <ShowChartIcon sx={{ fontSize: '1.2rem' }} />,
      metrics: data.market_metrics?.Technical || {}
    },
    Valuation: {
      icon: <BarChartIcon sx={{ fontSize: '1.2rem' }} />,
      metrics: data.market_metrics?.Valuation || {}
    },
    'Growth & Performance': {
      icon: <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />,
      metrics: data.market_metrics?.['Growth & Performance'] || {}
    },
    'Market Sentiment': {
      icon: <PeopleIcon sx={{ fontSize: '1.2rem' }} />,
      metrics: data.market_metrics?.['Market Sentiment'] || {}
    }
  };

  return (
    <Card elevation={3} sx={{ mt: 4, mb: 4, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Market Analysis: {data.company_name} ({data.symbol})
          </Typography>
        </Box>

        {/* Market Metrics */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'text.primary'
            }}
          >
            Market Metrics
          </Typography>
          {Object.entries(metricsConfig).map(([section, { icon, metrics }]) => (
            <MetricsSection
              key={section}
              title={section}
              metrics={metrics}
              icon={icon}
            />
          ))}
        </Box>

        {/* AI Sentiment Analysis */}
        {data.sentiment_analysis && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default',
              '& h1, & h2, & h3': {
                fontWeight: 600,
                my: 2,
                color: 'primary.main',
                fontSize: '1.1rem'
              },
              '& p': {
                mb: 2,
                color: 'text.primary'
              },
              '& ul, & ol': {
                mt: 0,
                mb: 2,
                pl: 2
              },
              '& li': {
                mb: 1,
                color: 'text.primary'
              },
              '& strong': {
                color: 'primary.main',
                fontWeight: 600
              }
            }}
          >
            <ReactMarkdown components={{
              p: ({ node, children }) => (
                <Typography 
                  component="div" 
                  sx={{ 
                    mb: 2,
                    '& p': {
                      margin: 0,
                      padding: 0
                    }
                  }}
                >
                  {children}
                </Typography>
              ),
              h3: ({ node, children }) => (
                <Typography variant="h6" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {children}
                </Typography>
              )
            }}>
              {data.sentiment_analysis}
            </ReactMarkdown>
          </Paper>
        )}

        {/* News Articles */}
        <Accordion defaultExpanded={!data.sentiment_analysis}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: 'background.default',
              borderRadius: 1
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              📰 Recent News Articles
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {data.articles.map((article, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                    <ListItemText
                      primary={
                        <Typography
                          component="a"
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {article.title}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {article.description}
                          </Typography>
                          <Typography
                            component="p"
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Source: {article.source} - {new Date(article.publishedAt).toLocaleDateString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < data.articles.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {new Date(data.analysis_timestamp).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis; 