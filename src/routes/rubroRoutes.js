const express = require('express');
const router = express.Router();
const rubroController = require('../controllers/rubroController');

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
 *     description: Retorna los Rubros Padres (ej. Cocina) con sus Sub-rubros (ej. Hamburguesas) anidados.
 *     responses:
 *       200:
 *         description: Lista de rubros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   denominacion:
 *                     type: string
 *                     example: "Cocina"
 *                   subrubros:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 4
 *                         denominacion:
 *                           type: string
 *                           example: "Hamburguesas"
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', rubroController.listarJerarquia);

module.exports = router;