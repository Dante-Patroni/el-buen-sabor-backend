const StockModel = require('../models/mongo/Stock');

class MongoStockAdapter {
    
    // Método 1: Obtener Stock (Interfaz idéntica al JsonAdapter)
    async obtenerStock(platoId) {
        try {
            // "findOne" es el comando de Mongoose para buscar
            const stock = await StockModel.findOne({ platoId: platoId });
            
            // Si no existe el registro en la nube, devolvemos 0
            if (!stock) return 0;
            
            return stock.cantidad;
        } catch (error) {
            console.error('Error MongoAdapter:', error);
            throw new Error('Error al consultar stock en Base de Datos NoSQL');
        }
    }

    // Método 2: Descontar Stock
    async descontarStock(platoId, cantidadRequerida) {
        try {
            const stockActual = await this.obtenerStock(platoId);
            const nuevoStock = stockActual - cantidadRequerida;

            // "updateOne" busca y actualiza
            await StockModel.updateOne(
                { platoId: platoId }, 
                { cantidad: nuevoStock }
            );
            
            console.log(`📉 Stock descontado en Mongo Atlas. Nuevo saldo: ${nuevoStock}`);
        } catch (error) {
            throw new Error('Error al actualizar stock en Mongo');
        }
    }

    // ... (métodos anteriores)

    // 🆕 Método 3: Reponer Stock (Para cancelaciones)
    async reponerStock(platoId, cantidad) {
        try {
            const stockActual = await this.obtenerStock(platoId);
            const nuevoStock = stockActual + cantidad;

            await StockModel.updateOne(
                { platoId: platoId },
                { cantidad: nuevoStock }
            );
            console.log(`📈 Stock REPUESTO en Mongo Atlas. Nuevo saldo: ${nuevoStock}`);
        } catch (error) {
            throw new Error('Error al reponer stock en Mongo');
        }
    }
}
 


module.exports = MongoStockAdapter;