from fastapi import APIRouter, HTTPException
from typing import List, Dict
from app.services.stock_service import StockService

router = APIRouter()

@router.get("/{symbol}")
async def get_stock_info(symbol: str) -> Dict:
    """
    Get detailed information about a specific stock
    """
    try:
        return await StockService.get_stock_info(symbol)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{symbol}/historical")
async def get_historical_data(symbol: str, period: str = "1y") -> List[Dict]:
    """
    Get historical price data for a specific stock
    """
    try:
        return await StockService.get_historical_data(symbol, period)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/search/{query}")
async def search_stocks(query: str) -> List[Dict]:
    """
    Search for stocks based on a query string
    """
    try:
        return await StockService.search_stocks(query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 