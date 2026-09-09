@echo off
title PromptStock - Ngrok Launcher
echo ======================================================================
echo           PROMPTSTOCK - NGROK LAUNCHER
echo ======================================================================
echo.
echo Para usar o ngrok, caso ainda nao tenha configurado o token:
echo 1. Crie uma conta gratuita em: https://dashboard.ngrok.com/signup
echo 2. Pegue o seu token em: https://dashboard.ngrok.com/get-started/your-authtoken
echo 3. Execute no terminal: ngrok config add-authtoken SEU_TOKEN
echo.
echo Iniciando ngrok na porta 8000...
"C:\Users\Adriano Tchiloya\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" http 8000
pause
