from typing import List, Dict, Any
from openai import AzureOpenAI
import os
import aiohttp
from datetime import datetime
from app.core.config import settings

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=settings.AZURE_API_KEY,
    api_version="2024-02-15-preview",
    azure_endpoint=settings.AZURE_ENDPOINT
)

class AIService:
    @staticmethod
    async def get_recommendations(stocks: List[str], risk_level: str, investment_horizon: str) -> Dict[str, Any]:
        """
        Get AI-powered investment recommendations based on the provided stocks and criteria
        """
        try:
            # Create a prompt for the AI
            prompt = f"""Analyze the following stocks: {', '.join(stocks)}
            Risk Level: {risk_level}
            Investment Horizon: {investment_horizon}
            
            Please provide a comprehensive investment analysis following this structure:

            1. 📈 Overall Strategy
            ---------------------
            [Provide a concise overview of the recommended investment strategy]

            2. 🎯 Specific Recommendations
            ---------------------------
            [List specific actionable recommendations]

            3. ⚖️ Risk Analysis
            ----------------
            - Key Risk Factors:
            - Mitigation Strategies:

            4. 📊 Potential Returns
            -------------------
            - Short-term Outlook:
            - Long-term Prospects:
            - Expected Return Range:

            5. 📋 Action Items
            --------------
            [List 3-4 concrete steps for implementing the strategy]

            Please ensure the response is well-structured and easy to read.
            """
            
            try:
                # Try to get AI response
                response = client.chat.completions.create(
                    model=settings.AZURE_MODEL_NAME,
                    messages=[
                        {"role": "system", "content": "You are a professional investment advisor. Provide clear, well-structured investment recommendations using markdown formatting for better readability."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                )
                
                return {
                    "analysis": response.choices[0].message.content,
                    "stocks": stocks,
                    "risk_level": risk_level,
                    "investment_horizon": investment_horizon
                }
            except Exception as azure_error:
                print(f"Azure OpenAI API error: {str(azure_error)}")
                return {
                    "analysis": "AI recommendations are temporarily unavailable. Please try again later or consult other sources for investment advice.",
                    "stocks": stocks,
                    "risk_level": risk_level,
                    "investment_horizon": investment_horizon,
                    "status": "error",
                    "error_type": "api_unavailable"
                }
            
        except Exception as e:
            raise Exception(f"Error getting AI recommendations: {str(e)}")

    @staticmethod
    async def get_sentiment(symbol: str) -> Dict[str, Any]:
        """
        Get AI-powered sentiment analysis for a stock
        """
        try:
            # Create a prompt for sentiment analysis
            prompt = f"""Analyze the current market sentiment for {symbol} using the following structure:

            📊 Market Sentiment Analysis: {symbol}
            =====================================

            1. 🎯 Overall Sentiment
            --------------------
            [Provide a clear sentiment indication: Bullish/Bearish/Neutral with brief explanation]

            2. 📈 Key Market Indicators
            -----------------------
            A. Recent Price Movements:
               - Performance metrics
               - Technical levels
               - Volume analysis

            B. Market Trends:
               - Sector performance
               - Comparative analysis
               - Market momentum

            3. 📰 News & Events Impact
            ----------------------
            - Recent significant news
            - Upcoming catalysts
            - Market sentiment drivers

            4. 🔄 Short-term Outlook
            --------------------
            - Price targets
            - Support/Resistance levels
            - Trading recommendations

            5. ⚠️ Risk Factors
            --------------
            - Key challenges
            - Market risks
            - Technical warnings

            Please ensure the analysis is data-driven and clearly formatted.
            """
            
            try:
                # Try to get AI response
                response = client.chat.completions.create(
                    model=settings.AZURE_MODEL_NAME,
                    messages=[
                        {"role": "system", "content": "You are a market sentiment analyst. Provide clear, data-driven sentiment analysis using markdown formatting for better readability."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                )
                
                if not response.choices or not response.choices[0].message:
                    raise Exception("No response received from Azure OpenAI API")
                    
                return {
                    "symbol": symbol,
                    "analysis": response.choices[0].message.content,
                    "timestamp": datetime.now().isoformat()
                }
            except Exception as azure_error:
                print(f"Azure OpenAI API error in get_sentiment: {str(azure_error)}")
                return {
                    "symbol": symbol,
                    "analysis": "Sentiment analysis is temporarily unavailable. Please try again later or consult other sources for market sentiment.",
                    "timestamp": datetime.now().isoformat(),
                    "status": "error",
                    "error_type": "api_unavailable"
                }
            
        except Exception as e:
            print(f"Error in get_sentiment: {str(e)}")
            raise Exception(f"Error getting sentiment analysis: {str(e)}")

    @staticmethod
    async def analyze_news_sentiment(symbol: str) -> Dict[str, Any]:
        """
        Analyze sentiment from news articles about a stock
        """
        # NewsAPI endpoint
        news_api_url = "https://newsapi.org/v2/everything"
        params = {
            "q": f"{symbol} stock",
            "apiKey": settings.NEWS_API_KEY,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 5
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(news_api_url, params=params) as response:
                    news_data = await response.json()

            if news_data.get("status") != "ok":
                raise Exception("Failed to fetch news")

            return {
                "articles": news_data.get("articles", []),
                "status": "success"
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

ai_service = AIService() 