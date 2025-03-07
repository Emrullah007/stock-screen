# AI-Powered Stock Market Analysis 📈

A sophisticated web application leveraging AI to provide comprehensive stock market analysis, sentiment evaluation, and personalized investment recommendations.

![Main View - Stock Analysis Dashboard](docs/images/main-view.png)
*AI-powered stock analysis dashboard showcasing real-time market data, sentiment analysis, and intelligent investment recommendations*

## 🌟 Key Features

### Real-Time Market Analysis
- Live stock data with price, volume, and market metrics
- Interactive price charts with historical data visualization
- Company information and key financial statistics
- Technical indicators and market trends
- Comprehensive financial metrics display

### AI-Powered Intelligence
- **Sentiment Analysis Agent**
  - Processes real-time market data and news
  - Analyzes technical indicators and trends
  - Evaluates market sentiment and positioning
  - Identifies key opportunities and risks
  - Provides comprehensive market context

- **Investment Recommendation Agent**
  - Generates personalized investment strategies
  - Adapts to user's risk tolerance
  - Provides actionable entry/exit points
  - Monitors market conditions
  - Risk-adjusted portfolio suggestions

### Modern User Experience
- Intuitive stock search with detailed results
- Responsive Material Design interface
- Real-time data updates
- Interactive charts and visualizations
- Seamless user interactions

## 🚀 Quick Start

### Prerequisites

