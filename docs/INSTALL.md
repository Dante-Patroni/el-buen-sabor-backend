# Guía de Instalación - El Buen Sabor Backend

Guía paso a paso para levantar el proyecto en Windows.

---

## Requisitos previos

Antes de empezar, asegurate de tener instalado:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| Node.js | 18.x | https://nodejs.org |
| MySQL | 8.0 | https://dev.mysql.com/downloads/mysql/ |
| Git | cualquiera | https://git-scm.com |

> ⚠️ Durante la instalación de MySQL, anotá el **usuario** y **contraseña** que configurás. Los vas a necesitar en el paso 3.

---

## Opción A — Instalación automática (recomendada)

1. Cloná el repositorio
2. Abrí la carpeta del proyecto
3. Hacé doble clic en **`instalar.bat`**
4. Seguí las instrucciones en pantalla

El script instala dependencias, crea la base de datos, corre las migraciones y carga los datos iniciales.

---

## Opción B — Instalación manual

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd el-buen-sabor-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear el archivo `.env`

Creá un archivo llamado `.env` en la raíz del proyecto con este contenido:

```env
PORT=3000
JWT_SECRET=secreto_local_desarrollo

DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=tu_password_mysql
DB_DATABASE=el_buen_sabor_db
DB_DIALECT=mysql
```

> Reemplazá `tu_password_mysql` con la contraseña que pusiste al instalar MySQL.

### 4. Crear la base de datos

```bash
npx sequelize-cli db:create
```

### 5. Correr las migraciones

```bash
npx sequelize-cli db:migrate
```

### 6. Cargar los datos iniciales

```bash
npx sequelize-cli db:seed:all
```

### 7. Levantar el servidor

```bash
npm run dev
```

El servidor queda disponible en: `http://localhost:3000`

---

## Verificar que todo funciona

| URL | Qué muestra |
|-----|-------------|
| `http://localhost:3000/api-docs` | Documentación Swagger |
| `http://localhost:3000/api/platos` | Lista de platos |

---

## Datos cargados por el seeder

| Dato | Detalle |
|------|---------|
| Usuario Admin | legajo: `1001` / password: `1234` |
| Mesa | Mesa 4 (capacidad 4, estado LIBRE) |
| Rubros | Cocina, Bebidas y subcategorías |
| Platos | Hamburguesas, Pizzas, Empanadas, Bebidas |

---

## Solución de problemas frecuentes

**Error: `Access denied for user 'root'`**
→ La contraseña en el `.env` no coincide con la de MySQL. Verificá el campo `DB_PASSWORD`.

**Error: `ER_BAD_DB_ERROR: Unknown database`**
→ No se creó la base de datos. Corré `npx sequelize-cli db:create` antes de migrar.

**Error: `Cannot find module`**
→ Faltó correr `npm install`. Ejecutalo de nuevo.

**El puerto 3000 está en uso**
→ Cambiá `PORT=3000` por otro número en el `.env`, por ejemplo `PORT=3001`.

---

## Scripts disponibles

```bash
npm run dev          # Servidor en modo desarrollo (nodemon)
npm start            # Servidor en modo producción
npm run test:unit    # Tests unitarios (Jest)
npm test             # Tests E2E (Newman)
npm run test:coverage # Cobertura de tests
```
