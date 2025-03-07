#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting local test environment for Azure Static Web Apps migration...${NC}"

# Check if required tools are installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v pip &> /dev/null; then
    echo -e "${RED}pip is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v func &> /dev/null; then
    echo -e "${RED}Azure Functions Core Tools is not installed. Please install it first.${NC}"
    echo -e "${YELLOW}You can install it with: npm install -g azure-functions-core-tools@4 --unsafe-perm true${NC}"
    exit 1
fi

# Start backend in a separate terminal
echo -e "${YELLOW}Starting Azure Functions backend...${NC}"
cd azure-functions-backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate || { echo -e "${RED}Failed to activate virtual environment${NC}"; exit 1; }

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
pip install -r requirements.txt || { echo -e "${RED}Failed to install backend dependencies${NC}"; exit 1; }

# Start Azure Functions in background
echo -e "${GREEN}Starting Azure Functions...${NC}"
func start &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 10

# Go back to root directory
cd ..

# Start frontend in a separate terminal
echo -e "${YELLOW}Starting frontend...${NC}"
cd frontend

# Install dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install || { echo -e "${RED}Failed to install frontend dependencies${NC}"; kill $BACKEND_PID; exit 1; }

# Start frontend
echo -e "${GREEN}Starting frontend development server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
sleep 10

echo -e "${GREEN}Local test environment is running!${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}Backend: http://localhost:7071/api${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; echo -e '${YELLOW}Shutting down...${NC}'; exit 0" INT
wait 