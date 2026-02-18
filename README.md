# 🍔 El Buen Sabor - Backend API

API RESTful desarrollada con **Node.js, Express y MySQL** para la gestión de pedidos de un restaurante. Este proyecto implementa patrones de arquitectura de software profesional, comunicación en tiempo real con WebSockets, y pruebas automatizadas.

## 🚀 Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos Relacional:** MySQL (con Sequelize ORM)
- **Base de Datos NoSQL:** MongoDB (Gestión de Stock)
- **Comunicación en Tiempo Real:** Socket.io (WebSockets)
- **Autenticación:** JWT (JSON Web Tokens)
- **Documentación:** Swagger UI (OpenAPI)
- **Testing:** Postman + Newman (E2E Testing)

## 🏛️ Arquitectura

El proyecto implementa **Hexagonal Architecture (Ports & Adapters)** combinada con **Event-Driven Architecture** para máxima flexibilidad, testabilidad y mantenibilidad:

### Flujo de Capas (6 niveles de abstracción)

```
Routes → Controllers → Services → Repository (Interface) → SequelizeRepository → Database
```

**1. Routes (Puertos de entrada HTTP)**
- Define endpoints REST
- Aplica middlewares (autenticación, validación)
- Ejemplo: `POST /api/pedidos`

**2. Controllers (Adaptadores HTTP)**
- Maneja request/response
- Delega lógica al Service
- Retorna códigos HTTP apropiados

**3. Services (Núcleo de Negocio)**
- Lógica de negocio y validaciones
- Orquesta operaciones complejas
- **Depende de abstracciones, NO de implementaciones**

**4. Repository (Interfaz/Contrato)**
- Define QUÉ operaciones se pueden hacer
- NO implementa nada (clase abstracta)
- Permite cambiar de BD sin tocar Services

**5. SequelizeRepository (Adaptador de BD)**
- Implementación concreta con Sequelize
- Traduce operaciones a SQL
- Podría reemplazarse por MongoRepository, etc.

**6. Database (MySQL)**
- Persistencia de datos

### Patrones de Diseño Implementados

- ✅ **Hexagonal Architecture (Ports & Adapters)**: Núcleo de negocio independiente de frameworks
- ✅ **Repository Pattern**: Abstracción completa del acceso a datos
- ✅ **Dependency Injection**: Inyección de dependencias en Services y Controllers
- ✅ **Dependency Inversion Principle (SOLID)**: Services dependen de interfaces, no de implementaciones
- ✅ **Adapter Pattern**: Integración con MongoDB para stock (MongoStockAdapter)
- ✅ **Event-Driven Architecture**: Comunicación asíncrona mediante eventos
- ✅ **Singleton Pattern**: Instancia única del EventEmitter
- ✅ **Transaction Pattern**: Manejo robusto de transacciones con propagación y atomicidad

### 🔒 Manejo de Transacciones (ACID)

El sistema implementa un **manejo robusto de transacciones** que garantiza la integridad de datos en operaciones críticas:

#### Garantías ACID

- **Atomicidad**: Todas las operaciones de un pedido (descuento de stock, actualización de mesa, creación de pedido) se ejecutan completamente o no se ejecutan en absoluto
- **Consistencia**: Los datos siempre quedan en un estado válido
- **Aislamiento**: Las transacciones concurrentes no interfieren entre sí
- **Durabilidad**: Una vez confirmada, la transacción persiste incluso ante fallos

#### Patrón de Transacciones Implementado

```javascript
// 1. Operaciones que inician transacciones
async crearPedido(datos) {
  return await this.repository.inTransaction(async (transaction) => {
    // Todas las operaciones usan la misma transacción
    await this.platoService.descontarStock(platoId, cantidad, transaction);
    await this.mesaService.sumarTotal(mesaId, monto, transaction);
    await this.repository.crearPedido(datos, transaction);
    return pedido;
  });
}

// 2. Operaciones que aceptan transacciones externas
async descontarStock(id, cantidad, transaction = null) {
  if (transaction) {
    // Usar transacción externa (parte de operación mayor)
    return await this.repository.descontarStock(id, cantidad, transaction);
  }
  // Crear nueva transacción (operación independiente)
  return await this.repository.inTransaction(async (t) => {
    return await this.repository.descontarStock(id, cantidad, t);
  });
}
```

#### Propagación de Transacciones

