# AI-Powered Stock Market Analysis 📈

A sophisticated web application leveraging AI to provide comprehensive stock market analysis, sentiment evaluation, and personalized investment recommendations.

![Main View - Stock Analysis Dashboard](docs/images/main-view.png)
*AI-powered stock analysis dashboard with real-time market data and intelligent insights*

## 🌟 Key Features

### Real-Time Market Analysis
- Live stock data with price, volume, and market metrics
- Interactive price charts with historical data visualization
- Company information and key financial statistics

### AI-Powered Intelligence
- **Sentiment Analysis Agent**
  - Processes real-time market data and news
  - Analyzes technical indicators and trends
  - Evaluates market sentiment and positioning
  - Identifies key opportunities and risks

- **Investment Recommendation Agent**
  - Generates personalized investment strategies
  - Adapts to user's risk tolerance
  - Provides actionable entry/exit points
  - Monitors market conditions

### Modern User Experience
- Intuitive stock search with detailed results
- Responsive Material Design interface
- Real-time data updates
- Interactive charts and visualizations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ for frontend
- Python 3.8+ for backend
- Azure OpenAI API access
- NewsAPI key

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

### Backend Setup
```bash
# Navigate to backend directory
cd azure-functions-backend

# Create virtual environment
python -m venv venv

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
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🏗️ Project Structure

```
.
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
├── azure-functions-backend/ # Azure Functions backend
│   ├── function_app.py     # Main application file
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── README.md               # Project documentation
├── LICENSE                 # MIT license with terms
└── .gitignore             # Git ignore rules
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

3. **Testing**
   ```bash
   # Frontend tests
   cd frontend
   npm run test

   # Frontend test coverage
   npm run coverage
   ```

## 📱 Features in Detail

### Stock Information
- Real-time price updates
- Historical price charts
- Technical indicators
- Company fundamentals
- Market statistics

### AI Analysis System
1. **Sentiment Analysis Agent**
   - Market news processing
   - Technical indicator analysis
   - Sentiment evaluation
   - Risk assessment

2. **Investment Recommendation Agent**
   - Strategy generation
   - Risk-adjusted recommendations
   - Entry/exit point suggestions
   - Portfolio considerations

### User Interface
- Modern Material Design
- Responsive layout
- Interactive charts
- Real-time updates
- Intuitive navigation

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: dist
   Framework Preset: Vite
   ```
3. Add environment variables from `.env.example`

### Backend (Azure Functions)
1. Create Azure Function App
2. Configure deployment:
   ```
   Runtime stack: Python
   Version: 3.8
   ```
3. Set up environment variables from `.env.example`
4. Enable CORS for frontend domain

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