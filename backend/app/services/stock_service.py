import yfinance as yf
from typing import Dict, List, Optional, Any
import pandas as pd
from datetime import datetime

class StockService:
    @staticmethod
    def get_stock_info(symbol: str) -> Dict[str, Any]:
        """
        Get basic information about a stock
        """
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            
            # Get the latest price data
            current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose', 0)
            
            # Get 52-week high and low
            fifty_two_week_high = info.get('fiftyTwoWeekHigh', 0)
            fifty_two_week_low = info.get('fiftyTwoWeekLow', 0)

            # Calculate dividend yield properly
            dividend_yield = info.get('dividendYield', 0)
            if dividend_yield:
                dividend_yield *= 100  # Convert to percentage

            return {
                "name": info.get('longName', ''),
                "symbol": symbol.upper(),
                "current_price": current_price,
                "market_cap": info.get('marketCap', 0),
                "pe_ratio": info.get('forwardPE', 0),
                "dividend_yield": dividend_yield,
                "sector": info.get('sector', ''),
                "industry": info.get('industry', ''),
                "fifty_two_week_high": fifty_two_week_high,
                "fifty_two_week_low": fifty_two_week_low,
                "currency": info.get('currency', 'USD')
            }
        except Exception as e:
            print(f"Error fetching stock info for {symbol}: {str(e)}")
            raise Exception(f"Error fetching stock info: {str(e)}")

    @staticmethod
    def get_historical_data(symbol: str, period: str = "1y") -> List[Dict[str, Any]]:
        """
        Get historical price data for a stock
        """
        try:
            stock = yf.Ticker(symbol)
            df = stock.history(period=period)
            
            if df.empty:
                return []
            
            # Convert DataFrame to list of dictionaries
            data = []
            for index, row in df.iterrows():
                data.append({
                    "date": index.strftime('%Y-%m-%d'),
                    "open": row['Open'],
                    "high": row['High'],
                    "low": row['Low'],
                    "close": row['Close'],
                    "volume": row['Volume']
                })
            
            return data
        except Exception as e:
            raise Exception(f"Error fetching historical data: {str(e)}")

    @staticmethod
    def search_stocks(query: str) -> List[Dict[str, Any]]:
        """
        Search for stocks by symbol or name
        """
        try:
            # Basic validation
            if not query or len(query.strip()) == 0:
                return []

            # Clean up the query
            query = query.strip().upper()

            try:
                # Try to get stock info
                stock = yf.Ticker(query)
                info = stock.info

                # Verify if we got valid stock info
                if info and (info.get('regularMarketPrice') is not None or info.get('longName')):
                    return [{
                        "symbol": query,
                        "name": info.get('longName', ''),
                        "exchange": info.get('exchange', ''),
                        "price": info.get('regularMarketPrice', 0),
                        "currency": info.get('currency', 'USD')
                    }]
            except Exception as e:
                print(f"Error searching for stock {query}: {str(e)}")
                pass

            return []
        except Exception as e:
            print(f"Error in search_stocks: {str(e)}")
            return [] 