```
PedidoService.crearPedido(transaction)
  ├─> PlatoService.descontarStock(transaction)
  │     └─> PlatoRepository.descontarStockAtomico(transaction)
  ├─> MesaService.sumarTotal(transaction)
  │     └─> MesaRepository.actualizarMesa(transaction)
  └─> PedidoRepository.crearPedido(transaction)
```

**Ventajas:**
- ✅ Si falla cualquier operación, TODO se revierte automáticamente
- ✅ No quedan estados inconsistentes (ej: stock descontado pero pedido no creado)
- ✅ Eventos se emiten solo DESPUÉS del commit exitoso
- ✅ Operaciones concurrentes no generan condiciones de carrera


### Ventajas de esta Arquitectura

**🔄 Flexibilidad**
- Cambiar de MySQL a PostgreSQL sin tocar la lógica de negocio
- Reemplazar Sequelize por TypeORM modificando solo los Repositories

**🧪 Testabilidad**
- Services testeables sin base de datos (usando mocks)
- 22/22 tests unitarios pasando con Jest
- Suite completa de tests E2E con Newman/Postman
- Cobertura de casos de éxito y error

**🔧 Mantenibilidad**
- Cada capa tiene una responsabilidad única y clara
- Cambios aislados (modificar un Repository no afecta Services)
- Código autodocumentado con patrones consistentes

**📈 Escalabilidad**
- Fácil agregar nuevas features sin romper código existente
- Preparado para microservicios (Services independientes)

**🔒 Integridad de Datos**
- Transacciones ACID garantizan consistencia
- Rollback automático ante errores
- No hay estados intermedios inconsistentes
- Operaciones atómicas en toda la aplicación

---

## 📡 Características Principales

### 🔐 Autenticación y Seguridad

- **JWT Tokens**: Autenticación stateless con tokens firmados digitalmente
- **CORS**: Configuración de orígenes permitidos
- **Middleware de Autenticación**: Protección de rutas sensibles
- **Validación de Datos**: Middleware de validación con express-validator

### ⚡ Comunicación en Tiempo Real

- **WebSockets (Socket.io)**: Notificaciones instantáneas a la cocina
- **Eventos del Sistema**: Arquitectura event-driven para procesos asíncronos
- **Monitor de Cocina**: Pantalla web que recibe pedidos en tiempo real

### 🗄️ Arquitectura Poliglota

- **MySQL**: Datos relacionales (Pedidos, Platos, Mesas, Usuarios)
- **MongoDB**: Gestión de stock en tiempo real
- **Sequelize ORM**: Abstracción de consultas SQL
- **MongoStockAdapter**: Patrón Adapter para integración con MongoDB

## 📋 Endpoints Disponibles

### 🔑 Autenticación (`/api/usuarios`)

- `POST /api/usuarios/login` - Iniciar sesión y obtener token JWT
- `POST /api/usuarios/register` - Registrar nuevo usuario
- `GET /api/usuarios` - Listar usuarios (requiere autenticación)

### 🍽️ Platos (`/api/platos`)

- `GET /api/platos` - Listar todos los platos
- `GET /api/platos/:id` - Obtener un plato por ID
- `POST /api/platos` - Crear nuevo plato (requiere autenticación)
- `PUT /api/platos/:id` - Actualizar plato (requiere autenticación)
- `DELETE /api/platos/:id` - Eliminar plato (requiere autenticación)

### 📝 Pedidos (`/api/pedidos`)

- `POST /api/pedidos` - Crear nuevo pedido (requiere autenticación)
- `GET /api/pedidos` - Listar todos los pedidos (requiere autenticación)
- `GET /api/pedidos/mesa/:mesa` - Obtener pedidos de una mesa específica
- `POST /api/pedidos/cerrar-mesa` - Cerrar y cobrar una mesa
- `DELETE /api/pedidos/:id` - Eliminar pedido y restaurar stock

### 🪑 Mesas (`/api/mesas`)

- `GET /api/mesas` - Listar todas las mesas
- `GET /api/mesas/:id` - Obtener mesa por ID
- `POST /api/mesas` - Crear nueva mesa
- `PUT /api/mesas/:id` - Actualizar estado de mesa

### 📂 Rubros (`/api/rubros`)

- `GET /api/rubros` - Listar categorías de platos
- `POST /api/rubros` - Crear nueva categoría

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Dante-Patroni/el-buen-sabor-backend.git
cd el-buen-sabor-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=elbuensabor
DB_DIALECT=mysql

# MongoDB
MONGO_URI=mongodb://localhost:27017/elbuensabor

