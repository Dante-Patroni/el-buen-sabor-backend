# El Buen Sabor - Backend API

API REST para gestión de restaurante con Node.js, Express, MySQL (Sequelize), MongoDB y WebSockets.

---

## 🛠️ Stack

- **Runtime:** Node.js
- **Framework:** Express
- **SQL:** MySQL + Sequelize
- **NoSQL:** MongoDB (stock futuro / extensible)
- **Auth:** JWT
- **Realtime:** Socket.IO
- **Docs:** Swagger (`/api-docs`)
- **Testing:** Jest (unit) + Newman/Postman (E2E)

---

## 🧱 Arquitectura

Flujo principal por capas:
`Routes → Controllers → Services → Repositories (interface) → Repositories (Sequelize) → DB`

### Puntos clave

- Services concentran reglas de negocio.
- Repositories abstraen acceso a datos.
- Manejo de errores centralizado con códigos de dominio.
- Uso de transacciones para operaciones críticas.
- Emisión de eventos desacoplados mediante EventEmitter + WebSockets.

---

## 📊 Modelo de datos (actualizado)

### 🔹 Cambios importantes

- ❌ Se eliminó el `total` persistido en **Pedidos**
- ❌ Se eliminó el `total_actual` como fuente de verdad en **Mesas**
- ❌ Se eliminó `PlatoId` y `fecha` de **Pedidos** (no usados)
- ✅ Los totales ahora se calculan dinámicamente desde `DetallePedidos`

### 🔹 Beneficios

- Evita redundancia de datos
- Reduce escrituras innecesarias
- Mejora integridad del sistema
- Simplifica lógica de negocio

---

## 🧠 Lógica de negocio clave

### 🪑 Mesas

- Entidad **semi-estática**
- Solo mantiene:
  - estado (`libre` / `ocupada`)
  - mozo asignado
- El estado puede derivarse desde pedidos (no pagados)

### 🧾 Pedidos

- Entidad **dinámica**
- Relacionada a una mesa
- Estado:
  - `pendiente`
  - `en_preparacion`
  - `rechazado`
  - `entregado`
  - `pagado`
  - `cancelado`

### 💰 Totales

Se calculan dinámicamente:

```sql
SELECT SUM(dp.subtotal)
FROM Pedidos p
JOIN DetallePedidos dp ON dp.PedidoId = p.id
WHERE p.mesa = :mesaId
AND p.estado != 'pagado';
```

🍽️ Gestión de platos (decisión de diseño)
El sistema NO maneja stock clásico por defecto.

✅ Implementado (MVP)

- `esActivo`: disponibilidad lógica
- `esIlimitado`: plato sin restricción
- `stockActual`: opcional (uso operativo)

Configuración manual al inicio del turno:

📌 Enfoque real de negocio
El encargado define disponibilidad diaria. Los mozos ven en tiempo real qué platos se pueden pedir. Evita tomar pedidos de platos no disponibles.

🔮 Futuro

- Gestión de stock real en MongoDB
- Recetas e insumos
- CMV (Costo de Mercadería Vendida)

🧾 Facturación

Se implementa `FacturacionService` desacoplado.

Flujo al cerrar mesa:

1. Se calcula total dinámico
2. Se genera resumen de facturación
3. Se marcan pedidos como pagado
4. Se libera la mesa
5. Se emite evento `ticket-generado`

Impuestos

- IVA: 21%

Estructura:

```
subtotal
impuestos.ivaPorcentaje
impuestos.ivaImporte
recargo
descuento
totalFinal
```

🔌 Eventos WebSocket

- `nuevo-pedido` → monitor de cocina
- `ticket-generado` → monitor de caja

Monitores de desarrollo:

```bash
npx http-server -p 5500
```

- Cocina: http://127.0.0.1:5500/cocina.html
- Caja: http://127.0.0.1:5500/caja.html

---

## 📍 Endpoints

### Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/login` | Iniciar sesión |
| GET | `/` | Listar usuarios |
| GET | `/:id` | Obtener usuario |
| POST | `/` | Crear usuario |
| PUT | `/:id` | Actualizar usuario |
| DELETE | `/:id` | Eliminar usuario |

### Platos (`/api/platos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Listar platos |
| POST | `/` | Crear plato |
| PUT | `/:id` | Actualizar plato |
| DELETE | `/:id` | Eliminar plato |
| POST | `/:id/imagen` | Subir imagen |

### Pedidos (`/api/pedidos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear pedido |
| GET | `/` | Listar pedidos |
| GET | `/mesa/:mesa` | Pedidos por mesa |
| PUT | `/modificar` | Modificar estado/cantidad |
| DELETE | `/:id` | Eliminar pedido |

Incluye: cálculo dinámico de total, cantidad de items pendientes y emisión de ticket.

### Mesas (`/api/mesas`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Listar mesas |
| POST | `/:id/abrir` | Abrir mesa |
| POST | `/:id/cerrar` | Cerrar mesa |

### Rubros (`/api/rubros`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Listar rubros |
| POST | `/` | Crear rubro |
| PUT | `/:id` | Actualizar rubro |
| DELETE | `/:id` | Eliminar rubro |

---

## 🚀 Instalación

```bash
npm install
```

### Variables de entorno (`.env`)

```
PORT=3000
JWT_SECRET=tu_secreto

DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=el_buen_sabor_db
DB_DIALECT=mysql

MONGO_URI=mongodb://localhost:27017/el_buen_sabor_db
```

### Base de datos

```bash
# Ejecutar migraciones (esquema actualizado)
npx sequelize-cli db:migrate

# Cargar datos de prueba
npm run seed
```

**Credenciales disponibles tras el seed:**

| Rol | Legajo | Password |
|-----|---------|----------|
| Admin | ADMIN001 | admin123 |
| Mozo | MOZO001 | mozo123 |
| Mozo | MOZO002 | mozo123 |
| Cocinero | COC001 | cocinero123 |
| Cajero | CAJ001 | cajero123 |

### Ejecutar

```bash
npm start
```

---

## 🧪 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia producción |
| `npm run dev` | Modo desarrollo |
| `npm test` | E2E (Newman) |
| `npm run test:unit` | Tests unitarios |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Cobertura de tests |
| `npm run seed` | Ejecutar seeders |

---

## 🧪 Testing

### Unitarios

```bash
npm run test:unit
```

Estado actual:

- ✔ Tests pasando
- ✔ Cobertura estable

### E2E

```bash
npm test
```

Requiere servidor corriendo en `localhost:3000`.

---

## 📄 Documentación API

Swagger disponible en:

👉 http://localhost:3000/api-docs

---

## 📁 Estructura del proyecto

```
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
seed.js
```

---

## 📌 Nota

Proyecto académico - Programación Web II.

El diseño fue ajustado en base a buenas prácticas de:

- Modelado de datos
- Reducción de redundancia
- Separación de responsabilidades
- Consistencia transaccional
