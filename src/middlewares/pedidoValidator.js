const { check, validationResult } = require('express-validator');

// Reglas de validación para CREAR un pedido
const validarPedido = [
    check('mesa')
        .notEmpty().withMessage('El número de mesa es obligatorio')
        .isString(),
    
    check('cliente')
        .optional()
        .isString(),

    check('productos') // Esperamos un array de productos
        .isArray({ min: 1 }).withMessage('El pedido debe tener al menos un producto'),
    
    // Middleware para atrapar los errores
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            // Si hay errores, devolvemos 400 (Bad Request) y la lista de fallos
            return res.status(400).json({ errores: errores.array() });
        }
        next(); // Si todo está bien, pasa al Controller
    }
];

module.exports = { validarPedido };