# JWT Secret
JWT_SECRET=ClaveSecretaDante123

# Puerto del Servidor
PORT=3000
```

### 4. Configurar Base de Datos MySQL

```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE elbuensabor;
exit;

# Ejecutar migraciones
npx sequelize-cli db:migrate

# (Opcional) Cargar datos de prueba
npx sequelize-cli db:seed:all
```

### 5. Configurar MongoDB

```bash
# Asegúrate de tener MongoDB instalado y corriendo
mongod

# El sistema creará automáticamente la colección 'stocks'
```

### 6. Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en:
- **API REST**: `http://localhost:3000`
- **Swagger Docs**: `http://localhost:3000/api-docs`
- **WebSockets**: `ws://localhost:3000`

## 🧪 Testing y Calidad de Código

El proyecto cuenta con una **suite completa de tests** que garantiza la calidad y estabilidad del código:

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests unitarios
npx jest tests/services --no-coverage

# Ejecutar tests con cobertura
npx jest tests/services --coverage

# Ejecutar tests en modo watch
npx jest tests/services --watch
```

**Resultado actual:** 22/22 tests pasando ✅

| Suite | Tests | Estado |
|-------|-------|--------|
| mesaService.test.js | 5/5 | ✅ |
| platoService.test.js | 6/6 | ✅ |
| pedidoService.test.js | 8/8 | ✅ |
| usuarioService.test.js | 3/3 | ✅ |

**Características de los tests:**
- ✅ Mocks de repositories para aislar lógica de negocio
- ✅ Tests de transacciones con `inTransaction` mock
- ✅ Cobertura de casos de éxito y error
- ✅ Validación de propagación de parámetros

### Tests de Integración (Newman/Postman)

```bash
# Ejecutar todos los tests E2E
npm test

# Ejecutar con reporte detallado
npx newman run tests/tests.json --reporters cli,json
```

**Cobertura de tests E2E:**
- ✅ Autenticación y autorización (JWT)
- ✅ CRUD completo de platos con validaciones
- ✅ Creación y modificación de pedidos
- ✅ Gestión de mesas (abrir/cerrar)
- ✅ Actualización de stock en tiempo real
- ✅ Subida de imágenes de productos
- ✅ Manejo de errores (400, 404, 409, 500)

### Swagger UI

Accede a `http://localhost:3000/api-docs` para:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente desde el navegador
- Ver esquemas de datos y respuestas

### Monitor de Cocina (WebSocket)

Abre el archivo `cocina.html` en tu navegador para ver los pedidos en tiempo real:

```bash
# Servir el archivo con un servidor local
npx http-server -p 5500
# Luego abre: http://127.0.0.1:5500/cocina.html
```

## 🔄 Flujo de un Pedido (Hexagonal Architecture en Acción)

1. **Cliente envía petición** → `POST /api/pedidos` con token JWT
2. **Route** → Recibe la petición y aplica middlewares
3. **Middleware de autenticación** → Verifica el token JWT
4. **Middleware de validación** → Valida formato de datos (express-validator)
5. **Controller** → Recibe la petición validada
6. **Service** → Ejecuta lógica de negocio:
   - Consulta platos vía **Repository Interface** (abstracción)
   - **SequelizeRepository** traduce a consultas SQL
   - Valida stock disponible
   - Calcula totales
   - Descuenta stock en MySQL vía Repository
   - Crea pedido en MySQL
   - Actualiza estado de la mesa
7. **Sistema de Eventos** → Emite evento `pedido-creado`
8. **Listeners** → Reaccionan al evento:
   - Envía notificación a cocina por WebSocket
   - Simula facturación electrónica (AFIP)
9. **Controller** → Formatea respuesta HTTP
10. **Respuesta al cliente** → `201 Created` con datos del pedido

### 🎯 Ventaja de la Abstracción

```javascript
// El Service NO conoce Sequelize, solo la interfaz
class PedidoService {
  constructor(pedidoRepository, platoRepository) {
    this.pedidoRepository = pedidoRepository; // ← Interfaz
    this.platoRepository = platoRepository;   // ← Interfaz
  }
  
  async crearPedido(datos) {
    // Usa métodos abstractos, no SQL directo
    const plato = await this.platoRepository.buscarPorId(id);
    await this.pedidoRepository.crearPedido(datos);
  }
}

// En producción: MySQL con Sequelize
const repo = new SequelizePedidoRepository();

// En tests: Mock (sin BD)
const repo = { buscarPorId: jest.fn(), crearPedido: jest.fn() };

// Mañana: PostgreSQL con TypeORM
const repo = new TypeORMPedidoRepository();

// El Service NO CAMBIA ✅
const service = new PedidoService(repo, ...);
```

