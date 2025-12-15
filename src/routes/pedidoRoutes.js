const express = require("express");
const router = express.Router();

// 1. Importamos las CLASES (No instancias)
const PedidoService = require("../services/pedidoService");
const PedidoController = require("../controllers/pedidoController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validarPedido } = require('../middlewares/pedidoValidator');

// 2. Instanciamos e Inyectamos (¡AQUÍ ESTÁ LA CLAVE!)
// Primero creamos el servicio...
const pedidoService = new PedidoService();

// ... y luego SE LO PASAMOS al controlador dentro del paréntesis.
// Si el paréntesis está vacío (), this.pedidoService será undefined.
const pedidoController = new PedidoController(pedidoService);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []  # Requiere token
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
 *         description: Error de validación (Faltan datos o formato incorrecto)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: "El pedido debe tener al menos un producto"
 *       401:
 *         description: No autorizado (Falta token)
 *       500:
 *         description: Error interno del servidor
 */

// 1. CREAR (POST) -> Llama a PedidoController.crear
router.post("/", authMiddleware, validarPedido, pedidoController.crear);
/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtiene el historial de pedidos
 *     tags:
 *       - Pedidos
 *     description: Retorna una lista de todos los pedidos ordenados por fecha.
 *     responses:
 *       200:
 *         description: Lista de pedidos recuperada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor
 */
// 3. LISTAR (GET) - Opcional: ¿Quieres que cualquiera vea la lista o solo el mozo?
// Por ahora la dejaremos pública para facilitar pruebas, pero idealmente también lleva authMiddleware.
router.get("/", authMiddleware, pedidoController.listar);
/**
/**
 * @swagger
 * /api/pedidos/mesa/{mesa}:
 *   get:
 *     summary: Obtiene el historial de pedidos activos de una mesa específica
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: mesa
 *         schema:
 *           type: string
 *         required: true
 *         description: Número o ID de la mesa
 *     responses:
 *       200:
 *         description: Lista de pedidos de la mesa
 *       500:
 *         description: Error del servidor
 */
router.get("/mesa/:mesa", authMiddleware, pedidoController.buscarPorMesa);
// ---------------------------------------------------------
// DELETE /api/pedidos/{id} (Eliminar) - ¡NUEVO! 🆕
// ---------------------------------------------------------
/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Elimina un pedido y restaura el stock
 *     tags:
 *       - Pedidos
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
// 3. ELIMINAR (DELETE) -> Llama a PedidoController.eliminar
// Fíjate en el ':id'. Eso es un Parámetro de Ruta.
router.delete("/:id", authMiddleware, pedidoController.eliminar);


module.exports = router;
