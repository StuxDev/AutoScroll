@echo off
setlocal enabledelayedexpansion
REM AutoScroll - Local dev server (Windows)
REM Usage: dev-server.bat [--no-dev-mode]
REM   --no-dev-mode   don't force the frontend's proxy backend to the local
REM                   Firebase emulator for this run - it'll hit production
REM                   Cloud Functions instead, same as a plain "pnpm dev"
REM
REM Starts the Vite dev server (frontend\, http://localhost:3000) and the
REM Firebase Functions emulator (backend\) together, each in its own window.

set "DIR=%~dp0"
set "NO_DEV_MODE=0"

:parse_args
if "%~1"=="" goto args_done
if /I "%~1"=="--no-dev-mode" set "NO_DEV_MODE=1"
shift
goto parse_args
:args_done

set "PROJECT_ID=autoscroll-dce73"
for /f "tokens=2 delims=:" %%A in ('findstr /C:"\"production\"" "%DIR%.firebaserc"') do (
    set "RAW=%%A"
)
if defined RAW (
    set "RAW=!RAW:"=!"
    set "RAW=!RAW:,=!"
    set "RAW=!RAW: =!"
    set "PROJECT_ID=!RAW!"
)

if not exist "%DIR%backend\.env" (
    echo No backend\.env found - copying backend\.env.example to get you started.
    copy "%DIR%backend\.env.example" "%DIR%backend\.env" >nul
)

if not exist "%DIR%frontend\node_modules" (
    echo Installing frontend dependencies...
    pushd "%DIR%frontend"
    call pnpm install
    popd
)

if not exist "%DIR%backend\node_modules" (
    echo Installing backend dependencies...
    pushd "%DIR%backend"
    call npm install
    popd
)

echo Starting Firebase Functions emulator (backend\)...
start "AutoScroll backend" cmd /k "cd /d "%DIR%backend" && npm run serve"

set "PROXY_ENV_LINE=set VITE_PROXY_BASE_URL="
if "%NO_DEV_MODE%"=="1" (
    echo NOT overriding the proxy backend - frontend will hit production Cloud Functions.
) else (
    set "VITE_PROXY_BASE_URL=http://127.0.0.1:5001/!PROJECT_ID!/europe-west4"
    set "PROXY_ENV_LINE=set VITE_PROXY_BASE_URL=!VITE_PROXY_BASE_URL!"
    echo Frontend proxy backend forced to the local emulator (!VITE_PROXY_BASE_URL!) - pass --no-dev-mode to use production instead.
)

echo Starting Vite dev server (frontend\, http://localhost:3000)...
start "AutoScroll frontend" cmd /k "cd /d "%DIR%frontend" && !PROXY_ENV_LINE! && call pnpm dev"

echo Both processes started in separate windows - close them to stop.
endlocal
