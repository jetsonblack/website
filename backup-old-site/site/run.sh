#!/bin/bash

echo "Starting Flask Portfolio Application..."
echo "================================"
echo ""

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    echo ""
fi

echo "Starting server on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""

python3 app.py
