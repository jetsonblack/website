@echo off
echo Starting Flask Portfolio Application...
echo ================================
echo.

echo Installing dependencies...
pip install -r requirements.txt
echo.

echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py
pause
