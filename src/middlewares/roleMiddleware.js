// src/middlewares/roleMiddleware.js
const { manejarErrorHttp } = require("../controllers/errorMapper");

/**
 * @description Fábrica de middleware que verifica si el usuario autenticado
 * posee al menos uno de los permisos requeridos.
 *
 * Los permisos vienen del JWT decodificado por authMiddleware (req.usuario.permisos).
 *
 * @param {...string} permisosRequeridos - Uno o más códigos de permiso (ej: "PLATO_CREAR", "USUARIO_VER").
 * @returns {import("express").RequestHandler} Middleware de autorización.
 *
 * @example
 * // Requiere exactamente este permiso:
 * router.post("/", authMiddleware, soloPermisos("PLATO_CREAR"), controller.crear);
 *
 * @example
 * // Requiere cualquiera de estos permisos:
 * router.get("/", authMiddleware, soloPermisos("PLATO_VER", "USUARIO_VER"), controller.listar);
 */
const soloPermisos = (...permisosRequeridos) => {
  return (req, res, next) => {
    const permisosUsuario = req.usuario?.permisos ?? [];

    const tienePermiso = permisosRequeridos.some((permiso) =>
      permisosUsuario.includes(permiso)
    );

    if (!tienePermiso) {
      return manejarErrorHttp(new Error("PROHIBIDO"), res);
    }

    next();
  };
};

/**
 * @description Conservado por compatibilidad con rutas existentes.
 * Preferir `soloPermisos` para nuevas rutas.
 * @deprecated Usar soloPermisos en su lugar.
 */
const soloRoles = (...roles) => {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;

    if (!roles.includes(rolUsuario)) {
      return manejarErrorHttp(new Error("PROHIBIDO"), res);
    }

    next();
  };
};

module.exports = { soloPermisos, soloRoles };