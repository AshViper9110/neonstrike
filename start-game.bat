@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title NEON//STRIKE Launcher

if not exist "index.html" (
  echo.
  echo [ERROR] index.html が見つかりません。
  echo この .bat ファイルをプロジェクトのフォルダに置いてください。
  echo.
  pause
  exit /b 1
)

echo NEON//STRIKE をブラウザで開いています...
echo Node.js / ローカルサーバーは不要です。
start "" "%~dp0index.html"
exit /b 0
