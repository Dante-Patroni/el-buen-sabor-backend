const express = require("express");
const router  = express.Router();

const { pedidoService } = require("../container");
const CocinaController  = require("../controllers/cocinaController");
const authMiddleware    = require("../middlewares/authMiddleware");

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
 *       500:
 *         description: Error interno del servidor
 */
router.get("/pedidos", authMiddleware, cocinaController.listarPendientes);

module.exports = router;