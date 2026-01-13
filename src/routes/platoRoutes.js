const express = require("express");
const router = express.Router();

const SequelizePlatoRepository = require("../repositories/sequelize/sequelizePlatoRepository");
const PlatoService = require("../services/platoService");
const PlatoController = require("../controllers/platoController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// 👇 INYECCIÓN CORRECTA
const platoRepository = new SequelizePlatoRepository();
const platoService = new PlatoService(platoRepository);
const platoController = new PlatoController(platoService);

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
 *         description: Lista de platos
 */
// GET: Listar (Público)
router.get("/", (req, res) => platoController.listarMenuCompleto(req, res));

/**
 * @swagger
 * /api/platos:
 *   post:
 *     summary: Crear un nuevo plato
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               rubroId:
 *                 type: integer
 *               esMenuDelDia:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Plato creado exitosamente
 */
// POST: Crear (Privado - Requiere Token) - 🚨 AQUÍ ESTABA EL FALTANTE
router.post("/", authMiddleware, (req, res) => platoController.crearNuevoProducto(req, res));

/**
 * @swagger
 * /api/platos/{id}:
 *   put:
 *     summary: Editar un plato (Precio, Menú del día)
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precio:
 *                 type: number
 *               esMenuDelDia:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Plato actualizado
 */
// PUT: Editar (Privado - Requiere Token)
router.put("/:id", authMiddleware, (req, res) => platoController.modificarProducto(req, res));

/**
 * @swagger
 * /api/platos/{id}/imagen:
 *   post:
 *     summary: Sube una foto para un plato
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 */
// POST Imagen: Subir foto (Privado)
router.post("/:id/imagen", authMiddleware, upload.single("imagen"), (req, res) => platoController.cargarImagenProducto(req, res));

module.exports = router;