const express = require("express");
const router = express.Router();

const MesaService = require("../services/mesaService");
const FacturacionService = require("../services/facturacionService");
const MesaController = require("../controllers/mesaController");
const authMiddleware = require("../middlewares/authMiddleware");
const { soloPermisos } = require("../middlewares/roleMiddleware"); // 🆕
const SequelizeMesaRepository = require("../repositories/sequelize/sequelizeMesaRepository");
const SequelizePedidoRepository = require("../repositories/sequelize/sequelizePedidoRepository");
const pedidoEmitter = require("../events/pedidoEvents");

const mesaRepository = new SequelizeMesaRepository();
const pedidoRepository = new SequelizePedidoRepository();
const facturacionService = new FacturacionService(pedidoRepository);
const mesaService = new MesaService(
  mesaRepository,
  pedidoRepository,
  facturacionService,
  pedidoEmitter
);
const mesaController = new MesaController(mesaService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Mesa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         numero:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [libre, ocupada]
 *         totalActual:
 *           type: number
 *           format: float
 *         mozo:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *       example:
 *         id: 1
 *         numero: "4"
 *         estado: ocupada
 *         totalActual: 1500.50
 *         mozo:
 *           nombre: "Dante"
 *           apellido: "Patroni"
 */

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     summary: Obtiene el estado actual de todas las mesas
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas obtenida correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       500:
 *         description: Error al obtener las mesas
 */
router.get("/", authMiddleware, soloPermisos("MESA_VER"), mesaController.listar);

/**
 * @swagger
 * /api/mesas/{id}/abrir:
 *   post:
 *     summary: Ocupa una mesa y asigna un mozo
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mesa a abrir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idMozo
 *             properties:
 *               idMozo:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Mesa abierta exitosamente
 *       400:
 *         description: Datos faltantes o mesa ya ocupada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.post("/:id/abrir", authMiddleware, soloPermisos("MESA_ABRIR"), mesaController.abrirMesa);

/**
 * @swagger
 * /api/mesas/{id}/cerrar:
 *   post:
 *     summary: Cierra una mesa y libera su estado
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mesa a cerrar
 *     responses:
 *       200:
 *         description: Mesa cerrada correctamente
 *       400:
 *         description: La mesa ya está libre
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.post("/:id/cerrar", authMiddleware, soloPermisos("MESA_CERRAR"), mesaController.cerrarMesa);

/**
 * @swagger
 * /api/mesas/{id}/solicitar-cobro:
 *   post:
 *     summary: El mozo solicita el cobro de una mesa
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mesa
 *     responses:
 *       200:
 *         description: Cobro solicitado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.post("/:id/solicitar-cobro", authMiddleware, soloPermisos("SOLICITAR_COBRO"), mesaController.solicitarCobro);

module.exports = router;