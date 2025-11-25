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
 *               - cliente
 *               - platoId
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Dante Patroni"
 *               platoId:
 *                 type: integer
 *                 description: ID del plato a pedir
 *                 example: 1
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Faltan datos obligatorios
 *       404:
 *         description: Plato no encontrado
 *       409:
 *         description: Stock insuficiente (Conflicto)
 *       500:
 *         description: Error del servidor
 */



// RUTA: POST http://localhost:3000/api/pedidos
// Descripción: Crea un nuevo pedido validando stock
router.post('/', (req, res) => PedidoController.crear(req, res));

module.exports = router;