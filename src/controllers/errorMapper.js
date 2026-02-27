const ERROR_HTTP_MAP = {
  // 400
  DATOS_INVALIDOS: 400,
  NOMBRE_REQUERIDO: 400,
  APELLIDO_REQUERIDO: 400,
  LEGAJO_REQUERIDO: 400,
  PASSWORD_REQUERIDA: 400,
  ROL_INVALIDO: 400,
  USUARIO_YA_INACTIVO: 400,
  MOZO_REQUERIDO: 400,
  MESA_YA_OCUPADA: 400,
  MESA_YA_LIBRE: 400,
  MESA_NO_OCUPADA: 400,
  DENOMINACION_REQUERIDA: 400,
  PADRE_INVALIDO: 400,
  NO_SE_PERMITE_TERCER_NIVEL: 400,
  RUBRO_INACTIVO: 400,
  RUBRO_YA_INACTIVO: 400,
  RUBRO_TIENE_SUBRUBROS: 400,
  RUBRO_TIENE_PLATOS: 400,
  NOMBRE_DEMASIADO_LARGO: 400,
  PRECIO_REQUERIDO: 400,
  PRECIO_INVALIDO: 400,
  RUBRO_REQUERIDO: 400,
  DESCRIPCION_DEMASIADO_LARGA: 400,
  STOCK_REQUERIDO: 400,
  STOCK_INVALIDO: 400,
  MESA_NO_PROPORCIONADA: 400,
  PRODUCTOS_INVALIDOS: 400,
  PEDIDO_ID_INVALIDO: 400,
  SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES: 400,
  SOLO_SE_PUEDEN_MODIFICAR_PEDIDOS_PENDIENTES: 400,
  NO_SE_PUEDE_MODIFICAR_PEDIDO_PAGADO: 400,
  ESTADO_PAGADO_SOLO_DESDE_CIERRE_DE_MESA: 400,
  TRANSICION_ESTADO_INVALIDA: 400,
  PLATO_ID_INVALIDO: 400,
  CANTIDAD_INVALIDA: 400,
  NO_SE_PUEDE_CREAR_PEDIDO_EN_MESA_LIBRE: 400,
  STOCK_INSUFICIENTE: 400,
  NO_SE_ENVIO_IMAGEN: 400,
  TIPO_ARCHIVO_INVALIDO: 400,
  ARCHIVO_DEMASIADO_GRANDE: 400,

  // 401
  NO_AUTORIZADO: 401,
  TOKEN_INVALIDO: 401,
  PASSWORD_INCORRECTA: 401,

  // 403
  SOLO_ADMIN: 403,
  USUARIO_INACTIVO: 403,

  // 404
  USUARIO_NO_ENCONTRADO: 404,
  MESA_NO_ENCONTRADA: 404,
  RUBRO_NO_EXISTE: 404,
  PEDIDO_NO_ENCONTRADO: 404,
  PLATO_NO_ENCONTRADO: 404,

  // 409
  LEGAJO_YA_EXISTENTE: 409,
  RUBRO_YA_EXISTE: 409,
  PRODUCTO_YA_EXISTE: 409,
  CONFLICTO_DE_DATOS: 409,

};

/**
 * @description Obtiene un codigo de dominio estable a partir de un error recibido.
 * @param {Error|undefined|null} error - Error original lanzado por service/repository/middleware.
 * @returns {string} Codigo de dominio normalizado.
 */
function obtenerCodigoError(error) {
  if (!error) return "ERROR_INTERNO";

  // Soporte para errores de Sequelize sin mapear de forma explícita.
  if (error.name === "SequelizeUniqueConstraintError") {
    return "CONFLICTO_DE_DATOS";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return "ERROR_INTERNO";
}

/**
 * @description Mapea un error de dominio al status HTTP y responde el JSON estandar del proyecto.
 * @param {Error|{message?: string, details?: Array}|undefined|null} error - Error a traducir.
 * @param {import("express").Response} res - Response de Express.
 * @returns {import("express").Response} Respuesta HTTP con el formato `{ error }` o `{ error, details }`.
 */
function manejarErrorHttp(error, res) {
  const codigo = obtenerCodigoError(error);
  const status = ERROR_HTTP_MAP[codigo] || 500;

  if (status === 500) {
    console.error(error);
    return res.status(500).json({ error: "ERROR_INTERNO" });
  }

  const body = { error: codigo };
  if (Array.isArray(error?.details) && error.details.length > 0) {
    body.details = error.details;
  }

  return res.status(status).json(body);
}

module.exports = {
  ERROR_HTTP_MAP,
  manejarErrorHttp,
};
