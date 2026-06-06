// src/routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");
const SequelizeUsuarioRepository = require("../repositories/sequelize/sequelizeUsuarioRepository");
const UsuarioService = require("../services/usuarioService");
const authMiddleware = require("../middlewares/authMiddleware");
const { soloPermisos } = require("../middlewares/roleMiddleware"); // 🆕
const { limitadorLogin } = require("../middlewares/rateLimitMiddleware");

// Composicion de dependencias (DI manual): Router -> Controller -> Service -> Repository.
const usuarioRepository = new SequelizeUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Password incorrecta
 *       403:
 *         description: Usuario inactivo
 *       404:
 *         description: Usuario no encontrado
 *       429:
 *         description: Demasiados intentos, bloqueado temporalmente
 */
router.post("/login", limitadorLogin, usuarioController.login);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista usuarios
 *     tags: [Usuarios]
 */
router.get("/", authMiddleware, soloPermisos("USUARIO_VER"), usuarioController.listar);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 */
router.get("/:id", authMiddleware, soloPermisos("USUARIO_VER"), usuarioController.obtenerPorId);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un usuario
 *     tags: [Usuarios]
 */
router.post("/", authMiddleware, soloPermisos("USUARIO_CREAR"), usuarioController.crear);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Usuarios]
 */
router.put("/:id", authMiddleware, soloPermisos("USUARIO_MODIFICAR"), usuarioController.actualizar);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Baja lógica de usuario
 *     tags: [Usuarios]
 */
router.delete("/:id", authMiddleware, soloPermisos("USUARIO_ELIMINAR"), usuarioController.eliminar);

module.exports = router;