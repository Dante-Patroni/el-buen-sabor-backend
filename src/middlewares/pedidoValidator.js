const { check, validationResult } = require('express-validator');

// Reglas de validación para CREAR un pedido
const validarPedido = [
    check('mesa')
        .notEmpty().withMessage('La mesa es obligatoria')
        .isString(),
    
    check('cliente')
        .optional()
        .isString(),

    check('productos')
        .isArray({ min: 1 }).withMessage('Debes enviar al menos un producto'),
    
    // Validación profunda de cada item del array
    check('productos.*.platoId')
        .isInt({ min: 1 }).withMessage('El platoId debe ser un número entero positivo'),

    check('productos.*.cantidad')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
    
    check('productos.*.aclaracion')
        .optional()
        .isString().withMessage('La aclaración debe ser texto'),
    
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