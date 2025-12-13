const express = require("express");
const router = express.Router();

// 1. Importamos las Clases
const PlatoService = require("../services/platoService");
const PlatoController = require("../controllers/platoController");

// 2. Instanciamos e Inyectamos (Dependency Injection)
const platoService = new PlatoService();
const platoController = new PlatoController(platoService);

const upload = require("../middlewares/upload"); // [B] Importamos el middleware

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
 *     summary: Obtiene el menú completo con estado de stock
 *     tags: [Platos]
 *     responses:
 *       200:
 *         description: Lista de platos con imágenes y stock
 */
router.get("/", platoController.listar);

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
router.post("/:id/imagen", upload.single("imagen"), platoController.subirImagen);


module.exports = router;
