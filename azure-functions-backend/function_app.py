import azure.functions as func
import logging
import json
import os
import requests
from datetime import datetime, timedelta
import yfinance as yf
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('azure.functions')

app = func.FunctionApp()

# Initialize dependencies lazily
_openai = None

def get_openai() -> AzureOpenAI:
    """Initialize Azure OpenAI client"""
    return AzureOpenAI(
        api_key=os.environ.get('AZURE_API_KEY'),
        azure_endpoint=os.environ.get('AZURE_ENDPOINT'),
        api_version="2024-08-01-preview"
    )

def get_newsapi():
    """Initialize News API configuration"""
    return {
        'api_key': os.environ.get('NEWS_API_KEY'),
        'base_url': 'https://newsapi.org/v2'
    }

def add_cors_headers(resp: func.HttpResponse) -> func.HttpResponse:
    """Add CORS headers to the response"""
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    resp.headers['Access-Control-Max-Age'] = '86400'
    return resp

def get_stock_data(symbol: str):
    """Get stock data from Yahoo Finance."""
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info:
            raise Exception("No data found for symbol")

        # Get raw dividend yield
        raw_dividend_yield = info.get("dividendYield")
        
        # Handle dividend yield - ensure it's a proper decimal
        try:
            dividend_yield = float(raw_dividend_yield) if raw_dividend_yield is not None else 0
        except (TypeError, ValueError):
            logger.warning(f"Invalid dividend yield value: {raw_dividend_yield}")
            dividend_yield = 0

        return {
            "symbol": symbol.upper(),
            "name": info.get("longName", ""),
            "current_price": round(info.get("currentPrice", 0), 2),
            "change_percent": round(info.get("regularMarketChangePercent", 0), 2),
            "volume": info.get("volume", 0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": round(info.get("trailingPE", 0), 2),
            "dividend_yield": dividend_yield,  # Already in decimal form (e.g., 0.0081 for 0.81%)
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
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            ))
        
        result = get_stock_data(symbol)
        result = {k: v for k, v in result.items() if v not in (None, 0, "")}
        
        return add_cors_headers(func.HttpResponse(
            json.dumps({"symbol": symbol, "info": result}),
            mimetype="application/json"
        ))
    except Exception as e:
        error_msg = str(e)
        status_code = 500 if "No data found for symbol" not in error_msg else 400
        return add_cors_headers(func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": "Invalid stock symbol" if status_code == 400 else error_msg,
                "status": status_code
            }),
            status_code=status_code,
            mimetype="application/json"
        ))

@app.route(route="GetStockHistory", auth_level=func.AuthLevel.ANONYMOUS)
def GetStockHistory(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        period = req.params.get('period', '1y')

        if not symbol:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            ))

        history = get_stock_history(symbol, period)
        return add_cors_headers(func.HttpResponse(
            json.dumps({"symbol": symbol, "history": history}),
            mimetype="application/json"
        ))
    except Exception as e:
        error_msg = str(e)
        status_code = 500 if "No historical data found" not in error_msg else 400
        return add_cors_headers(func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": "Invalid stock symbol or no historical data available" if status_code == 400 else error_msg,
                "status": status_code
            }),
            status_code=status_code,
            mimetype="application/json"
        ))

