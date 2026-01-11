const express = require("express");
const router = express.Router();

// 1. Importamos Clases
const MesaService = require("../services/mesaService");
const MesaController = require("../controllers/mesaController");
const authMiddleware = require("../middlewares/authMiddleware");
const SequelizeMesaRepository = require("../repositories/sequelize/sequelizeMesaRepository");

// 1. Instanciamos Repositorio
const mesaRepository = new SequelizeMesaRepository();
const mesaService = new MesaService(mesaRepository);
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
 *           description: ID único de la mesa
 *         numero:
 *           type: string
 *           description: Número o nombre visual de la mesa
 *         estado:
 *           type: string
 *           enum: [libre, ocupada]
 *         totalActual:
 *           type: number
 *           format: float
 *           description: Monto acumulado de los pedidos
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
 *     responses:
 *       200:
 *         description: Lista de mesas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   nombre:
 *                     type: string
 *                     example: "Mesa 4"
 *                   estado:
 *                     type: string
 *                     enum: [libre, ocupada]
 *                     example: "ocupada"
 *                   totalActual:
 *                     type: number
 *                     description: Total acumulado en la mesa
 *                     example: 1500.00
 *       500:
 *         description: Error al obtener las mesas
 */

// Definimos la ruta GET raíz (/)
// Esto responderá cuando alguien llame a: http://localhost:3000/api/mesas
router.get("/", authMiddleware, mesaController.listar);
/**
 * @swagger
 * /api/mesas/{id}/abrir:
 *   post:
 *     summary: Ocupa una mesa y asigna un mozo
 *     description: Cambia el estado de la mesa a 'ocupada' y guarda la relación con el Mozo.
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
 *                 description: ID del usuario (Mozo) que abre la mesa
 *                 example: 5
 *     responses:
 *       200:
 *         description: Mesa abierta exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mesa abierta con éxito"
 *                 mesa:
 *                   $ref: '#/components/schemas/Mesa'
 *       400:
 *         description: Datos faltantes (idMozo) o mesa ya ocupada
 *       404:
 *         description: Mesa no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.post("/:id/abrir", authMiddleware, mesaController.abrirMesa);


module.exports = router;
 