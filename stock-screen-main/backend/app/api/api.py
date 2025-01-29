from fastapi import APIRouter
from app.api.endpoints import stocks, ai

api_router = APIRouter()

api_router.include_router(stocks.router, prefix="/stocks", tags=["stocks"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"]) 