// Importamos el Modelo 'Stock' (Asegúrate que venga de tu index de modelos)
const { Stock } = require("../models");

class StockAdapter {
  // 1. OBTENER STOCK (Lectura)
  async obtenerStock(platoId) {
    try {
      // Buscamos el documento por tu ID personalizado
      const stockItem = await Stock.findOne({ platoId: platoId });

      // Si no existe el registro, devolvemos 0
      if (!stockItem) {
        console.warn(
          `[StockAdapter] No existe stock registrado para platoId: ${platoId}`,
        );
        return 0;
      }

      // ⚠️ CORRECCIÓN CLAVE AQUÍ:
      // Accedemos a las propiedades dentro del objeto 'stockDiario'

      // 1. Chequeamos si es ilimitado
      if (stockItem.stockDiario.esIlimitado) {
        return 9999; // Stock virtual infinito
      }

      // 2. Devolvemos la cantidad actual (Esta es la que mira la App)
      return stockItem.stockDiario.cantidadActual;
    } catch (error) {
      console.error("[StockAdapter] Error crítico leyendo Mongo:", error);
      return 0; // Ante error, protegemos el negocio negando la venta
    }
  }

  // 2. DESCONTAR STOCK (Escritura)
  async descontarStock(platoId, cantidadADescontar) {
    try {
      const stockItem = await Stock.findOne({ platoId: platoId });

      // Solo descontamos si existe y NO es ilimitado
      if (stockItem && !stockItem.stockDiario.esIlimitado) {
        // Restamos del contador actual
        stockItem.stockDiario.cantidadActual -= cantidadADescontar;

        // Actualizamos la fecha
        stockItem.ultimaActualizacion = Date.now();

        // Guardamos en Mongo
        await stockItem.save();

        console.log(
          `[StockAdapter] Stock descontado. Quedan: ${stockItem.stockDiario.cantidadActual}`,
        );
      }
    } catch (error) {
      console.error("[StockAdapter] Error actualizando stock:", error);
    }
  }
}

module.exports = new StockAdapter();
