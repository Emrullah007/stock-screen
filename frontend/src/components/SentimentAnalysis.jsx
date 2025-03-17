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

        {/* Recent News Articles - Enhanced UI */}
        <Accordion 
          defaultExpanded={false}
          sx={{
            background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)',
            borderRadius: '8px !important',
            '&:before': {
              display: 'none', // Remove the default divider
            },
            '& .MuiAccordionSummary-root': {
              minHeight: 64,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(145deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.15) 100%)',
              },
            },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
            },
            '& .MuiAccordionDetails-root': {
              padding: 0,
              background: 'white',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ 
              fontSize: '1.5rem',
              color: 'primary.main',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }} />}
            sx={{ 
              bgcolor: 'transparent',
              borderRadius: 1
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📰 Recent News Articles
                </Typography>
                <Chip 
                  label={`${data.articles.length} articles`}
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontStyle: 'italic'
                }}
              >
                Click to view latest news and updates
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={{ 
              width: '100%', 
              bgcolor: 'background.paper',
              py: 0,
              '& .MuiListItem-root': {
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
                },
              },
            }}>
              {data.articles.map((article, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      flexDirection: 'column',
                      p: 2.5,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 1,
                          mb: 1
                        }}>
                          <Typography
                            component="a"
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                              fontSize: '1rem',
                              fontWeight: 500,
                              flex: 1,
                              '&:hover': {
                                textDecoration: 'underline',
                                color: 'primary.dark',
                              },
                            }}
                          >
                            {article.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{
                              lineHeight: 1.5,
                              color: 'text.secondary',
                            }}
                          >
                            {article.description}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            mt: 0.5
                          }}>
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                color: 'text.primary',
                                fontWeight: 500,
                                px: 1,
                                py: 0.25,
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                              }}
                            >
                              {article.source}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&::before': {
                                  content: '""',
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  bgcolor: 'text.disabled',
                                  display: 'inline-block'
                                }
                              }}
                            >
                              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < data.articles.length - 1 && (
                    <Divider component="li" sx={{ 
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                    }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Market Metrics */}
        <Box sx={{ mt: 4, mb: 4 }}>
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