const StockModel = require('../models/mongo/Stock');

class MongoStockAdapter {
    
    // -------------------------------------------------------------------------
    // 1. CARGA MASIVA (Para el Menú - Optimizado)
    // -------------------------------------------------------------------------
    async obtenerStockCompleto() {
        try {
            const stocks = await StockModel.find({}).lean();
            
            const stockMap = {};
            stocks.forEach(doc => {
                // ⚠️ CORRECCIÓN: Accedemos a stockDiario
                // Validamos que exista para evitar crash si hay datos viejos sucios
                if (doc.stockDiario) {
                    stockMap[doc.platoId] = {
                        cantidad: doc.stockDiario.cantidadActual,
                        esIlimitado: doc.stockDiario.esIlimitado
                    };
                }
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
            
            // Si no existe el documento, asumimos stock 0
            if (!stock) return 0;

            // ⚠️ CORRECCIÓN: Usamos la nueva estructura anidada
            if (stock.stockDiario.esIlimitado) return 999; 

            return stock.stockDiario.cantidadActual;
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

            // ⚠️ CORRECCIÓN: Acceso a stockDiario
            if (stockDoc.stockDiario.esIlimitado) {
                console.log(`♾️ Plato ${platoId} es ilimitado. No se descuenta.`);
                return; 
            }

            // Validación de seguridad (Doble chequeo)
            if (stockDoc.stockDiario.cantidadActual < cantidadRequerida) {
                throw new Error('STOCK_INSUFICIENTE');
            }

            // Restamos y guardamos
            stockDoc.stockDiario.cantidadActual -= cantidadRequerida;
            await stockDoc.save();
            
            console.log(`📉 Stock descontado ID ${platoId}. Nuevo saldo: ${stockDoc.stockDiario.cantidadActual}`);
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
            
            if (!stockDoc) return; 
            
            // ⚠️ CORRECCIÓN: Acceso a stockDiario
            if (stockDoc.stockDiario.esIlimitado) return;

            stockDoc.stockDiario.cantidadActual += cantidad;
            await stockDoc.save();
            
            console.log(`📈 Stock repuesto ID ${platoId}. Nuevo saldo: ${stockDoc.stockDiario.cantidadActual}`);
        } catch (error) {
            console.error("Error reponiendo stock:", error);
        }
    }
}

module.exports = MongoStockAdapter;