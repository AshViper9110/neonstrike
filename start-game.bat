@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title NEON//STRIKE Launcher

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] Node.js が見つかりません。
  echo https://nodejs.org/ から LTS 版をインストールしてください。
  echo.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo.
  echo [ERROR] npm が見つかりません。Node.js を再インストールしてください。
  echo.
  pause
  exit /b 1
)

rem --- 既にゲームサーバーが動いている場合はブラウザだけ開く ---
curl.exe -s --max-time 2 "http://localhost:5173/" | findstr /C:"NEON//STRIKE" >nul
if not errorlevel 1 (
  echo 既にサーバーが起動しています。ブラウザを開きます...
  start "" "http://localhost:5173/"
  exit /b 0
)

rem --- 5173 が使用中なら、空いているポートを 5174 以降から探す ---
set "PORT=5173"
:find_port
netstat -ano -p TCP | findstr /R /C:":%PORT% .*LISTENING" >nul
if errorlevel 1 goto port_ready
set /a PORT+=1
if %PORT% GTR 5199 goto no_port
goto find_port

:no_port
echo.
echo [ERROR] 空いているポート（5173-5199）が見つかりませんでした。
echo 他の開発サーバーを停止してから、もう一度お試しください。
echo.
pause
exit /b 1

:port_ready
if not exist "node_modules\vite\bin\vite.js" (
  echo 初回セットアップ: 依存パッケージをインストールしています...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] インストールに失敗しました。ネットワーク接続を確認してください。
    pause
    exit /b 1
  )
)

echo NEON//STRIKE を起動しています... ^(http://localhost:%PORT%^)
echo 終了するには、このウィンドウで Ctrl+C を押してください。
echo.
call npm.cmd start -- --port %PORT%
if errorlevel 1 pause
endlocal
