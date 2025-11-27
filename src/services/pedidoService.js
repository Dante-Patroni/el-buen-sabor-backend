const { Pedido } = require('../models'); 
// 1. IMPORTAMOS EL EMISOR 📢
const pedidoEmitter = require('../events/pedidoEvents');

class PedidoService {

    // 1. Recibimos el adaptador en el constructor (Inyección de Dependencias)
    constructor(stockAdapter) {
        this.stockAdapter = stockAdapter;
    }

    async crearYValidarPedido(cliente, platoId) {
        // ---------------------------------------------------------
        // PASO 1: Verificar Stock (Usando el Adaptador Inyectado)
        // ---------------------------------------------------------
        // Nota: Usamos "this.stockAdapter" en lugar de la clase estática.
        // Además, usamos "obtenerStock(platoId)" que es el método de nuestro MongoAdapter.
        
        const stockActual = await this.stockAdapter.obtenerStock(platoId);
        console.log(`Debug: Stock actual para plato ${platoId} en Mongo: ${stockActual}`);

        // Validación de Negocio
        if (stockActual <= 0) {
            throw new Error('STOCK_INSUFICIENTE');
        }

        // ---------------------------------------------------------
        // PASO 2: Descontar Stock (Actualizar Mongo)
        // ---------------------------------------------------------
        await this.stockAdapter.descontarStock(platoId, 1);

        // ---------------------------------------------------------
        // PASO 3: Crear el Pedido (Persistir en MySQL)
        // ---------------------------------------------------------
       // 3. Crear Pedido en MySQL
        const nuevoPedido = await Pedido.create({
            cliente: cliente,     
            PlatoId: platoId,     
            fecha: new Date(),
            estado: 'en_preparacion'
        });
        // 2. DISPARAMOS EL EVENTO 📢⚡
        // "Fire and Forget": Avisamos y no esperamos a que terminen los listeners.
        pedidoEmitter.emit('pedido-creado', { pedido: nuevoPedido });

        return nuevoPedido;
    }
}

module.exports = PedidoService;