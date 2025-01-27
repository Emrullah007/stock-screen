# Stock Screen

A comprehensive stock screening and analysis platform that combines real-time market data with AI-powered insights.

## Features

- Real-time stock data visualization
- AI-powered stock analysis and recommendations
- Technical indicators and charts
- News sentiment analysis
- Personalized stock watchlists
- Advanced filtering and screening capabilities

## Tech Stack

### Frontend
- React.js with Vite
- Modern UI components
- Real-time data updates
- Interactive charts and visualizations

### Backend
- FastAPI (Python)
- Integration with multiple stock data APIs
- AI/ML processing capabilities
- Azure OpenAI Service integration

### Data Sources
- Yahoo Finance API
- Alpha Vantage API (optional)
- News APIs for sentiment analysis

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On Unix/macOS
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a .env file with necessary API keys
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
AZURE_API_KEY=your_azure_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key (optional)
```

## License

MIT License 