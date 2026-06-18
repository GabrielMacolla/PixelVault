@echo off
echo ============================================
echo   Pixel Vault - Configuracao do MySQL
echo ============================================

set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set DATA_DIR=%USERPROFILE%\mysql-data
set SCHEMA_SQL=%~dp0Pixel Vault\backend-fase2\schema.sql
set SEED_SQL=%~dp0Pixel Vault\backend-fase2\seed.sql

echo.
echo [1/4] Registrando servico MySQL...
"%MYSQL_BIN%\mysqld.exe" --install MySQL84 --datadir="%DATA_DIR%" 2>nul
if %errorlevel% neq 0 echo Servico ja registrado ou erro - continuando...

echo.
echo [2/4] Iniciando servico MySQL...
net start MySQL84
if %errorlevel% neq 0 (
    echo Tentando iniciar de outra forma...
    sc start MySQL84
)
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Configurando senha root...
"%MYSQL_BIN%\mysql.exe" -u root --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'senhaBD';" 2>nul
"%MYSQL_BIN%\mysql.exe" -u root -psenhaBD -e "SELECT 'Conexao OK';" 2>nul

echo.
echo [4/4] Criando banco e tabelas...
"%MYSQL_BIN%\mysql.exe" -u root -psenhaBD -e "CREATE DATABASE IF NOT EXISTS pixel_vault CHARACTER SET utf8mb4;"

if exist "%SCHEMA_SQL%" (
    "%MYSQL_BIN%\mysql.exe" -u root -psenhaBD pixel_vault < "%SCHEMA_SQL%"
    echo Schema criado.
) else (
    echo AVISO: schema.sql nao encontrado em: %SCHEMA_SQL%
)

if exist "%SEED_SQL%" (
    "%MYSQL_BIN%\mysql.exe" -u root -psenhaBD pixel_vault < "%SEED_SQL%"
    echo Dados inseridos.
) else (
    echo AVISO: seed.sql nao encontrado em: %SEED_SQL%
)

echo.
echo ============================================
echo   MySQL configurado com sucesso!
echo   Banco: pixel_vault
echo   Usuario: root  /  Senha: senhaBD
echo ============================================
pause
