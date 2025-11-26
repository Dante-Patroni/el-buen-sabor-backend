const PedidoService = require('../services/pedidoService');
const StockAdapter = require('../adapters/MongoStockAdapter'); 

class PedidoController {

    constructor() {
        // Inyección de dependencias
        this.stockAdapter = new StockAdapter();
        this.pedidoService = new PedidoService(this.stockAdapter);
    }

    async crear(req, res) {
        try {
            // 1. Extraer datos del Body
            // El JSON que envías desde Swagger tiene "platoId" (minúscula)
            const { cliente, platoId } = req.body; 

            // Validación básica
            // 🔴 CORREGIDO: Usamos "platoId" (la variable que acabamos de crear arriba)
            if (!cliente || !platoId) {
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios: se requiere 'cliente' y 'platoId'." 
                });
            }

            // 2. Invocar al Servicio 
            // 🔴 CORREGIDO: Pasamos "platoId" (minúscula). 
            // El Servicio se encargará de guardarlo como "PlatoId" en la BD.
            const pedidoCreado = await this.pedidoService.crearYValidarPedido(cliente, platoId);

            // 3. Responder Éxito
            res.status(201).json({
                mensaje: "Pedido creado exitosamente",
                data: pedidoCreado
            });

        } catch (error) {
            console.error("Error en PedidoController:", error.message);

            if (error.message === 'STOCK_INSUFICIENTE') {
                return res.status(409).json({
                    error: "No se puede procesar el pedido: Stock insuficiente (Verificado en Mongo Atlas)."
                });
            }
            
            if (error.message === 'PLATO_NO_ENCONTRADO') {
                return res.status(404).json({
                    error: "El plato solicitado no existe en el menú."
                });
            }

            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new PedidoController();