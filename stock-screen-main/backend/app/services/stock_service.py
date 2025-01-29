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

            # Format numeric values to 2 decimal places
            return {
                "name": info.get('longName', ''),
                "symbol": symbol.upper(),
                "current_price": round(float(current_price), 2),
                "market_cap": info.get('marketCap', 0),
                "pe_ratio": round(float(info.get('forwardPE', 0)), 2),
                "dividend_yield": round(float(dividend_yield), 2),
                "sector": info.get('sector', ''),
                "industry": info.get('industry', ''),
                "fifty_two_week_high": round(float(fifty_two_week_high), 2),
                "fifty_two_week_low": round(float(fifty_two_week_low), 2),
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
        Search for stocks by symbol
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
                
                # For valid stocks, at least one of these price fields should exist
                price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
                
                # Check if we got valid stock info
                if not info or not price or not info.get('longName'):
                    return []

                # Return stock info if valid
                return [{
                    "name": info.get('longName', ''),
                    "symbol": query,
                    "current_price": round(float(price), 2),
                    "sector": info.get('sector', 'N/A'),
                    "currency": info.get('currency', 'USD')
                }]
            except Exception as e:
                print(f"Error getting stock info: {str(e)}")
                return []

        except Exception as e:
            print(f"Error in search_stocks: {str(e)}")
            return [] 