## 📁 Estructura del Proyecto

```
backend-el-buen-sabor/
├── src/
│   ├── adapters/          # 🔌 Adaptadores para sistemas externos
│   │   └── MongoStockAdapter.js
│   ├── config/            # ⚙️ Configuración de BD y servicios
│   │   ├── config.js
│   │   └── mongo.js
│   ├── controllers/       # 🎮 Adaptadores HTTP (manejan req/res)
│   │   ├── pedidoController.js
│   │   ├── platoController.js
│   │   ├── mesaController.js
│   │   └── usuarioController.js
│   ├── events/            # 📢 Sistema de eventos
│   │   └── pedidoEvents.js
│   ├── listeners/         # 👂 Listeners de eventos
│   │   └── setupListeners.js
│   ├── middlewares/       # 🛡️ Middlewares personalizados
│   │   ├── authMiddleware.js
│   │   ├── pedidoValidator.js
│   │   └── upload.js
│   ├── models/            # 📊 Modelos Sequelize (ORM)
│   │   ├── index.js
│   │   ├── pedido.js
│   │   ├── detallePedido.js
│   │   ├── plato.js
│   │   ├── mesa.js
│   │   └── usuario.js
│   ├── repositories/      # 🗄️ Capa de abstracción de datos
│   │   ├── pedidoRepository.js      # ← INTERFAZ (contrato)
│   │   ├── platoRepository.js       # ← INTERFAZ
│   │   ├── mesaRepository.js        # ← INTERFAZ
│   │   ├── usuarioRepository.js     # ← INTERFAZ
│   │   └── sequelize/               # ← IMPLEMENTACIONES
│   │       ├── sequelizePedidoRepository.js
│   │       ├── sequelizePlatoRepository.js
│   │       ├── sequelizeMesaRepository.js
│   │       └── sequelizeUsuarioRepository.js
│   ├── routes/            # 🛣️ Definición de endpoints REST
│   │   ├── pedidoRoutes.js
│   │   ├── platoRoutes.js
│   │   ├── mesaRoutes.js
│   │   └── usuarioRoutes.js
│   ├── services/          # 💼 Núcleo de lógica de negocio
│   │   ├── pedidoService.js
│   │   ├── platoService.js
│   │   ├── mesaService.js
│   │   └── usuarioService.js
│   └── docs/              # 📚 Documentación Swagger
│       └── swagger.js
├── migrations/            # 🔄 Migraciones de base de datos
├── seeders/              # 🌱 Datos de prueba
├── tests/                # 🧪 Tests E2E (Newman) + Unitarios (Jest)
│   ├── services/         # Tests unitarios de Services
│   └── tests.json        # Colección Postman
├── uploads/              # 📁 Archivos subidos (imágenes)
├── app.js                # 🚀 Punto de entrada de la aplicación
├── jest.config.js        # ⚙️ Configuración de Jest
├── package.json
└── .env                  # 🔐 Variables de entorno (no versionado)
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Ejecutar migraciones
npm run migrate

# Revertir última migración
npm run migrate:undo

# Ejecutar seeders
npm run seed

# Tests E2E con Newman
npm test

# Tests unitarios con Jest
npx jest tests/services

# Tests unitarios con cobertura
npx jest tests/services --coverage

# Limpiar base de datos
node clean_db.js
```

## 🔧 Herramientas de Desarrollo

- **Nodemon**: Auto-reload en desarrollo
- **Sequelize CLI**: Gestión de migraciones y seeders
- **Jest**: Framework de testing unitario
- **Postman**: Colección de tests E2E
- **Newman**: Ejecución de tests en CI/CD
- **ESLint**: Linting de código (opcional)

## 📚 Documentación Adicional

Para una explicación detallada del flujo de información y arquitectura del sistema, consulta:
- **Documentación Técnica**: `docs/flujo_informacion_el_buen_sabor.md`
- **Swagger API Docs**: `http://localhost:3000/api-docs`


## 📄 Licencia

Este proyecto es parte de un trabajo académico para la materia **Programación Web II** - IUA 2025

---

**Desarrollado por Dante Patroni** - 2025  
**Materia**: Programación Web II  
**Institución**: IUA (Instituto Universitario Aeronáutico)
