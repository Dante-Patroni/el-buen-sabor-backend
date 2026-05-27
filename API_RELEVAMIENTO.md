Relevamiento técnico API — El Buen Sabor
Resumen rápido
Arquitectura: Route → Controller → Service → Repository → Models (Sequelize/MySQL)
Eventos: pedido-creado, pedido-modificado, pedido-estado-actualizado, ticket-generado
Transacciones: uso de inTransaction(callback) en repositorios Sequelize para operaciones críticas
Error handling centralizado en errorMapper.js
Módulo: Auth (Autenticación)
Endpoint
POST /api/usuarios/login
Middlewares
ninguno
Controller
UsuarioController.login
Service
UsuarioService
Tablas / modelos
Usuario
Validaciones importantes
legajo y password requeridos
usuario activo
Reglas de negocio
genera JWT con datos de usuario (rol, id)
rechaza usuarios inactivos
Eventos Socket.IO
ninguno
Transacciones Sequelize
no
Módulo: Usuarios
Endpoints
GET /api/usuarios
GET /api/usuarios/:id
POST /api/usuarios
PUT /api/usuarios/:id
DELETE /api/usuarios/:id
Middlewares
authMiddleware
soloAdmin
Controller
UsuarioController.listar
UsuarioController.obtenerPorId
UsuarioController.crear
UsuarioController.actualizar
UsuarioController.eliminar
Service
UsuarioService
Tablas / modelos
Usuario
Validaciones importantes
nombre, apellido, legajo, password, rol requeridos
legajo único
rol válido: admin, mozo, cocinero, cajero
Reglas de negocio
hash de password con bcrypt
creación/actualización/eliminación atómica
eliminación lógica con activo=false
Eventos Socket.IO
ninguno
Transacciones Sequelize
sí en crear, actualizar y eliminar
Módulo: Pedidos
Endpoints
POST /api/pedidos
GET /api/pedidos
GET /api/pedidos/mesa/:mesa
PUT /api/pedidos/modificar
PATCH /api/pedidos/:id/estado
DELETE /api/pedidos/:id
Middlewares
validarPedido
validarMesaParam
Controller
PedidoController.crear
PedidoController.listar
PedidoController.buscarPorMesa
PedidoController.modificar
PedidoController.actualizarEstado
PedidoController.eliminar
Services involucrados
PedidoService
PlatoService
MesaService
Repositorios / tablas
Pedido
DetallePedido
Plato
Mesa
Validaciones importantes
mesa obligatorio
productos array no vacío
cada producto con platoId y cantidad
mesa existente y ocupada
plato existente y con stock suficiente
pedido existente y estado válido para modificar/eliminar
Reglas de negocio
creación en transacción:
valida mesa y stock
descuenta stock
crea pedido sin total
crea detalles con subtotal
no actualiza Mesa.totalActual
al modificar:
restaura stock anterior
descuenta stock nuevo
reemplaza detalles
al eliminar:
pide estado pendiente
restaura stock
borra cabecera y detalles
Eventos Socket.IO
pedido-creado
pedido-modificado
pedido-estado-actualizado
Transacciones Sequelize
sí en crear, modificar, eliminar, actualizar estado
Módulo: Mesas
Endpoints
GET /api/mesas
POST /api/mesas/:id/abrir
POST /api/mesas/:id/cerrar
Middlewares
authMiddleware
Controller
MesaController.listar
MesaController.abrirMesa
MesaController.cerrarMesa
Services involucrados
MesaService
FacturacionService
Repositorios / tablas
Mesa
Pedido
DetallePedido
Validaciones importantes
abrir silla: mesa debe existir y estar libre
cerrar mesa: mesa debe existir y no estar libre
Reglas de negocio
abrir mesa: cambiar estado a ocupada y asignar mozo
cerrar mesa:
calcular total desde DetallePedidos
marcar pedidos como pagado
liberar mesa
generar ticket/facturación
no persiste total de mesa en forma permanente
Eventos Socket.IO
ticket-generado
Transacciones Sequelize
sí en cierre de mesa
Módulo: Cocina
Endpoint
GET /api/cocina/pedidos
Middlewares
ninguno
Controller
CocinaController.listarPendientes
Service
PedidoService
Tablas / modelos
Pedido
DetallePedido
Plato
Validaciones importantes
filtrar pedidos por estados
Reglas de negocio
listados de pedidos con estados pendiente, en_preparacion, listo
formato para pantalla de cocina
Eventos Socket.IO
consume pedido-creado para notificar cocina
Transacciones Sequelize
no
Módulo: Platos
Endpoints
GET /api/platos
GET /api/platos/:id
POST /api/platos
PUT /api/platos/:id
DELETE /api/platos/:id
Middlewares
upload (para imágenes donde aplica)
Controller
PlatoController.listarMenuCompleto
PlatoController.buscarPorId
PlatoController.crearNuevoProducto
PlatoController.modificarProducto
PlatoController.eliminarProducto
Service
PlatoService
Repositorios / tablas
Plato
Rubro
Validaciones importantes
nombre obligatorio y único
precio positivo
rubroId válido
descripción válida
Reglas de negocio
creación/modificación en transacción
esActivo=true por defecto
stock_actual=0 y esIlimitado=false por defecto
Eventos Socket.IO
ninguno
Transacciones Sequelize
sí en crear, modificar y eliminar
Módulo: Rubros
Endpoints
GET /api/rubros
POST /api/rubros
PUT /api/rubros/:id
DELETE /api/rubros/:id
Controller
RubroController
Service
RubroService
Repositorios / tablas
Rubro
Validaciones importantes
denominación requerida
padreId válido
no permitir tercer nivel
no eliminar si tiene subrubros/platos activos
Reglas de negocio
reactivación si existe inactivo
errores si ya existe activo
baja lógica con activo=false
Eventos Socket.IO
ninguno
Transacciones Sequelize
sí
Módulo: Facturación / Caja
Service
FacturacionService
Uso principal
llamado desde MesaService.cerrarMesa
Reglas de negocio
calcula subtotal desde DetallePedidos
aplica IVA 21%
genera ticket estructurado
Eventos Socket.IO
ticket-generado
Transacciones Sequelize
sí cuando se integra en cierre de mesa
Concerns transversales
Middlewares clave
authMiddleware: valida JWT y agrega req.usuario
pedidoValidator: valida payload de pedidos y parámetros de mesa
upload: manejo de archivos con multer
Eventos / realtime
pedidoEmitter en pedidoEvents.js
listeners en setupListeners.js
io.emit("nuevo-pedido", pedido)
io.emit("ticket-generado", ticket)
Transacciones
patrón inTransaction(callback) en repositorios Sequelize
commit solo si callback completa con éxito
rollback si el callback lanza error
Manejo de errores
errorMapper.js
códigos de dominio estables: DATOS_INVALIDOS, STOCK_INSUFICIENTE, MESA_NO_ENCONTRADA, etc.