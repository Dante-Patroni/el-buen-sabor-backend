const express = require('express');
const router = express.Router();
const PlatoController = require('../controllers/platoController');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Platos
 *   description: Gestión del menú y fotos
 */

/**
 * @swagger
 * /api/platos:
 *   get:
 *     summary: Obtiene el menú completo
 *     tags: [Platos]
 *     responses:
 *       200:
 *         description: Lista de platos con imágenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   imagenUrl:
 *                     type: string
 */
router.get('/', (req, res) => PlatoController.listar(req, res));

/**
 * @swagger
 * /api/platos/{id}/imagen:
 *   post:
 *     summary: Sube una foto para un plato
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plato
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *       400:
 *         description: No se envió imagen
 *       404:
 *         description: Plato no encontrado
 */
router.post('/:id/imagen', upload.single('imagen'), (req, res) => PlatoController.subirImagen(req, res));

module.exports = router;