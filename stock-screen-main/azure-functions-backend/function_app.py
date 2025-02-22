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
_yfinance = None
_openai = None

ALPHA_VANTAGE_API_KEY = os.environ.get('ALPHA_VANTAGE_API_KEY', 'NDSKE1UJ0QF4EKTK')
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"

def get_yfinance():
    """Initialize yfinance"""
    global _yfinance
    if _yfinance is None:
        _yfinance = yf
    return _yfinance

def get_openai() -> AzureOpenAI:
    """Initialize Azure OpenAI client"""
    api_key = os.environ.get('OPENAI_API_KEY')
    api_base = os.environ.get('OPENAI_API_BASE')
    api_version = os.environ.get('OPENAI_API_VERSION', '2024-08-01-preview')
    
    return AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=api_base
    )

def get_newsapi():
    """Initialize News API configuration"""
    api_key = os.environ.get('NEWS_API_KEY')
    return {
        'api_key': api_key,
        'base_url': 'https://newsapi.org/v2'
    }

def get_stock_data(symbol: str):
    """Get stock data from Alpha Vantage."""
    try:
        quote_params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        quote_response = requests.get(ALPHA_VANTAGE_BASE_URL, params=quote_params)
        quote_data = quote_response.json()

        if "Global Quote" not in quote_data or not quote_data["Global Quote"]:
            raise Exception("No data found for symbol")

        quote = quote_data["Global Quote"]

        overview_params = {
            "function": "OVERVIEW",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        overview_response = requests.get(ALPHA_VANTAGE_BASE_URL, params=overview_params)
        overview_data = overview_response.json()

        return {
            "symbol": symbol.upper(),
            "name": overview_data.get("Name", ""),
            "current_price": float(quote.get("05. price", 0)),
            "change_percent": float(quote.get("10. change percent", "0%").rstrip('%')),
            "volume": int(quote.get("06. volume", 0)),
            "market_cap": float(overview_data.get("MarketCapitalization", 0)),
            "pe_ratio": float(overview_data.get("PERatio", 0)),
            "dividend_yield": float(overview_data.get("DividendYield", 0)) * 100,
            "sector": overview_data.get("Sector", ""),
            "industry": overview_data.get("Industry", ""),
            "day_high": float(quote.get("03. high", 0)),
            "day_low": float(quote.get("04. low", 0)),
            "currency": "USD"
        }
    except Exception as e:
        logger.error(f"Error fetching stock data: {str(e)}")
        raise

def get_stock_history(symbol: str, period: str = "1mo"):
    """Get historical stock data from Alpha Vantage."""
    try:
        output_size = "compact" if period in ["1mo", "3mo"] else "full"
        
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "outputsize": output_size,
            "apikey": ALPHA_VANTAGE_API_KEY
        }
        
        response = requests.get(ALPHA_VANTAGE_BASE_URL, params=params)
        data = response.json()
        
        if "Time Series (Daily)" not in data:
            raise Exception("No historical data found")
            
        time_series = data["Time Series (Daily)"]
        history = []
        
        for date, values in time_series.items():
            history.append({
                "date": date,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "volume": int(values["5. volume"])
            })
        
        history.sort(key=lambda x: x["date"])
        
        if period == "1mo":
            history = history[-30:]
        elif period == "3mo":
            history = history[-90:]
        elif period == "6mo":
            history = history[-180:]
        elif period == "1y":
            history = history[-365:]
            
        return history
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
        
        if "Invalid API call" in error_msg:
            status_code = 400
            error_msg = "Invalid stock symbol"
        elif "Thank you for using Alpha Vantage" in error_msg:
            status_code = 429
            error_msg = "API call frequency limit reached. Please try again later."
        
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
        
        if "Invalid API call" in error_msg:
            status_code = 400
            error_msg = "Invalid stock symbol"
        elif "Thank you for using Alpha Vantage" in error_msg:
            status_code = 429
            error_msg = "API call frequency limit reached. Please try again later."
        
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