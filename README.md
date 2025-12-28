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

El proyecto sigue una **Arquitectura en Capas (Layered Architecture)** combinada con **Event-Driven Architecture** para asegurar la escalabilidad y mantenibilidad:

### Capas del Sistema

- **`src/routes`**: Definición de endpoints y configuración de middlewares
- **`src/controllers`**: Manejo de peticiones HTTP y respuestas
- **`src/services`**: Lógica de negocio, validaciones y transacciones
- **`src/models`**: Definición de entidades y relaciones de base de datos (Sequelize)
- **`src/middlewares`**: Autenticación JWT, validación de datos, manejo de errores
- **`src/adapters`**: Conexión con sistemas externos (MongoDB Stock Adapter)
- **`src/events`**: Sistema de eventos para comunicación desacoplada
- **`src/listeners`**: Listeners que reaccionan a eventos del sistema

### Patrones de Diseño Implementados

- ✅ **MVC (Model-View-Controller)**: Separación de responsabilidades
- ✅ **Repository Pattern**: Servicios como capa de acceso a datos
- ✅ **Adapter Pattern**: Integración con MongoDB para stock
- ✅ **Dependency Injection**: Bajo acoplamiento entre componentes
- ✅ **Event-Driven Architecture**: Comunicación asíncrona mediante eventos
- ✅ **Singleton Pattern**: Instancia única del EventEmitter

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

## 🧪 Testing y Documentación

### Swagger UI

Accede a `http://localhost:3000/api-docs` para:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente desde el navegador
- Ver esquemas de datos y respuestas

### Tests Automáticos con Newman

```bash
# Ejecutar todos los tests
npx newman run tests/el-buen-sabor.postman_collection.json

# Ejecutar tests con variables de entorno
npx newman run tests/el-buen-sabor.postman_collection.json -e tests/environment.json
```

### Monitor de Cocina (WebSocket)

Abre el archivo `cocina.html` en tu navegador para ver los pedidos en tiempo real:

```bash
# Servir el archivo con un servidor local
npx http-server -p 5500
# Luego abre: http://127.0.0.1:5500/cocina.html
```

## 🔄 Flujo de un Pedido

1. **Cliente envía petición** → `POST /api/pedidos` con token JWT
2. **Middleware de autenticación** → Verifica el token
3. **Middleware de validación** → Valida datos del pedido
4. **Controlador** → Recibe la petición
5. **Servicio** → Ejecuta lógica de negocio:
   - Descuenta stock en MongoDB
   - Calcula totales
   - Crea pedido en MySQL
   - Actualiza estado de la mesa
6. **Sistema de Eventos** → Emite evento `pedido-creado`
7. **Listeners** → Reaccionan al evento:
   - Envía notificación a cocina por WebSocket
   - Simula facturación electrónica (AFIP)
8. **Respuesta al cliente** → `201 Created` con datos del pedido

## 📁 Estructura del Proyecto

```
backend-el-buen-sabor/
├── src/
│   ├── adapters/          # Adaptadores para sistemas externos
│   │   └── MongoStockAdapter.js
│   ├── config/            # Configuración de BD y servicios
│   │   ├── config.js
│   │   └── mongo.js
│   ├── controllers/       # Controladores HTTP
│   │   ├── pedidoController.js
│   │   ├── platoController.js
│   │   ├── mesaController.js
│   │   └── usuarioController.js
│   ├── events/            # Sistema de eventos
│   │   └── pedidoEvents.js
│   ├── listeners/         # Listeners de eventos
│   │   └── setupListeners.js
│   ├── middlewares/       # Middlewares personalizados
│   │   ├── authMiddleware.js
│   │   ├── pedidoValidator.js
│   │   └── upload.js
│   ├── models/            # Modelos Sequelize
│   │   ├── index.js
│   │   ├── pedido.js
│   │   ├── detallePedido.js
│   │   ├── plato.js
│   │   ├── mesa.js
│   │   └── usuario.js
│   ├── routes/            # Definición de rutas
│   │   ├── pedidoRoutes.js
│   │   ├── platoRoutes.js
│   │   ├── mesaRoutes.js
│   │   └── usuarioRoutes.js
│   ├── services/          # Lógica de negocio
│   │   ├── pedidoService.js
│   │   ├── platoService.js
│   │   ├── mesaService.js
│   │   └── usuarioServices.js
│   └── docs/              # Documentación Swagger
│       └── swagger.js
├── migrations/            # Migraciones de base de datos
├── seeders/              # Datos de prueba
├── tests/                # Tests E2E con Postman
├── uploads/              # Archivos subidos (imágenes)
├── app.js                # Punto de entrada de la aplicación
├── package.json
└── .env                  # Variables de entorno (no versionado)
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

# Tests con Newman
npm test

# Limpiar base de datos
node clean_db.js
```

## 🔧 Herramientas de Desarrollo

- **Nodemon**: Auto-reload en desarrollo
- **Sequelize CLI**: Gestión de migraciones y seeders
- **ESLint**: Linting de código (opcional)
- **Postman**: Colección de tests E2E
- **Newman**: Ejecución de tests en CI/CD

## 📚 Documentación Adicional

Para una explicación detallada del flujo de información y arquitectura del sistema, consulta:
- **Documentación Técnica**: `docs/flujo_informacion_el_buen_sabor.md`
- **Swagger API Docs**: `http://localhost:3000/api-docs`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la materia **Programación Web II** - IUA 2025

---

**Desarrollado por Dante Patroni** - 2025  
**Materia**: Programación Web II  
**Institución**: IUA (Instituto Universitario Aeronáutico)
