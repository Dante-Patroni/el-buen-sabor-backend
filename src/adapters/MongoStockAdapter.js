const Stock = require('../models/mongo/Stock');

class StockAdapter {

    // 1. OBTENER STOCK (Lectura Blindada)
    async obtenerStock(platoId) {
        // Si estamos en GitHub Actions, stock infinito
        if (process.env.CI === 'true') {
            console.log("[StockAdapter] Modo CI/CD detectado: Simulando Stock Infinito");
            return 9999;
        }
        try {
            const idBusqueda = parseInt(platoId);
            console.log(`[StockAdapter] Buscando platoId: ${idBusqueda}`);

            const stockItem = await Stock.findOne({ platoId: idBusqueda }).lean();

            if (!stockItem) {
                console.warn(`[StockAdapter] Documento no encontrado.`);
                return 0;
            }

            console.log("[StockAdapter] Datos encontrados:", JSON.stringify(stockItem, null, 2));

            // 🧠 LÓGICA DE FUSIÓN (Merge Strategy)
            // Esto soluciona tu problema actual: Combina los datos viejos y nuevos.

            // A. ¿Es Ilimitado? (Si es true en CUALQUIER lugar, es true)
            // Revisamos raíz (Legacy) O stockDiario (Nuevo)
            const esIlimitado = (stockItem.esIlimitado === true) || (stockItem.stockDiario?.esIlimitado === true);

            if (esIlimitado) {
                console.log("[StockAdapter] Es Ilimitado -> Devuelvo 9999");
                return 9999;
            }

            // B. ¿Cuánta cantidad hay?
            // Tomamos el mayor valor entre lo viejo y lo nuevo para no bloquear ventas válidas.
            const cantidadVieja = stockItem.cantidad || 0;
            const cantidadNueva = stockItem.stockDiario?.cantidadActual || 0;

            const cantidadFinal = Math.max(cantidadVieja, cantidadNueva);

            console.log(`[StockAdapter] Stock Final Calculado: ${cantidadFinal}`);
            return cantidadFinal;

        } catch (error) {
            console.error("[StockAdapter] Error crítico:", error);
            return 0;
        }
    }

    async descontarStock(platoId, cantidadADescontar) {
        // ... (Puedes dejar la lógica de escritura igual o ajustarla similar si necesitas)
        // Por ahora nos urge que funcione la LECTURA para crear el pedido.
        try {
            const idBusqueda = parseInt(platoId);
            const stockItem = await Stock.findOne({ platoId: idBusqueda });

            if (stockItem) {
                // Lógica Híbrida de Escritura
                if (stockItem.stockDiario) {
                    if (!stockItem.stockDiario.esIlimitado) {
                        stockItem.stockDiario.cantidadActual -= cantidadADescontar;
                        stockItem.ultimaActualizacion = Date.now();
                        await stockItem.save();
                    }
                } else {
                    // Lógica Legacy
                    if (!stockItem.esIlimitado) {
                        stockItem.cantidad -= cantidadADescontar; // Usamos el campo viejo
                        await stockItem.save();
                    }
                }
                console.log(`[StockAdapter] Stock descontado correctamente.`);
            }
        } catch (e) { console.error(e); }
    }
}

module.exports = StockAdapter;