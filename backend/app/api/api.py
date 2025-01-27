from fastapi import APIRouter
from app.api.endpoints import stocks

api_router = APIRouter()

api_router.include_router(stocks.router, prefix="/stocks", tags=["stocks"]) 