import azure.functions as func
import logging
import json
import os
import requests
from datetime import datetime
import yfinance as yf
from openai import AzureOpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('azure.functions')

app = func.FunctionApp()

# Initialize dependencies lazily
_openai = None

def get_openai() -> AzureOpenAI:
    """Initialize Azure OpenAI client"""
    api_key = os.environ.get('AZURE_API_KEY')
    api_base = os.environ.get('AZURE_ENDPOINT')
    model_name = os.environ.get('AZURE_MODEL_NAME', 'gpt-4o')
    
    return AzureOpenAI(
        api_key=api_key,
        azure_endpoint=api_base,
        api_version="2024-08-01-preview"
    )

def get_newsapi():
    """Initialize News API configuration"""
    api_key = os.environ.get('NEWS_API_KEY')
    return {
        'api_key': api_key,
        'base_url': 'https://newsapi.org/v2'
    }

def get_stock_data(symbol: str):
    """Get stock data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info:
            raise Exception("No data found for symbol")

        return {
            "symbol": symbol.upper(),
            "name": info.get("longName", ""),
            "current_price": round(info.get("currentPrice", 0), 2),
            "change_percent": round(info.get("regularMarketChangePercent", 0), 2),
            "volume": info.get("volume", 0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": round(info.get("trailingPE", 0), 2),
            "dividend_yield": round(info.get("dividendYield", 0) * 100 if info.get("dividendYield") else 0, 2),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "day_high": round(info.get("dayHigh", 0), 2),
            "day_low": round(info.get("dayLow", 0), 2),
            "currency": info.get("currency", "USD")
        }
    except Exception as e:
        logger.error(f"Error fetching stock data: {str(e)}")
        raise

def get_stock_history(symbol: str, period: str = "1mo"):
    """Get historical stock data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period)
        
        if history.empty:
            raise Exception("No historical data found")
            
        result = []
        for index, row in history.iterrows():
            result.append({
                "date": index.strftime("%Y-%m-%d"),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })
            
        return result
    except Exception as e:
        logger.error(f"Error fetching stock history: {str(e)}")
        raise

@app.route(route="GetStockData", auth_level=func.AuthLevel.ANONYMOUS)
def GetStockData(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        if not symbol:
            return func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            )
        
        result = get_stock_data(symbol)
        result = {k: v for k, v in result.items() if v not in (None, 0, "")}
        
        return func.HttpResponse(
            json.dumps({"symbol": symbol, "info": result}),
            mimetype="application/json"
        )
    except Exception as e:
        error_msg = str(e)
        status_code = 500
        
        if "No data found for symbol" in error_msg:
            status_code = 400
            error_msg = "Invalid stock symbol"
        
        return func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": error_msg,
                "status": status_code
            }),
            status_code=status_code,
            mimetype="application/json"
        )

@app.route(route="GetStockHistory", auth_level=func.AuthLevel.ANONYMOUS)
def GetStockHistory(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        period = req.params.get('period', '1y')

        if not symbol:
            return func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            )

        history = get_stock_history(symbol, period)
        return func.HttpResponse(
            json.dumps({"symbol": symbol, "history": history}),
            mimetype="application/json"
        )
    except Exception as e:
        error_msg = str(e)
        status_code = 500
        
        if "No historical data found" in error_msg:
            status_code = 400
            error_msg = "Invalid stock symbol or no historical data available"
        
        return func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": error_msg,
                "status": status_code
            }),
            status_code=status_code,
            mimetype="application/json"
        )

@app.route(route="GetSentimentAnalysis", auth_level=func.AuthLevel.ANONYMOUS)
def GetSentimentAnalysis(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        if not symbol:
            return func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            )

        newsapi = get_newsapi()
        url = f"{newsapi['base_url']}/everything"
        params = {
            'q': symbol,
            'language': 'en',
            'sortBy': 'relevancy',
            'pageSize': 5,
            'apiKey': newsapi['api_key']
        }
        
        response = requests.get(url, params=params)
        news = response.json()

        if response.status_code != 200:
            return func.HttpResponse(
                json.dumps({
                    "symbol": symbol,
                    "error": f"NewsAPI error: {news.get('message', 'Unknown error')}",
                    "status": response.status_code
                }),
                status_code=response.status_code,
                mimetype="application/json"
            )

        articles = []
        for article in news['articles']:
            articles.append({
                'title': article['title'],
                'description': article.get('description', ''),
                'url': article['url'],
                'publishedAt': article['publishedAt'],
                'source': article['source']['name']
            })

        sentiment_score = 0.0  # Neutral sentiment

        return func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "articles": articles,
                "sentiment_score": sentiment_score,
                "analysis_timestamp": datetime.now().isoformat()
            }),
            mimetype="application/json"
        )
    except Exception as e:
        logger.error(f"Error in GetSentimentAnalysis: {str(e)}")
        return func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": str(e),
                "status": 500
            }),
            status_code=500,
            mimetype="application/json"
        )

@app.route(route="GetInvestmentRecommendation", auth_level=func.AuthLevel.ANONYMOUS)
def GetInvestmentRecommendation(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        if not symbol:
            return func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            )

        stock = yf.Ticker(symbol)
        info = stock.info
        
        context = f"Please provide an investment recommendation for {symbol} stock, which is currently trading at ${info.get('currentPrice', 'N/A')}."
        
        client = get_openai()
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a financial advisor. Provide a brief investment recommendation."},
                {"role": "user", "content": context}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        recommendation = response.choices[0].message.content

        return func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "recommendation": recommendation,
                "current_price": info.get('currentPrice')
            }),
            mimetype="application/json"
        )
    except Exception as e:
        logger.error(f"Error in GetInvestmentRecommendation: {str(e)}")
        return func.HttpResponse(
            json.dumps({"symbol": symbol, "error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )