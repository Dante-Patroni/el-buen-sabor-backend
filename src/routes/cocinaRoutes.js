const express = require("express");
const router  = express.Router();

const { pedidoService } = require("../container");
const CocinaController  = require("../controllers/cocinaController");
const authMiddleware    = require("../middlewares/authMiddleware");
const { soloPermisos }  = require("../middlewares/roleMiddleware"); // 🆕

const cocinaController = new CocinaController(pedidoService);

/**
 * @swagger
 * /api/cocina/pedidos:
 *   get:
 *     summary: Lista pedidos pendientes para el monitor de cocina
 *     tags: [Cocina]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado formateado para cocina
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/pedidos", authMiddleware, soloPermisos("PEDIDO_VER"), cocinaController.listarPendientes);

/**
 * @swagger
 * /api/cocina/pedidos/{id}/estado:
 *   patch:
 *     summary: Cambia el estado de un pedido desde cocina
 *     tags: [Cocina]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "en_preparacion"
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/pedidos/:id/estado", authMiddleware, soloPermisos("PEDIDO_CAMBIAR_ESTADO"), cocinaController.cambiarEstado);

module.exports = router;