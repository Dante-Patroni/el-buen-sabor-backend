 const { manejarErrorHttp } = require("../controllers/errorMapper");

/**
 * @description Crea un middleware que permite el acceso solo a ciertos roles.
 * @param {...string} rolesPermitidos - Roles autorizados para la ruta.
 * @returns {import("express").RequestHandler} Middleware de autorización por rol.
 */
const soloRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return manejarErrorHttp(new Error("NO_AUTORIZADO"), res);
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return manejarErrorHttp(new Error("SOLO_ROL_PERMITIDO"), res);
    }

    next();
  };
};

module.exports = {
  soloRoles,
};
