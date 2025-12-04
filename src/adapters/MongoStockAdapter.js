const StockModel = require('../models/mongo/Stock');

class MongoStockAdapter {
    
    // -------------------------------------------------------------------------
    // 1. CARGA MASIVA (Para el Menú - Optimizado ayer)
    // -------------------------------------------------------------------------
    async obtenerStockCompleto() {
        try {
            const stocks = await StockModel.find({}).lean();
            // console.log("🔍 Datos crudos (Lean):", JSON.stringify(stocks, null, 2)); 

            const stockMap = {};
            stocks.forEach(doc => {
                stockMap[doc.platoId] = {
                    cantidad: doc.cantidad,
                    esIlimitado: doc.esIlimitado
                };
            });
            return stockMap;
        } catch (error) {
            console.error("⚠️ Error leyendo stock masivo:", error.message);
            return {}; 
        }
    }

    // -------------------------------------------------------------------------
    // 2. CONSULTA INDIVIDUAL (Para validar antes de crear pedido)
    // -------------------------------------------------------------------------
    async obtenerStock(platoId) {
        try {
            const stock = await StockModel.findOne({ platoId: platoId });
            
            // Si no existe, asumimos 0
            if (!stock) return 0;

            // Si es ilimitado, devolvemos un número alto o una bandera
            // Para tu lógica de "stockActual <= 0", si es ilimitado devolvemos 999
            if (stock.esIlimitado) return 999; 

            return stock.cantidad;
        } catch (error) {
            console.error('Error MongoAdapter obtenerStock:', error);
            throw new Error('Error al consultar stock individual');
        }
    }

    // -------------------------------------------------------------------------
    // 3. DESCONTAR STOCK (El momento de la venta)
    // -------------------------------------------------------------------------
    async descontarStock(platoId, cantidadRequerida) {
        try {
            const stockDoc = await StockModel.findOne({ platoId });
            
            if (!stockDoc) throw new Error('PLATO_NO_ENCONTRADO_EN_STOCK');

            // Si es ilimitado, NO tocamos la cantidad. Solo retornamos éxito.
            if (stockDoc.esIlimitado) {
                console.log(`♾️ Plato ${platoId} es ilimitado. No se descuenta.`);
                return; 
            }

            // Validación de seguridad (Doble chequeo)
            if (stockDoc.cantidad < cantidadRequerida) {
                throw new Error('STOCK_INSUFICIENTE');
            }

            // Restamos y guardamos
            stockDoc.cantidad -= cantidadRequerida;
            await stockDoc.save();
            
            console.log(`📉 Stock descontado ID ${platoId}. Nuevo saldo: ${stockDoc.cantidad}`);
        } catch (error) {
            throw error; // Re-lanzamos para que el Service cancele todo
        }
    }

    // -------------------------------------------------------------------------
    // 4. REPONER STOCK (Para eliminar/cancelar pedidos)
    // -------------------------------------------------------------------------
    async reponerStock(platoId, cantidad) {
        try {
            const stockDoc = await StockModel.findOne({ platoId });
            
            if (!stockDoc) return; // Si no existe, no hacemos nada
            if (stockDoc.esIlimitado) return; // Si es ilimitado, no sumamos nada

            stockDoc.cantidad += cantidad;
            await stockDoc.save();
            
            console.log(`📈 Stock repuesto ID ${platoId}. Nuevo saldo: ${stockDoc.cantidad}`);
        } catch (error) {
            console.error("Error reponiendo stock:", error);
            // No lanzamos error aquí para permitir que se borre el pedido SQL aunque falle Mongo
        }
    }
}

module.exports = MongoStockAdapter;