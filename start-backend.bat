@echo off
echo ============================================
echo   Pixel Vault - Iniciando Spring Boot
echo ============================================

set MAVEN=%USERPROFILE%\maven\apache-maven-3.9.6\bin\mvn.cmd
set BACKEND=%~dp0backend

echo Subindo API em http://localhost:8080 ...
echo (Primeira vez pode demorar ~2 minutos para baixar dependencias)
echo.

cd /d "%BACKEND%"
"%MAVEN%" spring-boot:run
pause
