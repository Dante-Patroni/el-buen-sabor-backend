const express = require("express");
const router = express.Router();

// 1. Importamos las CLASES (No instancias)
const PedidoService = require("../services/pedidoService");
const PedidoController = require("../controllers/pedidoController");
const SequelizePedidoRepository = require("../repositories/sequelize/sequelizePedidoRepository");
const SequelizePlatoRepository = require("../repositories/sequelize/sequelizePlatoRepository");
const pedidoEmitter = require("../events/pedidoEvents");

// 2. Instanciamos las dependencias
const pedidoRepository = new SequelizePedidoRepository();
const platoRepository = new SequelizePlatoRepository();
const pedidoService = new PedidoService(
  pedidoRepository,
  platoRepository,
  pedidoEmitter
);
const pedidoController = new PedidoController(pedidoService);

// 3. Middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const { validarPedido } = require("../middlewares/pedidoValidator");

// =========================================================================
// DOCUMENTACIÓN SWAGGER Y RUTAS
// =========================================================================

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mesa
 *               - productos
 *             properties:
 *               mesa:
 *                 type: string
 *                 example: "5"
 *               cliente:
 *                 type: string
 *                 example: "Juan Pérez"
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platoId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                     aclaracion:
 *                       type: string
 *                       example: "Sin sal"
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authMiddleware, validarPedido, pedidoController.crear);

/**
 * @swagger
 * /api/pedidos/cerrar-mesa:
 *   post:
 *     summary: Cierra una mesa y calcula el total final
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mesa
 *             properties:
 *               mesa:
 *                 type: string
 *                 example: "4"
 *     responses:
 *       200:
 *         description: Mesa cerrada y total calculado
 *       404:
 *         description: No hay pedidos activos para esa mesa
 *       500:
 *         description: Error interno
 */
router.post("/cerrar-mesa", authMiddleware, pedidoController.cerrarMesa);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtiene el historial de todos los pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos recuperada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authMiddleware, pedidoController.listar);

/**
 * @swagger
 * /api/pedidos/mesa/{mesa}:
 *   get:
 *     summary: Obtiene los pedidos activos de una mesa
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: mesa
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de la mesa
 *     responses:
 *       200:
 *         description: Lista de pedidos de la mesa
 *       500:
 *         description: Error del servidor
 */
router.get("/mesa/:mesa", authMiddleware, pedidoController.buscarPorMesa);

/**
 * @swagger
 * /api/pedidos/modificar:
 *   put:
 *     summary: Modifica un pedido existente (actualiza productos, stock y total)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - mesa
 *               - productos
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID del pedido a modificar
 *                 example: 69
 *               mesa:
 *                 type: string
 *                 example: "4"
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platoId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 3
 *                     aclaracion:
 *                       type: string
 *                       example: "Modificado"
 *     responses:
 *       200:
 *         description: Pedido modificado correctamente
 *       201:
 *         description: Pedido recreado con éxito
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *       404:
 *         description: Pedido no encontrado
 */
router.put("/modificar", authMiddleware, pedidoController.modificar);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Elimina un pedido y restaura el stock de los productos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido a eliminar
 *     responses:
 *       200:
 *         description: Pedido eliminado y stock restaurado
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", authMiddleware, pedidoController.eliminar);

module.exports = router;