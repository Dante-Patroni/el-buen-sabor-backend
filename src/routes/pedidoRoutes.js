const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/pedidoController');

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
router.post('/', (req, res) => PedidoController.crear(req, res));

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
// 2. LISTAR (GET) -> Llama a PedidoController.listar
router.get('/', (req, res) => PedidoController.listar(req, res));

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
router.delete('/:id', (req, res) => PedidoController.eliminar(req, res));

module.exports = router;