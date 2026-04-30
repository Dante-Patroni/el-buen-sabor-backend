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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 8821
 *                       mesa:
 *                         type: string
 *                         example: "12"
 *                       cliente:
 *                         type: string
 *                         example: "Roberto G."
 *                       estado:
 *                         type: string
 *                         example: "nuevo"
 *                       hora:
 *                         type: string
 *                         example: "12:24:31"
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             nombre:
 *                               type: string
 *                               example: "Hamburguesa Doble"
 *                             cantidad:
 *                               type: integer
 *                               example: 2
 *                             aclaracion:
 *                               type: string
 *                               example: "Sin cebolla"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/pedidos", /*authMiddleware*/ cocinaController.listarPendientes);

module.exports = router;