@app.route(route="GetSentimentAnalysis", auth_level=func.AuthLevel.ANONYMOUS)
def GetSentimentAnalysis(req: func.HttpRequest) -> func.HttpResponse:
    try:
        symbol = req.params.get('symbol')
        if not symbol:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            ))

        stock = yf.Ticker(symbol)
        info = stock.info
        company_name = info.get('longName', '')

        # Calculate dates for the last 2 weeks
        end_date = datetime.now()
        start_date = end_date - timedelta(days=14)

        # Get historical data for technical analysis
        history = stock.history(period="1y")  # Changed to 1y to ensure enough data for 200-day MA
        if not history.empty and len(history) >= 200:  # Ensure enough data for MA calculations
            current_price = history['Close'][-1]
            ma50 = history['Close'].rolling(window=50).mean()[-1]
            ma200 = history['Close'].rolling(window=200).mean()[-1]  # Calculate 200-day MA
            
            # Calculate RSI
            delta = history['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs.iloc[-1]))
        else:
            current_price = info.get('currentPrice', 'N/A')
            ma50 = 'N/A'
            ma200 = 'N/A'  # Add ma200
            rsi = 'N/A'

        # Format numbers for better display
        def format_large_number(num):
            if not num or num == 'N/A':
                return 'N/A'
            billion = 1_000_000_000
            million = 1_000_000
            if num >= billion:
                return f"${round(num/billion, 2)}B"
            elif num >= million:
                return f"${round(num/million, 2)}M"
            return f"${num:,}"

        # Gather enhanced market metrics
        market_metrics = {
            "Technical": {
                "Current Price": f"${round(current_price, 2) if current_price != 'N/A' else info.get('currentPrice', 'N/A')}",
                "50-Day MA": f"${round(ma50, 2)}" if ma50 != 'N/A' else 'N/A',
                "200-Day MA": f"${round(ma200, 2)}" if ma200 != 'N/A' else 'N/A',  # Add 200-day MA to metrics
                "RSI": f"{round(rsi, 1)}" if rsi != 'N/A' else 'N/A',
                "52-Week High": f"${round(info.get('fiftyTwoWeekHigh', 0), 2)}" if info.get('fiftyTwoWeekHigh') else 'N/A',
                "52-Week Low": f"${round(info.get('fiftyTwoWeekLow', 0), 2)}" if info.get('fiftyTwoWeekLow') else 'N/A',
                "Beta": round(info.get('beta', 0), 2) if info.get('beta') else 'N/A'
            },
            "Valuation": {
                "Market Cap": format_large_number(info.get('marketCap')),
                "P/E Ratio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else 'N/A',
                "Forward P/E": round(info.get('forwardPE', 0), 2) if info.get('forwardPE') else 'N/A',
                "PEG Ratio": round(info.get('pegRatio', 0), 2) if info.get('pegRatio') else 'N/A',
                "Price/Book": round(info.get('priceToBook', 0), 2) if info.get('priceToBook') else 'N/A'
            },
            "Growth & Performance": {
                "Revenue Growth": f"{round(info.get('revenueGrowth', 0) * 100, 1)}%" if info.get('revenueGrowth') else 'N/A',
                "Profit Margins": f"{round(info.get('profitMargins', 0) * 100, 1)}%" if info.get('profitMargins') else 'N/A',
                "Return on Equity": f"{round(info.get('returnOnEquity', 0) * 100, 1)}%" if info.get('returnOnEquity') else 'N/A'
            },
            "Market Sentiment": {
                "Analyst Rating": info.get('recommendationKey', 'N/A').upper() if info.get('recommendationKey') else 'N/A',
                "Short % of Float": f"{round(info.get('shortPercentOfFloat', 0) * 100, 1)}%" if info.get('shortPercentOfFloat') and info.get('shortPercentOfFloat') > 0 else 'N/A'
            }
        }

        # Clean up metrics - remove any sections where all values are 'N/A'
        market_metrics = {
            section: metrics for section, metrics in market_metrics.items()
            if any(value != 'N/A' for value in metrics.values())
        }

        newsapi = get_newsapi()
        url = f"{newsapi['base_url']}/everything"
        params = {
            'q': f'({symbol} OR "{company_name}") AND (stock OR market OR trading OR earnings OR investment)',
            'language': 'en',
            'sortBy': 'relevancy',
            'pageSize': 10,
            'from': start_date.strftime('%Y-%m-%d'),
            'to': end_date.strftime('%Y-%m-%d'),
            'searchIn': 'title,description',
            'apiKey': newsapi['api_key']
        }
        
        response = requests.get(url, params=params)
        news = response.json()

        if response.status_code != 200:
            return add_cors_headers(func.HttpResponse(
                json.dumps({
                    "symbol": symbol,
                    "error": f"NewsAPI error: {news.get('message', 'Unknown error')}",
                    "status": response.status_code
                }),
                status_code=response.status_code,
                mimetype="application/json"
            ))

        articles = []
        news_context = f"Company: {company_name} ({symbol})\n\n"
        
        # Process and sort articles by date
        processed_articles = []
        for article in news['articles']:
            article_date = datetime.strptime(article['publishedAt'], "%Y-%m-%dT%H:%M:%SZ")
            processed_articles.append((article_date, article))
        
        # Sort by date, newest first
        processed_articles.sort(key=lambda x: x[0], reverse=True)
        
        for _, article in processed_articles:
            articles.append({
                'title': article['title'],
                'description': article.get('description', ''),
                'url': article['url'],
                'publishedAt': article['publishedAt'],
                'source': article['source']['name']
            })
            news_context += f"\nSource: {article['source']['name']}\nDate: {article['publishedAt']}\nTitle: {article['title']}\nDescription: {article.get('description', '')}\n"

        # Format market metrics for AI context
        metrics_context = "\nMarket Metrics:\n"
        for category, metrics in market_metrics.items():
            metrics_context += f"\n{category}:\n"
            for metric, value in metrics.items():
                metrics_context += f"- {metric}: {value}\n"
        
        context = f"""Analyze the market sentiment for {company_name} ({symbol}) based on:

{metrics_context}

Recent News Articles (Last 2 Weeks):
{news_context}

Please provide a comprehensive analysis considering:
1. Technical Analysis
   - Trend direction using Moving Averages
   - Momentum indicators (RSI)
   - Price position relative to 52-week range

2. Valuation Analysis
   - Current valuation metrics vs. industry standards
   - Growth-adjusted metrics (PEG ratio)
   - Forward-looking indicators

3. Market Sentiment
   - Institutional positioning
   - Short interest implications
   - Analyst recommendations
   - News sentiment and key themes

4. Risk Assessment
   - Technical risk levels
   - Valuation risks
   - Market sentiment risks"""

        client = get_openai()
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """You are an expert market sentiment analyst with deep knowledge of technical analysis, fundamental valuation, and market psychology. Analyze the provided data to generate a detailed sentiment analysis using the following format:

## 📊 Market Sentiment Analysis: [Symbol]
=================================

### 1. 📈 Overall Market Sentiment
----------------------
**Sentiment Rating:** [Strongly Bullish / Bullish / Neutral / Bearish / Strongly Bearish]
[2-3 sentences explaining the overall sentiment, combining technical, fundamental, and news factors]

### 2. 📉 Technical Analysis
----------------------
**Trend Analysis:**
- Current Trend:
- Moving Average Analysis:
- Momentum (RSI):
- Key Technical Levels:

**Technical Outlook:** [Bullish/Neutral/Bearish]

### 3. 📊 Valuation Assessment
----------------------
**Current Valuation:**
- P/E Analysis:
- Growth Metrics:
- Industry Comparison:

**Valuation Outlook:** [Overvalued/Fair/Undervalued]

### 4. 🎯 Market Positioning
----------------------
**Institutional Sentiment:**
- Ownership Trends:
- Short Interest:
- Analyst Consensus:

### 5. 📰 News Sentiment
----------------------
**Key Themes:**
- [List 2-3 major themes from recent news]

**News Impact:** [Positive/Neutral/Negative]

### 6. 🔑 Key Takeaways
----------------------
- Technical Perspective:
- Valuation Perspective:
- Sentiment Perspective:

### 7. ⚠️ Risk Factors
----------------------
[List 2-3 key risks to watch]

### 8. 📝 Conclusion
----------------------
[2-3 sentences summarizing the overall analysis and providing a clear directional view based on all factors analyzed above. Include specific price levels or ranges to watch if applicable.]"""},
                {"role": "user", "content": context}
            ],
            temperature=0.7,
            max_tokens=2500
        )
        
        sentiment_analysis = response.choices[0].message.content

        return add_cors_headers(func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "company_name": company_name,
                "market_metrics": market_metrics,
                "articles": articles,
                "sentiment_analysis": sentiment_analysis,
                "analysis_timestamp": datetime.now().isoformat()
            }),
            mimetype="application/json"
        ))
    except Exception as e:
        logger.error(f"Error in GetSentimentAnalysis: {str(e)}")
        return add_cors_headers(func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "error": str(e),
                "status": 500
            }),
            status_code=500,
            mimetype="application/json"
        ))