#### Development Environment Setup
1. **Node.js 16+ for Frontend**
   - Download and install from [Node.js official website](https://nodejs.org/)
   - Verify installation: `node --version`
   - This will include npm (Node Package Manager) needed for frontend dependencies

2. **Python 3.8+ for Backend**
   - Download and install from [Python official website](https://www.python.org/downloads/)
   - Verify installation: `python3 --version`
   - Make sure pip (Python package manager) is included in the installation

3. **Azure Functions Core Tools**
   - Install with npm: `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
   - Verify installation: `func --version`
   - Required for local backend development and deployment

#### API Access Setup
1. **Azure OpenAI API Access**
   - Sign up for [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
   - Follow the [Azure OpenAI deployment guide](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal):
     1. Create an Azure account if you don't have one
     2. Request access to Azure OpenAI Service
     3. Create an Azure OpenAI resource
     4. Deploy a model (we use GPT-4o)
     5. Get your API key and endpoint from the Azure portal

2. **NewsAPI Key**
   - Sign up at [NewsAPI.org](https://newsapi.org/register)
   - Get your API key from the [account dashboard](https://newsapi.org/account)
   - Free tier available for development (100 requests/day)
   - Consider paid tier for production use

### Backend Setup
```bash
# Navigate to backend directory
cd azure-functions-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Unix/macOS
.\\venv\\Scripts\\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start development server
func start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Complete Local Testing
We've provided a convenient script to test the entire application locally:

```bash
# Make the test script executable
chmod +x test-local.sh

# Run the test script
./test-local.sh
```

This will:
1. Start the Azure Functions backend on port 7071
2. Start the frontend development server on port 5173
3. Open both in the background
4. Show you the URLs to access them

You can then:
- Open http://localhost:5173 in your browser
- Test all the application features
- Press Ctrl+C in the terminal when you're done to stop both servers

## 🔧 Configuration

### Frontend Environment Variables (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:7071/api

# Development Settings
VITE_DEV_MODE=true
```

### Backend Environment Variables (.env)
```env
# Azure OpenAI Configuration
AZURE_API_KEY=your_azure_api_key_here
AZURE_ENDPOINT=https://your-resource-name.openai.azure.com/openai/deployments/your-deployment-name/chat/completions
AZURE_MODEL_NAME=gpt-4

# News API Configuration
NEWS_API_KEY=your_newsapi_key_here

# Security Settings
SECRET_KEY=your_secure_key_here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://*.azurestaticapps.net,https://*.azurewebsites.net
```

## 🏗️ Project Structure

```
.
├── frontend/                      # React + Vite frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   ├── .env.example             # Environment variables template
│   ├── .env.production          # Production environment variables
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── index.html               # HTML entry point
│   ├── .npmrc                   # NPM configuration
│   └── eslint.config.js         # ESLint configuration
│
├── azure-functions-backend/      # Azure Functions backend
│   ├── function_app.py          # Main application file with API endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment variables template
│   ├── host.json               # Azure Functions host configuration
│   └── local.settings.json     # Local development settings
│
├── docs/                        # Documentation
│   └── images/                 # Application screenshots and images
│
├── .github/workflows/          # GitHub Actions workflows
│   └── azure-static-web-apps.yml # Azure Static Web Apps deployment
│
├── staticwebapp.config.json    # Azure Static Web Apps configuration
├── test-local.sh               # Local testing script
├── .env.example                # Root environment template
├── README.md                   # Project documentation
├── LICENSE                     # MIT license with terms
└── .gitignore                  # Git ignore rules
```

## 🔄 Development Workflow

1. **Start Backend Server**
   ```bash
   cd azure-functions-backend
   source venv/bin/activate
   func start
   ```
   Backend will be available at:
   - API Endpoint: http://localhost:7071/api
   - Available Functions:
     - `/GetStockData`: Get real-time stock information
     - `/GetStockHistory`: Get historical price data
     - `/GetSentimentAnalysis`: Get AI-powered sentiment analysis
     - `/GetInvestmentRecommendation`: Get personalized investment recommendations
     - `/SearchStocks`: Search for stocks by symbol

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

3. **Test Complete Setup**
   ```bash
   # From project root
   ./test-local.sh
   ```
   This will start both frontend and backend servers and ensure they can communicate properly.

## 📱 Features in Detail

### Stock Information
- Real-time price updates with dynamic refresh
- Interactive historical price charts with multiple timeframes
- Comprehensive technical indicators and analysis
- Detailed company fundamentals and metrics
- Advanced market statistics and trends
- Key financial ratios and performance indicators

### Stock Search & Discovery
- Smart search functionality with real-time suggestions
- Detailed company information in search results
- Quick access to key financial metrics
- Efficient stock symbol lookup
- Comprehensive market data preview

### AI Analysis System
1. **Sentiment Analysis Agent**
   - Real-time market news processing and analysis
   - Technical indicator pattern recognition
   - Market sentiment evaluation and scoring
   - Risk factor identification and assessment
   - News impact analysis and correlation
   - Trend identification and projection

2. **Investment Recommendation Agent**
   - Personalized strategy generation
   - Risk tolerance-based recommendations
   - Dynamic entry/exit point suggestions
   - Portfolio optimization guidance
   - Market condition monitoring
   - Risk-adjusted return analysis

### User Interface
- Clean, modern Material Design implementation
- Responsive layout for all device sizes
- Interactive data visualization
- Real-time updates and notifications
- Intuitive navigation and controls
- Seamless user experience
- Accessible design patterns

## 🚀 Deployment

### Azure Static Web Apps Deployment

#### Configuration Files
The following files have been added to support Azure Static Web Apps:

1. `staticwebapp.config.json` - Configuration for routes and settings
2. `.github/workflows/azure-static-web-apps.yml` - GitHub Actions workflow
3. `frontend/.env.production` - Production environment variables
4. `test-local.sh` - Script to test the setup locally

#### Deployment Steps

1. **Create an Azure Static Web App**
   - Go to the [Azure Portal](https://portal.azure.com)
   - Search for "Static Web Apps" and click "Create"
   - Fill in the basic details:
     - Subscription: Your Azure subscription
     - Resource Group: Create new or use existing
     - Name: Choose a name for your app (e.g., stock-analysis-app)
     - Hosting Plan: Free (or Standard for production)
     - Region: Choose the closest to your users

   - Source Control details:
     - Source: GitHub
     - Organization: Your GitHub organization/username
     - Repository: Your repository name
     - Branch: azure-functions (or your main branch)

   - Build details:
     - Build Preset: Custom
     - App location: `/frontend`
     - API location: `/azure-functions-backend`
     - Output location: `dist`

   - Click "Review + create" and then "Create"

2. **Update Environment Variables**
   After deployment, add environment variables in the Azure Portal:
   - Go to your Static Web App resource
   - Click on "Configuration" in the left menu
   - Add the following environment variables:
     - AZURE_API_KEY
     - AZURE_ENDPOINT
     - AZURE_MODEL_NAME
     - NEWS_API_KEY
     - SECRET_KEY

3. **Troubleshooting**
   - **CORS Issues**:
     - Ensure your backend's CORS settings include your Azure Static Web App URL
     - Check the `staticwebapp.config.json` file for proper API routing
     - Verify that your frontend is using the correct API URL

   - **Deployment Failures**:
     - Check the GitHub Actions logs for specific errors
     - Verify that your build commands work locally
     - Ensure all required environment variables are set

4. **Additional Resources**
   - [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
   - [GitHub Actions for Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
   - [Troubleshooting Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/troubleshooting)

### Backend (Azure Functions)
1. Create Azure Function App in your Azure portal
2. Configure deployment:
   ```
   Runtime stack: Python
   Version: 3.8
   ```
3. Set up environment variables from `.env.example`
4. Deploy your function code using Azure Functions Core Tools:
   ```bash
   cd azure-functions-backend
   func azure functionapp publish YOUR_FUNCTION_APP_NAME
   ```
5. Enable CORS for your Azure Static Web App domain

## 🔒 Security Considerations

- API keys are stored securely in environment variables
- CORS is configured for specific origins
- Rate limiting is implemented on API endpoints
- Input validation on all user inputs
- Secure HTTPS communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License & Legal Information

### Project Code License
The original code in this project is available under the MIT License. However, please note that this only applies to our original code contributions.

### Important License Considerations

This project incorporates various components with different licensing requirements:

#### Commercial API Services
- **Azure OpenAI Service**
  - Requires a paid subscription
  - Subject to Microsoft's commercial terms and conditions
  - Usage restrictions apply to AI-generated content

- **NewsAPI**
  - Requires a paid API key
  - Subject to NewsAPI's terms of service
  - Usage limitations based on subscription tier

- **Yahoo Finance Data (via yfinance)**
  - Data provided by Yahoo Finance is subject to Yahoo's terms of service
  - yfinance is licensed under Apache 2.0
  - Commercial usage may require direct agreement with Yahoo

#### Open Source Dependencies
Our project uses various open-source packages, each with their own licenses:

##### Frontend (MIT Licensed)
- React
- Material-UI
- Chart.js
- Vite
- React Router
- Axios

##### Backend
- Python (PSF License)
- Azure Functions (MIT)
- pandas (BSD 3-Clause)
- numpy (BSD 3-Clause)

### Legal Disclaimer

1. **Data Usage**: 
   - Financial data provided through this application comes from third-party sources
   - Users must comply with respective data providers' terms of service
   - Commercial use may require separate agreements with data providers

2. **API Services**:
   - Users must obtain their own API keys
   - Comply with all API service providers' terms and conditions
   - Monitor and adhere to usage limits and restrictions

3. **Open Source Components**:
   - Attribution requirements must be maintained
   - Some components may have additional restrictions
   - Modifications to open-source components must comply with their respective licenses

### Commercial Use Notice

For commercial use of this application, you must:
1. Obtain appropriate licenses for all API services
2. Ensure compliance with data providers' terms of service
3. Review and comply with all third-party component licenses
4. Consider obtaining legal advice for commercial deployment

For detailed terms of service and licensing information, please refer to each service provider's documentation:
- [Azure OpenAI Service Terms](https://azure.microsoft.com/en-us/support/legal/)
- [NewsAPI Terms](https://newsapi.org/terms)
- [Yahoo Finance Terms](https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html)

## 🙏 Acknowledgments

- OpenAI/Azure OpenAI for AI capabilities
- NewsAPI for market news data
- Material-UI for components
- Chart.js for visualizations
- yfinance for stock data

## ⚠️ Disclaimer

This application is for informational purposes only. The AI-generated analyses and recommendations should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions.

## 📞 Support

For support and troubleshooting:
1. Review the documentation sections above
2. Check your environment variables are properly configured
3. Ensure all dependencies are installed correctly
4. Verify API keys and services are active
5. Contact your system administrator or development team

---

Built with ❤️ using:
- Frontend: React, Vite, Material-UI, Chart.js
- Backend: Python, Azure Functions
- AI/ML: Azure OpenAI
- Data: NewsAPI, Yahoo Finance
- Development: Node.js, npm 