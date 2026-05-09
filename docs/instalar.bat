@echo off
chcp 65001 >nul
title El Buen Sabor - Instalación

echo.
echo =====================================================
echo   EL BUEN SABOR - Instalación del Backend
echo =====================================================
echo.

REM ── Verificar Node.js ────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado.
    echo         Descargalo desde: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js detectado: 
node --version

REM ── Verificar que existe package.json ────────────────
if not exist "package.json" (
    echo.
    echo [ERROR] No se encontró package.json.
    echo         Asegurate de ejecutar este script desde la raíz del proyecto.
    pause
    exit /b 1
)

REM ── Crear .env si no existe ───────────────────────────
if not exist ".env" (
    echo.
    echo =====================================================
    echo   CONFIGURACIÓN DE BASE DE DATOS
    echo =====================================================
    echo.
    echo No se encontró el archivo .env. Vamos a crearlo.
    echo.

    set /p DB_USER="Usuario MySQL (default: root): "
    if "%DB_USER%"=="" set DB_USER=root

    set /p DB_PASS="Contraseña MySQL: "

    set /p DB_NAME="Nombre de la base de datos (default: el_buen_sabor_db): "
    if "%DB_NAME%"=="" set DB_NAME=el_buen_sabor_db

    set /p DB_HOST="Host MySQL (default: 127.0.0.1): "
    if "%DB_HOST%"=="" set DB_HOST=127.0.0.1

    (
        echo PORT=3000
        echo JWT_SECRET=secreto_local_desarrollo
        echo.
        echo DB_HOST=%DB_HOST%
        echo DB_USERNAME=%DB_USER%
        echo DB_PASSWORD=%DB_PASS%
        echo DB_DATABASE=%DB_NAME%
        echo DB_DIALECT=mysql
    ) > .env

    echo.
    echo [OK] Archivo .env creado.
) else (
    echo [OK] Archivo .env ya existe, se usa el existente.
)

REM ── Instalar dependencias ────────────────────────────
echo.
echo [1/4] Instalando dependencias npm...
call npm install
if errorlevel 1 (
    echo [ERROR] Falló npm install.
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas.

REM ── Crear base de datos ──────────────────────────────
echo.
echo [2/4] Creando base de datos...
call npx sequelize-cli db:create
if errorlevel 1 (
    echo.
    echo [AVISO] No se pudo crear la base de datos.
    echo         Puede que ya exista (eso está bien) o que la contraseña sea incorrecta.
    echo         Si es un error de contraseña, editá el archivo .env y volvé a ejecutar.
    echo.
    pause
)

REM ── Correr migraciones ───────────────────────────────
echo.
echo [3/4] Corriendo migraciones...
call npx sequelize-cli db:migrate
if errorlevel 1 (
    echo [ERROR] Falló db:migrate. Revisá la conexión a MySQL y el archivo .env.
    pause
    exit /b 1
)
echo [OK] Migraciones aplicadas.

REM ── Cargar seeders ───────────────────────────────────
echo.
echo [4/4] Cargando datos iniciales...
call npx sequelize-cli db:seed:all
if errorlevel 1 (
    echo [AVISO] Algunos seeders fallaron (puede que los datos ya existan).
) else (
    echo [OK] Datos iniciales cargados.
)

REM ── Fin ──────────────────────────────────────────────
echo.
echo =====================================================
echo   INSTALACIÓN COMPLETADA
echo =====================================================
echo.
echo   Datos de acceso:
echo     - Usuario Admin: legajo 1001 / password 1234
echo.
echo   Para levantar el servidor:
echo     npm run dev
echo.
echo   URLs disponibles:
echo     - API:     http://localhost:3000
echo     - Swagger: http://localhost:3000/api-docs
echo.
echo =====================================================
echo.
set /p ARRANCAR="¿Querés levantar el servidor ahora? (s/n): "
if /i "%ARRANCAR%"=="s" (
    echo.
    echo Iniciando servidor...
    npm run dev
)

pause
