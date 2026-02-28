# El Buen Sabor - Backend API

API REST para gestion de restaurante con Node.js, Express, MySQL (Sequelize), MongoDB y WebSockets.

## Stack
- Runtime: Node.js
- Framework: Express
- SQL: MySQL + Sequelize
- NoSQL: MongoDB (stock)
- Auth: JWT
- Realtime: Socket.IO
- Docs: Swagger (`/api-docs`)
- Testing: Jest (unit) + Newman/Postman (E2E)

## Arquitectura
Flujo principal por capas:

`Routes -> Controllers -> Services -> Repositories (interface) -> Repositories (Sequelize) -> DB`

Puntos clave:
- Services concentran reglas de negocio.
- Repositories abstraen acceso a datos.
- Manejo de errores centralizado con codigos de dominio.
- Transacciones para operaciones criticas.

## Modulos principales
- Usuarios: login + ABM con baja logica.
- Platos: ABM + carga de imagen (`multer`).
- Rubros: jerarquia y validaciones de negocio.
- Pedidos: alta, modificacion, listado, eliminacion.
- Mesas: abrir/cerrar mesa con integridad transaccional.
- Facturacion: `FacturacionService` desacoplado de `PedidoService`.

## Facturacion (nuevo)
Se implemento `FacturacionService` para que la facturacion no viva en `PedidoService`.

Al cerrar mesa (`POST /api/mesas/:id/cerrar`):
1. `MesaService` valida estado de mesa.
2. `FacturacionService` arma el resumen facturable desde pedidos + detalles + platos.
3. Se marcan pedidos como pagados.
4. Se libera la mesa.
5. Se emite evento `ticket-generado` por WebSocket.

### Impuestos actuales
- IVA fijo del 21%.
- Estructura de salida:
  - `subtotal`
  - `impuestos.ivaPorcentaje`
  - `impuestos.ivaImporte`
  - `recargo`
  - `descuento`
  - `totalFinal`

## Eventos WebSocket
- `nuevo-pedido`: monitor de cocina.
- `ticket-generado`: monitor de caja.

## Monitores de desarrollo
- `cocina.html`: visualiza pedidos en tiempo real.
- `caja.html`: visualiza tickets de cierre con IVA.

Sugerencia para abrirlos en local:

```bash
npx http-server -p 5500
```

Luego:
- `http://127.0.0.1:5500/cocina.html`
- `http://127.0.0.1:5500/caja.html`

## Endpoints actuales

### Usuarios (`/api/usuarios`)
- `POST /login`
- `GET /` (admin)
- `GET /:id` (admin)
- `POST /` (admin)
- `PUT /:id` (admin)
- `DELETE /:id` (admin, baja logica)

### Platos (`/api/platos`)
- `GET /`
- `POST /` (auth)
- `PUT /:id` (auth)
- `DELETE /:id` (auth)
- `POST /:id/imagen` (auth, multipart/form-data)

### Pedidos (`/api/pedidos`)
- `POST /` (auth)
- `GET /` (auth)
- `GET /mesa/:mesa` (auth)
- `PUT /modificar` (auth)
- `DELETE /:id` (auth)

### Mesas (`/api/mesas`)
- `GET /` (auth)
- `POST /:id/abrir` (auth)
- `POST /:id/cerrar` (auth) -> incluye facturacion y emite `ticket-generado`

### Rubros (`/api/rubros`)
- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

## Instalacion rapida

```bash
npm install
```

Crear `.env`:

```env
PORT=3000
JWT_SECRET=tu_secreto

DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=el_buen_sabor_db
DB_DIALECT=mysql

MONGO_URI=mongodb://localhost:27017/el_buen_sabor_db
```

Migraciones + seed:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Levantar servidor:

```bash
npm start
```

## Scripts
- `npm start`
- `npm run dev`
- `npm test` (Newman)
- `npm run test:unit`
- `npm run test:watch`
- `npm run test:coverage`
- `npm run seed`

## Testing
Unit tests:

```bash
npm run test:unit
```

Estado actual (ultima corrida local):
- 14 suites
- 120 tests
- todo verde

E2E Newman:

```bash
npm test
```

## Documentacion API
- Swagger UI: `http://localhost:3000/api-docs`

## Estructura resumida

```text
src/
  controllers/
  services/
  repositories/
    sequelize/
  middlewares/
  models/
  routes/
  events/
  listeners/
  docs/
tests/
  controllers/
  services/
  middlewares/
cocina.html
caja.html
app.js
```

## Nota
Proyecto academico - Programacion Web II.
