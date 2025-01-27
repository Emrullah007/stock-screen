import yfinance as yf
from typing import Dict, List, Optional
import pandas as pd

class StockService:
    @staticmethod
    async def get_stock_info(symbol: str) -> Dict:
        """
        Get basic information about a stock
        """
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            return {
                "symbol": symbol,
                "name": info.get("longName", ""),
                "sector": info.get("sector", ""),
                "industry": info.get("industry", ""),
                "current_price": info.get("currentPrice", 0),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", 0),
                "dividend_yield": info.get("dividendYield", 0),
                "fifty_two_week_high": info.get("fiftyTwoWeekHigh", 0),
                "fifty_two_week_low": info.get("fiftyTwoWeekLow", 0)
            }
        except Exception as e:
            raise Exception(f"Error fetching stock info: {str(e)}")

    @staticmethod
    async def get_historical_data(symbol: str, period: str = "1y") -> List[Dict]:
        """
        Get historical price data for a stock
        """
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period=period)
            
            return [{
                "date": index.strftime("%Y-%m-%d"),
                "open": row["Open"],
                "high": row["High"],
                "low": row["Low"],
                "close": row["Close"],
                "volume": row["Volume"]
            } for index, row in hist.iterrows()]
        except Exception as e:
            raise Exception(f"Error fetching historical data: {str(e)}")

    @staticmethod
    async def search_stocks(query: str) -> List[Dict]:
        """
        Search for stocks based on a query string
        """
        # This is a simple implementation. You might want to use a more sophisticated
        # search service in production
        try:
            stock = yf.Ticker(query)
            info = stock.info
            return [{
                "symbol": query,
                "name": info.get("longName", ""),
                "type": info.get("quoteType", ""),
                "exchange": info.get("exchange", "")
            }]
        except:
            return [] 