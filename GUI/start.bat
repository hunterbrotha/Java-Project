@echo off
echo ========================================
echo   FootballHub - Starting Server
echo ========================================
echo.
echo Loading football data (this may take 2-3 minutes
echo for the large CSV files to be indexed...)
echo.
echo Once started, open your browser at:
echo   http://localhost:8080
echo.
java -Xmx2g -jar "target\football-website-1.0.0.jar"
pause