@app.route(route="GetInvestmentRecommendation", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST", "OPTIONS"])
def GetInvestmentRecommendation(req: func.HttpRequest) -> func.HttpResponse:
    # Handle OPTIONS request
    if req.method == "OPTIONS":
        resp = func.HttpResponse(status_code=204)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        resp.headers['Access-Control-Max-Age'] = '86400'
        return resp

    try:
        # Get request body
        try:
            req_body = req.get_body().decode()
            body = json.loads(req_body) if req_body else {}
            
            if not body:
                return add_cors_headers(func.HttpResponse(
                    json.dumps({"error": "Request body is required"}),
                    status_code=400,
                    mimetype="application/json"
                ))
        except ValueError:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Invalid JSON in request body"}),
                status_code=400,
                mimetype="application/json"
            ))

        # Extract parameters from request body
        symbol = body.get('symbol')
        risk_level = body.get('risk_level', 'moderate')
        investment_horizon = body.get('investment_horizon', 'medium-term')
        sentiment_analysis = body.get('sentiment_analysis')
        market_metrics = body.get('market_metrics', {})
        
        if not symbol:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Symbol parameter is required"}),
                status_code=400,
                mimetype="application/json"
            ))

        if not sentiment_analysis:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Sentiment analysis data is required"}),
                status_code=400,
                mimetype="application/json"
            ))

        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Create a comprehensive context incorporating sentiment analysis
        context = f"""Please provide an investment recommendation for {symbol} stock based on the following analysis:

1. Current Stock Information:
- Trading Price: ${info.get('currentPrice', 'N/A')}
- Risk Level Preference: {risk_level}
- Investment Horizon: {investment_horizon}

2. Sentiment Analysis Summary:
{sentiment_analysis}

3. Market Metrics:
{json.dumps(market_metrics, indent=2)}

Based on the above comprehensive analysis, provide a detailed investment recommendation that:
1. Directly references and incorporates insights from the sentiment analysis
2. Aligns the recommendation with the specified risk level ({risk_level}) and investment horizon ({investment_horizon})
3. Uses specific metrics and trends identified in the sentiment analysis
4. Provides clear, actionable steps with specific price levels or ranges
5. Highlights key risks identified in the sentiment analysis
6. Suggests specific metrics to monitor based on the sentiment findings"""

        client = get_openai()
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": """You are a financial advisor providing recommendations based on comprehensive market analysis. Format your response as follows:

