@echo off
rem One-click launcher for the training site.
rem A browser cannot start a server by itself (security sandbox), so this small
rem script starts a local web server and then opens the site for you.
cd /d "%~dp0"
echo.
echo   Starting the training site...
echo   Keep this window open while you use it. Close it to stop.
echo.
start "" http://localhost:8080
py -m http.server 8080 2>nul || python -m http.server 8080
