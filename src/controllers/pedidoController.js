const PedidoService = require('../services/pedidoService');

class PedidoController {

    async crear(req, res) {
        try {
            // 1. Extraer datos del Body
            const { cliente, platoId } = req.body;

            // Validación básica de entrada (Sanity Check)
            if (!cliente || !platoId) {
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios: se requiere 'cliente' y 'platoId'." 
                });
            }

            // 2. Invocar al Servicio (Aquí ocurre la magia de validación de Stock)
            const pedidoCreado = await PedidoService.crearYValidarPedido(cliente, platoId);

            // 3. Responder Éxito (201 Created)
            res.status(201).json({
                mensaje: "Pedido creado exitosamente",
                data: pedidoCreado
            });

        } catch (error) {
            console.error("Error en PedidoController:", error.message);

            // Manejo de errores específicos del negocio
            if (error.message === 'STOCK_INSUFICIENTE') {
                return res.status(409).json({ // 409 Conflict
                    error: "No se puede procesar el pedido: Stock insuficiente del ingrediente principal."
                });
            }
            
            if (error.message === 'PLATO_NO_ENCONTRADO') {
                return res.status(404).json({ // 404 Not Found
                    error: "El plato solicitado no existe en el menú."
                });
            }

            // Error genérico
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new PedidoController();