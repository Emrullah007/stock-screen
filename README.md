# AI-Powered Stock Market Analysis

A modern web application that provides AI-enhanced stock market analysis, sentiment evaluation, and investment recommendations.

## Features

- 📈 Real-time stock information and historical data visualization
- 🤖 AI-powered sentiment analysis of market trends
- 💡 Intelligent investment recommendations based on risk profile
- 📊 Interactive stock price charts
- 🔍 Smart stock search functionality
- 💫 Modern, responsive UI with Material Design

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Chart.js for data visualization
- React Router for navigation
- Vite for build tooling

### Backend
- FastAPI
- OpenAI/Azure OpenAI for AI analysis
- yfinance for stock data
- Python 3.8+

## Prerequisites

- Node.js 16+
- Python 3.8+
- OpenAI API key or Azure OpenAI credentials
- NewsAPI key for sentiment analysis

## Installation

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Configuration

1. Create a `.env` file in the backend directory using the template below:
```env
# OpenAI Configuration (if using OpenAI directly)
OPENAI_API_KEY=your_openai_key_here

# Azure OpenAI Configuration (if using Azure OpenAI)
AZURE_API_KEY=your_azure_api_key_here
AZURE_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_MODEL_NAME=your-deployed-model-name

# Other APIs
NEWS_API_KEY=your_newsapi_key_here

# Security
SECRET_KEY=your_secret_key_here
```

2. Configure the frontend API URL in `src/services/api.js` if needed.

### Obtaining API Keys

#### Azure OpenAI Setup
1. Go to the [Azure Portal](https://portal.azure.com)
2. Create a new Azure OpenAI resource
3. Navigate to "Keys and Endpoint" in your resource
4. Copy the following:
   - Key (AZURE_API_KEY)
   - Endpoint (AZURE_ENDPOINT)
5. Deploy a model in Azure OpenAI Studio
6. Copy the deployment name (AZURE_MODEL_NAME)

#### NewsAPI Setup
1. Visit [NewsAPI](https://newsapi.org)
2. Create a free account
3. Copy your API key from the dashboard

### Security Best Practices
- Never commit your `.env` file to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Set up IP restrictions in Azure Portal for production
- Consider using Azure Key Vault for production deployments

### Environment Templates
We provide a `.env.example` file in the repository that you can copy:
```bash
cp .env.example .env
```

### Configuration Validation

Test your configuration by running these checks:

1. Azure OpenAI validation:
```bash
curl -X POST $AZURE_ENDPOINT/openai/deployments/$AZURE_MODEL_NAME/chat/completions?api-version=2024-02-15-preview \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_API_KEY" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

2. NewsAPI validation:
```bash
curl -X GET "https://newsapi.org/v2/everything?q=stock+market&apiKey=$NEWS_API_KEY"
```

### Development vs Production

#### Development Environment
- Use `.env.development` for development-specific settings
- Enable debug modes and logging
- Use development API keys with higher rate limits

#### Production Environment
- Use `.env.production` for production settings
- Disable debug modes
- Use production API keys with appropriate security measures
- Consider using environment variables in your hosting platform

### Troubleshooting

Common Issues:
1. **"Invalid API Key" Error**
   - Verify the key format
   - Check if the key has been activated
   - Ensure you're using the correct endpoint

2. **Azure OpenAI Connection Issues**
   - Verify your IP is allowlisted
   - Check if the model is deployed
   - Confirm the API version is correct

3. **Rate Limit Errors**
   - Check your current usage
   - Consider upgrading your plan
   - Implement request throttling

4. **Model Not Found**
   - Verify the model deployment name
   - Check if the model is still active
   - Ensure you have access to the model

For any other issues, please check our [Issues](../../issues) page or create a new issue.

## Running the Application

### Start the Backend Server
```bash
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
stock-screen/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── assets/           # Static assets
│   └── public/               # Public assets
└── backend/
    ├── app/
    │   ├── main.py          # FastAPI application
    │   ├── services/        # Business logic
    │   ├── models/          # Data models
    │   └── core/            # Core configurations
    └── requirements.txt     # Python dependencies
```

## Key Components

- **StockInfo**: Displays current stock information, including price, market cap, and key metrics
- **StockChart**: Visualizes historical price data using Chart.js
- **AIRecommendations**: Generates AI-powered investment recommendations
- **SentimentAnalysis**: Provides AI-driven market sentiment analysis
- **LoadingModal**: Animated loading states for async operations

## API Integration

The application integrates with multiple data sources:
- yfinance for real-time stock data
- OpenAI/Azure OpenAI for AI analysis
- NewsAPI for market news and sentiment

## Error Handling

- Comprehensive error handling for API calls
- User-friendly error messages
- Loading states for async operations
- Fallback UI for failed data fetches

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Disclaimer

This application is for informational purposes only and does not provide financial advice. AI-generated analyses may contain errors or inaccuracies. Please consult with a qualified financial advisor before making investment decisions.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- OpenAI/Azure OpenAI for AI capabilities
- yfinance for stock data
- Material-UI for the component library
- Chart.js for data visualization 