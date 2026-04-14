@echo off
echo Starting Tiki Data Application...
echo.
java -Xmx3g -jar "../GUI/target/football-website-1.0.0.jar" --server.port=8082 --football.data.path="C:/Users/saksh/OneDrive/Desktop/FDBMS/TikiDataProject/data"
pause
