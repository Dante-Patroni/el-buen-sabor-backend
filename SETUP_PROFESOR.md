 # El Buen Sabor — Guía completa de instalación y prueba

**Stack:** Node.js · Express · Sequelize · MySQL · JWT · Socket.IO

---

## Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Clonar e instalar dependencias](#2-clonar-e-instalar-dependencias)
3. [Variables de entorno (.env)](#3-variables-de-entorno-env)
4. [Configuración CORS — Whitelist](#4-configuración-cors--whitelist)
5. [Crear la base de datos en MySQL](#5-crear-la-base-de-datos-en-mysql)
6. [Migraciones](#6-migraciones)
7. [Seeders — datos iniciales](#7-seeders--datos-iniciales)
8. [Levantar el servidor](#8-levantar-el-servidor)
9. [Configurar Postman](#9-configurar-postman)
10. [Ejecutar el flujo en Postman](#10-ejecutar-el-flujo-en-postman)
11. [Flujo con CURL](#11-flujo-con-curl)
12. [Tests automáticos](#12-tests-automáticos)
13. [Solución de problemas](#13-solución-de-problemas)
14. [Resetear la base de datos](#14-resetear-la-base-de-datos)

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |
| MySQL | 8.0 | `mysql --version` |
| Git | cualquiera | `git --version` |
| Postman | cualquiera | (app de escritorio) |

---

## 2. Clonar e instalar dependencias

```bash
git clone <URL-del-repositorio>
cd backend-el-buen-sabor
npm install
```

---

## 3. Variables de entorno (.env)

Crear el archivo `.env` en la **raíz del proyecto** (mismo nivel que `app.js`):

```env
# ── Servidor ──────────────────────────────
PORT=3000

# ── Seguridad JWT ─────────────────────────
JWT_SECRET=ClaveSecretaProfesor2024

# ── Base de datos MySQL ───────────────────
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=el_buen_sabor_db
DB_HOST=127.0.0.1
```

> **`DB_PASSWORD` se deja vacío** porque MySQL está configurado con `root` sin contraseña.
> `JWT_SECRET` puede ser cualquier texto largo. Debe estar definido o el servidor no arranca.

---

## 4. Configuración CORS — Whitelist

El archivo `app.js` tiene **dos modos de CORS**. Solo uno puede estar activo a la vez.

### Modo actual: permisivo (desarrollo)

```js
// ✅ ACTIVO — Acepta peticiones de cualquier origen
app.use(cors({
  origin: true,
  credentials: true
}));
```

Este modo es el que viene activado. Sirve para pruebas locales y con Postman sin restricciones.

---

### Modo alternativo: whitelist (producción / más seguro)

Si el profesor quiere activar la lista blanca de orígenes permitidos, debe:

**Paso 1 — Descomentar el bloque de whitelist** en `app.js` (líneas ~30–68):

```js
const whitelist = [
  "http://localhost:3000",
  "http://localhost:4200",
  "http://192.168.18.3:3000",
  "http://192.168.18.3",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://localhost:5174"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 Bloqueado por CORS:", origin);
      callback(new Error("Bloqueado por CORS: Origen no permitido"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
```

**Paso 2 — Comentar el bloque permisivo** (líneas ~75–79):

```js
// ❌ COMENTAR esto cuando se use la whitelist
// app.use(cors({
//   origin: true,
//   credentials: true
// }));
```

**Paso 3 — Agregar el origen del frontend si es necesario:**

Si el frontend corre en una IP o puerto diferente, agregar al array `whitelist`:

```js
"http://192.168.1.100:4200",  // ← IP del frontend del profesor
```

> **Para pruebas con Postman no importa qué modo esté activo**: Postman no envía cabecera `Origin` en requests directos, por lo que siempre pasa el CORS (`!origin` es `true` en el whitelist).

---

## 5. Crear la base de datos en MySQL

### Opción A — Desde la terminal MySQL

```sql
mysql -u root

CREATE DATABASE IF NOT EXISTS el_buen_sabor_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

EXIT;
```

### Opción B — Comando directo (sin contraseña)

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS el_buen_sabor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Opción C — Desde MySQL Workbench

1. Conectar con usuario `root` (sin contraseña)
2. Menu → **Database** → **Create Schema**
3. Nombre: `el_buen_sabor_db`, Charset: `utf8mb4`, Collation: `utf8mb4_unicode_ci`
4. Click **Apply**

---

## 6. Migraciones

Crea todas las tablas del sistema en orden:

```bash
npx sequelize-cli db:migrate
```

Tablas que se crean:

| Orden | Tabla | Descripción |
|---|---|---|
| 1 | `roles` | Roles del sistema (admin, cajero, etc.) |
| 2 | `permisos` | Permisos individuales |
| 3 | `roles_permisos` | Relación rol ↔ permiso |
| 4 | `usuarios` | Empleados del restaurante |
| 5 | `rubros` | Categorías del menú |
| 6 | `platos` | Productos del menú |
| 7 | `mesas` | Mesas del salón |
| 8 | `pedidos` | Órdenes de los clientes |
| 9 | `detalle_pedidos` | Ítems de cada pedido |

Salida esperada:

```
== 20260507223410-create-roles: migrated
== 20260507223411-create-permisos: migrated
...
== 20260507223418-create-detallepedidos: migrated
```

---

## 7. Seeders — datos iniciales

Carga roles, permisos, carta de platos, mesas y usuarios demo:

```bash
npx sequelize-cli db:seed:all
```

### Usuarios disponibles después del seed

| Legajo | Password | Rol | Descripción |
|---|---|---|---|
| `SUPER001` | `admin123` | superadmin | Acceso total |
| `ADMIN001` | `admin123` | admin | Gestión de datos |
| `CAJ001` | `admin123` | cajero | Operaciones de caja |
| `COC001` | `admin123` | cocinero | Vista de cocina |
| `MOZO001` | `admin123` | mozo | Mesas y pedidos |

> Para las pruebas usar **`ADMIN001` / `admin123`**

### Platos disponibles (para crear pedidos)

| platoId | Nombre |
|---|---|
| 1 | Hamburguesa Clasica |
| 2 | Hamburguesa Buen Sabor |
| 3 | Pizza Muzzarella |
| 4 | Pizza Especial |
| 5 | Empanada Carne |
| 6 | Coca-Cola 500ml |
| 7 | Cerveza Andes IPA |

---

## 8. Levantar el servidor

```bash
npm start
```

Salida esperada:

```
🚀 Servidor 'El Buen Sabor' corriendo.
📡 Accesible localmente: http://localhost:3000
⚡ WebSockets: ACTIVOS
```

Swagger (documentación de la API): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 9. Configurar Postman

### 9.1 Importar la colección

1. Abrir **Postman**
2. Click en **Import** (botón arriba a la izquierda)
3. Arrastrar el archivo `tests/tests.json` o usar **"Browse files"**
4. Click **Import**

Aparecerá la colección **"El Buen Sabor"** en el panel izquierdo.

### 9.2 Importar el environment

1. Click en **Import** nuevamente
2. Arrastrar el archivo `tests/entorno.json`
3. Click **Import**

Aparecerá el environment **"El Buen Sabor - Local"**.

### 9.3 Activar el environment

En la esquina superior derecha de Postman hay un selector de environments (dice **"No Environment"**):

1. Click en el selector
2. Elegir **"El Buen Sabor - Local"**

> **Este paso es obligatorio.** Sin el environment seleccionado, la variable `{{baseUrl}}` no se resuelve y todos los requests fallan.

### 9.4 Variables de la colección explicadas

| Variable | Qué contiene | Quién la setea |
|---|---|---|
| `token_seguridad` | JWT del usuario logueado | `01. Login Admin` (automático) |
| `idPedidoActual` | ID del pedido recién creado | `08. Crear Pedido` (automático) |
| `baseUrl` | `http://localhost:3000` | Definida en el environment |
| `idUsuarioTest` | ID del usuario creado en tests | `23. Usuario Crear` (automático) |
| `legajoUsuarioTest` | Legajo del usuario creado | `23. Usuario Crear` (automático) |

Las variables que se setean automáticamente funcionan gracias a los **scripts de test** de Postman (pestaña **"Scripts"** → **"Post-response"** de cada request).

---

## 10. Ejecutar el flujo en Postman

### Flujo principal: Login → Mesa → Pedido → Cobro

Ejecutar los requests en este orden desde la colección:

#### Paso 1 — `01. Login Admin`

- **Método:** POST
- **URL:** `{{baseUrl}}/api/usuarios/login`
- **Body (JSON):**
  ```json
  {
    "legajo": "ADMIN001",
    "password": "admin123"
  }
  ```
- **Qué hace automáticamente:** guarda el token en la variable `token_seguridad`
- **Respuesta esperada:** `200 OK` con `{ "token": "eyJ...", "usuario": {...} }`

#### Paso 2 — `07. abrir Mesa`

- **Método:** POST
- **URL:** `{{baseUrl}}/api/mesas/4/abrir`
- **Auth:** Bearer `{{token_seguridad}}` (se pone solo)
- **Body (JSON):**
  ```json
  { "idMozo": 1 }
  ```
- **Respuesta esperada:** `200 OK` confirmando que la mesa 4 está ocupada

#### Paso 3 — `08. Crear Pedido`

- **Método:** POST
- **URL:** `{{baseUrl}}/api/pedidos`
- **Auth:** Bearer `{{token_seguridad}}`
- **Body (JSON):**
  ```json
  {
    "mesa": "4",
    "cliente": "Prueba CI/CD",
    "productos": [
      {
        "platoId": 1,
        "cantidad": 1,
        "aclaracion": "Sin cebolla"
      }
    ]
  }
  ```
- **Qué hace automáticamente:** guarda el ID del pedido en `idPedidoActual`
- **Respuesta esperada:** `201 Created` con `{ "data": { "id": X, "estado": "pendiente", ... } }`

#### Paso 4 — `14a. Solicitar Cobro`

- **Método:** POST
- **URL:** `{{baseUrl}}/api/mesas/4/solicitar-cobro`
- **Auth:** Bearer `{{token_seguridad}}`
- **Body:** vacío
- **Respuesta esperada:** `200 OK` — la mesa pasa a estado `esperando_cobro`

---

### Ejecutar toda la colección de una vez (Collection Runner)

1. Click derecho en la colección **"El Buen Sabor"**
2. Seleccionar **"Run collection"**
3. Verificar que el environment **"El Buen Sabor - Local"** esté seleccionado
4. Click **"Run El Buen Sabor"**

Postman ejecuta todos los requests en orden y muestra los resultados de cada assertion.

---

## 11. Flujo con CURL

### Linux / Mac / Git Bash

```bash
# ─── PASO 1: Login — obtener token ────────────────────────────────
TOKEN=$(curl -s -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"legajo": "ADMIN001", "password": "admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# ─── PASO 2: Abrir Mesa 4 ─────────────────────────────────────────
curl -s -X POST http://localhost:3000/api/mesas/4/abrir \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"idMozo": 1}'

# ─── PASO 3: Crear Pedido ─────────────────────────────────────────
curl -s -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mesa": "4",
    "cliente": "Prueba Profesor",
    "productos": [
      { "platoId": 1, "cantidad": 2, "aclaracion": "Sin cebolla" }
    ]
  }'

# ─── PASO 4: Solicitar Cobro ──────────────────────────────────────
curl -s -X POST http://localhost:3000/api/mesas/4/solicitar-cobro \
  -H "Authorization: Bearer $TOKEN"
```

---

### Windows — PowerShell

```powershell
# ─── PASO 1: Login — obtener token ────────────────────────────────
$login = Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/usuarios/login" `
  -ContentType "application/json" `
  -Body '{"legajo": "ADMIN001", "password": "admin123"}'

$TOKEN = $login.token
Write-Host "Token: $TOKEN"

# ─── PASO 2: Abrir Mesa 4 ─────────────────────────────────────────
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/mesas/4/abrir" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $TOKEN" } `
  -Body '{"idMozo": 1}'

# ─── PASO 3: Crear Pedido ─────────────────────────────────────────
$pedidoBody = @{
  mesa      = "4"
  cliente   = "Prueba Profesor"
  productos = @(
    @{ platoId = 1; cantidad = 2; aclaracion = "Sin cebolla" }
  )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/pedidos" `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $TOKEN" } `
  -Body $pedidoBody

# ─── PASO 4: Solicitar Cobro ──────────────────────────────────────
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:3000/api/mesas/4/solicitar-cobro" `
  -Headers @{ Authorization = "Bearer $TOKEN" }
```

---

## 12. Tests automáticos

### Tests unitarios (Jest) — sin servidor, sin BD

```bash
npm run test:unit
```

Resultado esperado: **18 suites · 167 tests · todos PASS**

No requiere base de datos ni servidor activo.

### Tests de integración (Newman) — requiere servidor activo

En una terminal: `npm start`

En otra terminal:

```bash
npm test
```

Esto ejecuta la colección Postman completa de forma automática desde la línea de comandos.

---

## 13. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `JWT_SECRET no está definido` | Falta `.env` o la variable | Crear `.env` con `JWT_SECRET=ClaveSecretaProfesor2024` |
| Login → `500 Internal Server Error` | Tablas RBAC no existen en DB | `npx sequelize-cli db:migrate` |
| Login → `401 CREDENCIALES_INVALIDAS` | Seeder no ejecutado o credenciales incorrectas | `npx sequelize-cli db:seed:all` — usar `ADMIN001` / `admin123` |
| `Abrir Mesa → 400 MESA_YA_OCUPADA` | La mesa 4 ya fue abierta antes | Cerrar la mesa primero o usar otra mesa |
| `Crear Pedido → error plato` | El platoId no existe | Verificar que el seeder de carta completó sin errores |
| `Solicitar Cobro → 400 MESA_YA_LIBRE` | La mesa ya fue cerrada | Abrir la mesa nuevamente (Paso 2) |
| Variables `{{token_seguridad}}` vacías en Postman | Environment no seleccionado | Seleccionar "El Buen Sabor - Local" arriba a la derecha |
| CORS bloqueado desde el frontend | IP/puerto no está en la whitelist | Agregar la IP a la whitelist en `app.js` |

---

## 14. Resetear la base de datos

Si se necesita empezar desde cero:

```bash
# 1. Deshacer todos los seeds
npx sequelize-cli db:seed:undo:all

# 2. Deshacer todas las migraciones (borra todas las tablas)
npx sequelize-cli db:migrate:undo:all

# 3. Volver a crear todo desde cero
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

O directamente desde MySQL:

```sql
DROP DATABASE el_buen_sabor_db;
CREATE DATABASE el_buen_sabor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Y luego volver a correr migrate + seed.
