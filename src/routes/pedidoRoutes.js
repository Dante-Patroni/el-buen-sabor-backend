const express = require("express");
const router = express.Router();
const PedidoController = require("../controllers/pedidoController");

// 👇 1. IMPORTAMOS AL GUARDIA DE SEGURIDAD
const authMiddleware = require("../middlewares/authMiddleware");

// Instanciamos el controlador
const pedidoController = new PedidoController();

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags:
 *       - Pedidos
 *     description: Valida stock con el sistema Legacy y crea el pedido si es posible.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mesa
 *               - platoId
 *             properties:
 *               mesa:
 *                 type: string
 *                 description: Número de mesa (OBLIGATORIO)
 *                 example: "5"
 *               platoId:
 *                 type: integer
 *                 description: ID del plato a pedir (OBLIGATORIO)
 *                 example: 1
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente (OPCIONAL)
 *                 example: "Dante Patroni"
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
// 1. CREAR (POST) -> Llama a PedidoController.crear
router.post("/", authMiddleware, (req, res) => pedidoController.crear(req, res));

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
router.get("/", (req, res) => pedidoController.listar(req, res));

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
//:mesa con dos puntos, lo que significa que es un parámetro variable (puede ser 4, 8, 10, etc.)
router.get('/mesa/:mesa', pedidoController.buscarPorMesa.bind(pedidoController));

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
router.delete("/:id", authMiddleware, (req, res) => pedidoController.eliminar(req, res));



module.exports = router;
