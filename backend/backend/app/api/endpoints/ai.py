from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.ai_service import AIService
from pydantic import BaseModel

router = APIRouter()

class RecommendationRequest(BaseModel):
    stocks: List[str]
    risk_level: str
    investment_horizon: str

@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest) -> Dict[str, Any]:
    """
    Get AI-powered investment recommendations
    """
    try:
        ai_service = AIService()
        return await ai_service.get_recommendations(
            request.stocks,
            request.risk_level,
            request.investment_horizon
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sentiment/{symbol}")
async def get_sentiment(symbol: str) -> Dict[str, Any]:
    """
    Get AI-powered sentiment analysis for a stock
    """
    try:
        ai_service = AIService()
        return await ai_service.get_sentiment(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 