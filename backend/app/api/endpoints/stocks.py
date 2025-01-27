from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.stock_service import StockService

router = APIRouter()
stock_service = StockService()

@router.get("/{symbol}")
async def get_stock_info(symbol: str) -> Dict[str, Any]:
    """
    Get information about a specific stock
    """
    try:
        # Validate symbol
        if not symbol or len(symbol.strip()) == 0:
            raise HTTPException(status_code=400, detail="Invalid stock symbol")

        # Get stock info
        info = stock_service.get_stock_info(symbol.strip().upper())
        if not info:
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
        return info
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}/historical")
async def get_historical_data(symbol: str, period: str = "1y") -> List[Dict[str, Any]]:
    """
    Get historical price data for a stock
    """
    try:
        # Validate symbol
        if not symbol or len(symbol.strip()) == 0:
            raise HTTPException(status_code=400, detail="Invalid stock symbol")

        # Validate period
        valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
        if period not in valid_periods:
            raise HTTPException(status_code=400, detail=f"Invalid period. Valid periods are: {', '.join(valid_periods)}")

        # Get historical data
        data = stock_service.get_historical_data(symbol.strip().upper(), period)
        if not data:
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/{query}")
async def search_stocks(query: str) -> List[Dict[str, Any]]:
    """
    Search for stocks by symbol or name
    """
    try:
        # Validate query
        if not query or len(query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Invalid search query")

        # Search stocks
        results = stock_service.search_stocks(query)
        return results
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e)) 