# 08 - Runbook Operativo

Ultima actualizacion: 2026-02-27

## Requisitos
- Node instalado
- MySQL activo
- MongoDB activo

## Arranque local
1. Instalar dependencias:
   - `npm ci`
2. Migrar DB:
   - `npx sequelize-cli db:migrate`
3. Seed:
   - `npx sequelize-cli db:seed:all`
4. Levantar API:
   - `npm start`

## Comandos utiles
- Unit tests: `npm run test:unit`
- E2E Newman: `npm test`
- Swagger: `http://localhost:3000/api-docs`

## Troubleshooting rapido
- Error de columna faltante:
  - Revisar migraciones aplicadas.
- 401 en endpoints protegidos:
  - Revisar token Bearer.
- Fallo de upload en CI:
  - Revisar ruta relativa del archivo en coleccion.

## Variables de entorno esperadas
- `PORT`
- `JWT_SECRET`
- `DB_HOST`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `MONGO_URI`

