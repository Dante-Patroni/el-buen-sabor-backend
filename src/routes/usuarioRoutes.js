const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuarioController");
const SequelizeUsuarioRepository = require("../repositories/sequelize/sequelizeUsuarioRepository");
const UsuarioService = require("../services/usuarioService");
const authMiddleware = require("../middlewares/authMiddleware");

// Composicion de dependencias (DI manual): Router -> Controller -> Service -> Repository.
const usuarioRepository = new SequelizeUsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

// Middleware de autorizacion por rol para endpoints ABM.
const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({ error: "SOLO_ADMIN" });
  }
  next();
};

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
 */
// Login se mantiene publico para obtener JWT.
router.post("/login", usuarioController.login);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista usuarios (solo admin)
 *     tags: [Usuarios]
 */
// A partir de aca, todas son rutas protegidas y solo para admin.
router.get("/", authMiddleware, soloAdmin, usuarioController.listar);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID (solo admin)
 *     tags: [Usuarios]
 */
router.get("/:id", authMiddleware, soloAdmin, usuarioController.obtenerPorId);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un usuario (solo admin)
 *     tags: [Usuarios]
 */
router.post("/", authMiddleware, soloAdmin, usuarioController.crear);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario (solo admin)
 *     tags: [Usuarios]
 */
router.put("/:id", authMiddleware, soloAdmin, usuarioController.actualizar);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Baja lógica de usuario (solo admin)
 *     tags: [Usuarios]
 */
router.delete("/:id", authMiddleware, soloAdmin, usuarioController.eliminar);

module.exports = router;
