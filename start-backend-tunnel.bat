@echo off
title PromptStock - Backend & HTTPS Tunnel
echo ======================================================================
echo           PROMPTSTOCK - INICIANDO BACKEND E TUNEL HTTPS
echo ======================================================================
echo.

:: 1. Iniciar Laravel Backend
echo [1/2] Iniciando servidor Laravel na porta 8000...
start "PromptStock Laravel API" cmd /k "cd /d "%~dp0backend" && C:\xampp\php\php.exe artisan serve --host=127.0.0.1 --port=8000"

:: Aguardar 3 segundos para o Laravel subir
timeout /t 3 /nobreak >nul

:: 2. Iniciar Cloudflare Tunnel
echo [2/2] Iniciando Tunel HTTPS publico com Cloudflare...
start "PromptStock HTTPS Tunnel" cmd /k ""C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8000"

echo.
echo ======================================================================
echo Servidor Laravel e Tunel HTTPS iniciados com sucesso!
echo Copie a URL https://....trycloudflare.com exibida na janela do tunel
echo e adicione /api/v1 na variavel NEXT_PUBLIC_API_URL da Vercel.
echo ======================================================================
pause
