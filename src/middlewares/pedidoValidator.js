const { check, validationResult, param, body } = require("express-validator");

// ======================================================
// Middleware genérico para manejar errores de validación
// ======================================================
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  next();
};

// ======================================================
// VALIDACIÓN: CREAR PEDIDO
// ======================================================
const validarPedido = [
  check("mesa")
    .notEmpty().withMessage("La mesa es obligatoria")
    .isString().withMessage("La mesa debe ser texto"),

  check("cliente")
    .optional()
    .isString().withMessage("El cliente debe ser texto"),

  check("productos")
    .isArray({ min: 1 })
    .withMessage("Debes enviar al menos un producto"),

  check("productos.*.platoId")
    .isInt({ min: 1 })
    .withMessage("El platoId debe ser un número entero positivo"),

  check("productos.*.cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser al menos 1"),

  check("productos.*.aclaracion")
    .optional()
    .isString().withMessage("La aclaración debe ser texto"),

  manejarErroresValidacion,
];

// ======================================================
// VALIDACIÓN: BUSCAR PEDIDOS POR MESA
// ======================================================
const validarMesaParam = [
  param("mesa")
    .notEmpty().withMessage("El número de mesa es obligatorio")
    .isInt({ min: 1 }).withMessage("La mesa debe ser un número válido")
    .toInt(),

  manejarErroresValidacion,
];

// ======================================================
// VALIDACIÓN: CERRAR MESA
// ======================================================
const validarCerrarMesa = [
  body("mesaId")
    .notEmpty().withMessage("mesaId es obligatorio")
    .isInt({ min: 1 }).withMessage("mesaId inválido"),

  manejarErroresValidacion,
];

// ✅ EXPORT CORRECTO
module.exports = {
  validarPedido,
  validarMesaParam,
  validarCerrarMesa,
};
