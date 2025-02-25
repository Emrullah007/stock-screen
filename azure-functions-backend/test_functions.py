import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base URL for local testing
BASE_URL = "http://localhost:7071/api"  # Default Azure Functions local port

def test_get_stock_data():
    print("\n=== Testing GetStockData Function ===")
    symbols = ["AAPL", "MSFT", "GOOGL"]
    
    for symbol in symbols:
        print(f"\nTesting for {symbol}:")
        response = requests.get(f"{BASE_URL}/GetStockData", params={"symbol": symbol})
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))

def test_get_stock_history():
    print("\n=== Testing GetStockHistory Function ===")
    symbol = "AAPL"
    periods = ["1mo", "3mo", "6mo", "1y"]
    
    for period in periods:
        print(f"\nTesting for {symbol} with period {period}:")
        response = requests.get(
            f"{BASE_URL}/GetStockHistory",
            params={"symbol": symbol, "period": period}
        )
        print(f"Status Code: {response.status_code}")
        data = response.json()
        if "history" in data:
            print(f"Number of historical data points: {len(data['history'])}")
            print("First entry:", json.dumps(data['history'][0], indent=2))
            print("Last entry:", json.dumps(data['history'][-1], indent=2))
        else:
            print("Response:", json.dumps(data, indent=2))

def test_get_sentiment_analysis():
    print("\n=== Testing GetSentimentAnalysis Function ===")
    symbols = ["AAPL", "TSLA"]
    
    for symbol in symbols:
        print(f"\nTesting sentiment analysis for {symbol}:")
        response = requests.get(f"{BASE_URL}/GetSentimentAnalysis", params={"symbol": symbol})
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))

def test_get_investment_recommendation():
    print("\n=== Testing GetInvestmentRecommendation Function ===")
    test_cases = [
        {"symbol": "AAPL", "investment_amount": 10000, "risk_tolerance": "moderate"},
        {"symbol": "MSFT", "investment_amount": 5000, "risk_tolerance": "conservative"}
    ]
    
    for case in test_cases:
        print(f"\nTesting recommendation for {case['symbol']}:")
        response = requests.get(f"{BASE_URL}/GetInvestmentRecommendation", params=case)
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))

def main():
    print("Starting Azure Functions Tests...")
    print("Make sure the Azure Functions host is running locally on port 7071")
    
    try:
        # Test all functions
        test_get_stock_data()
        test_get_stock_history()
        test_get_sentiment_analysis()
        test_get_investment_recommendation()
        
        print("\nAll tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the Azure Functions host.")
        print("Please make sure the Azure Functions host is running locally (func start)")
    except Exception as e:
        print(f"\nError occurred during testing: {str(e)}")

if __name__ == "__main__":
    main() 