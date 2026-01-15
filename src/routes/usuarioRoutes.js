const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/usuarioController');
const SequelizeUsuarioRepository = require("../repositories/sequelize/sequelizeUsuarioRepository");
const UsuarioService = require("../services/usuarioService");
const authMiddleware = require("../middlewares/authMiddleware");

// 👇 INYECCIÓN CORRECTA
const usuarioRepository = new SequelizeUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de autentificación de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión en el sistema (Mozo, Cocinero, Admin)
 *     description: Verifica credenciales (legajo y contraseña) y devuelve los datos del usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - legajo
 *               - password
 *             properties:
 *               legajo:
 *                 type: string
 *                 description: Legajo del empleado
 *                 example: "1001"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Login exitoso"
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Dante"
 *                     apellido:
 *                       type: string
 *                       example: "Patroni"
 *                     rol:
 *                       type: string
 *                       enum: [admin, mozo, cocinero, cajero]
 *                       example: "mozo"
 *       401:
 *         description: Usuario no encontrado (Legajo inexistente)
 *       500:
 *         description: Error del servidor
 */

// Definimos la ruta POST para login
router.post('/login', (req, res) => usuarioController.login(req, res));

module.exports = router;
 