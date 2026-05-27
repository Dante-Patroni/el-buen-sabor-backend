const express = require("express");
const router = express.Router();

const CajaController = require("../controllers/cajaController");
const MesaService = require("../services/mesaService");
const PedidoService = require("../services/pedidoService");
const PlatoService = require("../services/platoService");
const FacturacionService = require("../services/facturacionService");
const CajaService = require("../services/cajaService");
const SequelizeMesaRepository = require("../repositories/sequelize/sequelizeMesaRepository");
const SequelizePedidoRepository = require("../repositories/sequelize/sequelizePedidoRepository");
const SequelizePlatoRepository = require("../repositories/sequelize/sequelizePlatoRepository");
const soloRoles = require("../middlewares/roleMiddleware").soloRoles;
const authMiddleware = require("../middlewares/authMiddleware");

const mesaRepository = new SequelizeMesaRepository();
const pedidoRepository = new SequelizePedidoRepository();
const platoRepository = new SequelizePlatoRepository();
const platoService = new PlatoService(platoRepository);
const mesaService = new MesaService(mesaRepository, pedidoRepository);
const pedidoService = new PedidoService(pedidoRepository, platoService, mesaService);
const facturacionService = new FacturacionService(pedidoRepository);
const cajaService = new CajaService(mesaService, pedidoService, facturacionService);
const cajaController = new CajaController(cajaService);

/**
 * @swagger
 * tags:
 *   name: Caja
 *   description: Operaciones de caja y cierre de mesa
 */

/**
 * @swagger
 * /api/caja/mesas:
 *   get:
 *     summary: Lista mesas visibles para caja
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas para caja
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Rol no permitido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/mesas", authMiddleware, soloRoles("cajero", "admin"), cajaController.listarMesas);

/**
 * @swagger
 * /api/caja/mesas/{id}:
 *   get:
 *     summary: Obtiene el detalle de una mesa para caja
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Detalle de mesa para caja
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Rol no permitido
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/mesas/:id", authMiddleware, soloRoles("cajero", "admin"), cajaController.obtenerMesa);

/**
 * @swagger
 * /api/caja/mesas/{id}/ticket:
 *   get:
 *     summary: Genera el ticket de cierre de mesa sin cerrar la mesa
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Ticket de cierre de mesa
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Rol no permitido
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/mesas/:id/ticket", authMiddleware, soloRoles("cajero", "admin"), cajaController.obtenerTicket);

/**
 * @swagger
 * /api/caja/mesas/{id}/cobrar:
 *   post:
 *     summary: Cobra y cierra una mesa
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mesa a cobrar
 *     responses:
 *       200:
 *         description: Mesa cobrada y cerrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Rol no permitido
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/mesas/:id/cobrar", authMiddleware, soloRoles("cajero", "admin"), cajaController.cobrarMesa);

module.exports = router;
