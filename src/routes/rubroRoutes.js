const express = require('express');
const router = express.Router();


const SequelizeRubroRepository = require("../repositories/sequelize/sequelizeRubroRepository");
const RubroService = require("../services/rubroService");
const RubroController = require('../controllers/rubroController');
const authMiddleware = require("../middlewares/authMiddleware");

// 👇 INYECCIÓN CORRECTA
const rubroRepository = new SequelizeRubroRepository();
const rubroService = new RubroService(rubroRepository);
const rubroController = new RubroController(rubroService);

/**
 * @swagger
 * tags:
 *   name: Rubros
 *   description: Gestión de categorías del menú
 */


/**
 * @swagger
 * /api/rubros:
 *   get:
 *     summary: Obtener el árbol jerárquico de rubros
 *     tags: [Rubros]
 *     responses:
 *       200:
 *         description: Lista de rubros obtenida correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', rubroController.listarJerarquia);


/**
 * @swagger
 * /api/rubros:
 *   post:
 *     summary: Crear un nuevo rubro o reactivarlo
 *     tags: [Rubros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - denominacion
 *             properties:
 *               denominacion:
 *                 type: string
 *                 example: "Bebidas"
 *               padreId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Rubro creado correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
router.post('/', rubroController.crear);


/**
 * @swagger
 * /api/rubros/{id}:
 *   put:
 *     summary: Actualizar un rubro existente
 *     tags: [Rubros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - denominacion
 *             properties:
 *               denominacion:
 *                 type: string
 *                 example: "Bebidas sin alcohol"
 *               padreId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Rubro actualizado correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Rubro no encontrado
 *       500:
 *         description: Error interno
 */
router.put('/:id', rubroController.actualizar);


/**
 * @swagger
 * /api/rubros/{id}:
 *   delete:
 *     summary: Eliminar lógicamente un rubro
 *     tags: [Rubros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rubro eliminado correctamente
 *       400:
 *         description: No se puede eliminar
 *       404:
 *         description: Rubro no encontrado
 *       500:
 *         description: Error interno
 */
router.delete('/:id', rubroController.eliminar);

module.exports = router;