### Investment Analysis: [Company Name] ([Symbol]) 📊

### 1. 📈 Overall Strategy
[Clearly state the recommended strategy, incorporating sentiment analysis findings and aligning with risk level and investment horizon]

### 2. 💪 Strengths
- [Point 1 - Reference specific positive findings from sentiment analysis]
- [Point 2 - Include relevant metrics and trends]
- [Point 3 - Highlight key positive indicators]

### 3. ⚠️ Risks
- [Point 1 - Reference specific concerns from sentiment analysis]
- [Point 2 - Include relevant metrics and trends]
- [Point 3 - Address any identified warning signs]

### 4. 🎯 Investment Recommendation
[Provide specific, actionable recommendations including:
- Entry/exit price points
- Position sizing considerations
- Timing recommendations
- Risk management strategies]

### 5. 📋 Key Metrics to Monitor
- [Metric 1 - From sentiment analysis]
- [Metric 2 - Technical indicator]
- [Metric 3 - Risk indicator]

### 6. 🔄 Review Triggers
[List specific events or metric changes that should trigger a review of this recommendation]"""},
                {"role": "user", "content": context}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        recommendation = response.choices[0].message.content

        return add_cors_headers(func.HttpResponse(
            json.dumps({
                "symbol": symbol,
                "recommendation": recommendation,
                "current_price": info.get('currentPrice'),
                "analysis_timestamp": datetime.now().isoformat()
            }),
            mimetype="application/json"
        ))
    except Exception as e:
        logger.error(f"Error in GetInvestmentRecommendation: {str(e)}")
        return add_cors_headers(func.HttpResponse(
            json.dumps({"symbol": symbol if 'symbol' in locals() else None, "error": str(e)}),
            status_code=500,
            mimetype="application/json"
        ))

@app.route(route="SearchStocks", auth_level=func.AuthLevel.ANONYMOUS)
def SearchStocks(req: func.HttpRequest) -> func.HttpResponse:
    try:
        query = req.params.get('query')
        if not query:
            return add_cors_headers(func.HttpResponse(
                json.dumps({"error": "Query parameter is required"}),
                status_code=400,
                mimetype="application/json"
            ))
        
        # Try to get stock info directly
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            
            if info and info.get('longName'):  # Valid stock found
                result = {
                    "symbol": query.upper(),
                    "info": {
                        "name": info.get("longName", ""),
                        "sector": info.get("sector", ""),
                        "industry": info.get("industry", ""),
                        "currency": info.get("currency", "USD"),
                        "current_price": round(info.get("currentPrice", 0), 2)
                    }
                }
                return add_cors_headers(func.HttpResponse(
                    json.dumps({"results": [result]}),
                    mimetype="application/json"
                ))
            
        except Exception as e:
            logger.warning(f"Search failed for query {query}: {str(e)}")
            
        # If we get here, no valid stock was found
        return add_cors_headers(func.HttpResponse(
            json.dumps({"results": []}),
            mimetype="application/json"
        ))
            
    except Exception as e:
        logger.error(f"Error in SearchStocks: {str(e)}")
        return add_cors_headers(func.HttpResponse(
            json.dumps({"error": "Failed to search stocks. Please try again."}),
            status_code=500,
            mimetype="application/json"
        ))

# Add OPTIONS handler for CORS preflight requests
@app.route(route="{*route}", auth_level=func.AuthLevel.ANONYMOUS, methods=["OPTIONS"])
def options(req: func.HttpRequest) -> func.HttpResponse:
    resp = func.HttpResponse(status_code=204)  # Changed to 204 No Content
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
    resp.headers['Access-Control-Max-Age'] = '86400'  # 24 hours
    return resp