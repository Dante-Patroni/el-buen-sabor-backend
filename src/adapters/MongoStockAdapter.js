const Stock = require("../models/mongo/Stock");

class StockAdapter {
  /**
   * @description Obtiene stock disponible combinando modelo legacy y stock diario.
   * @param {number|string} platoId - Id del plato.
   * @returns {Promise<number>} Cantidad disponible (9999 para ilimitado o modo CI).
   * @throws {Error} No relanza; ante falla retorna 0 para no romper flujo de negocio.
   */
  async obtenerStock(platoId) {
    // Si estamos en GitHub Actions, stock infinito
    if (process.env.CI === "true") {
      console.log(
        "[StockAdapter] Modo CI/CD detectado: Simulando Stock Infinito",
      );
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

      console.log(
        "[StockAdapter] Datos encontrados:",
        JSON.stringify(stockItem, null, 2),
      );

      // 🧠 LÓGICA DE FUSIÓN (Merge Strategy)
      const esIlimitado =
        stockItem.esIlimitado === true ||
        stockItem.stockDiario?.esIlimitado === true;

      if (esIlimitado) {
        console.log("[StockAdapter] Es Ilimitado -> Devuelvo 9999");
        return 9999;
      }

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

  /**
   * @description Descuenta stock en Mongo respetando compatibilidad entre esquemas legacy y nuevo.
   * @param {number|string} platoId - Id del plato.
   * @param {number} cantidadADescontar - Cantidad a descontar.
   * @returns {Promise<void>} Resolucion sin valor.
   * @throws {Error} No relanza; registra error en logs.
   */
  async descontarStock(platoId, cantidadADescontar) {
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
            stockItem.cantidad -= cantidadADescontar;
            await stockItem.save();
          }
        }
        console.log(`[StockAdapter] Stock descontado correctamente.`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @description Repone stock en Mongo respetando compatibilidad entre esquemas legacy y nuevo.
   * @param {number|string} platoId - Id del plato.
   * @param {number} cantidadAReponer - Cantidad a reponer.
   * @returns {Promise<void>} Resolucion sin valor.
   * @throws {Error} No relanza; registra error en logs.
   */
  async reponerStock(platoId, cantidadAReponer) {
    try {
      console.log(`🔄 [StockAdapter] Reponiendo ${cantidadAReponer} items al plato ${platoId}`);
      const idBusqueda = parseInt(platoId);
      const stockItem = await Stock.findOne({ platoId: idBusqueda });

      if (stockItem) {
        // Lógica Híbrida (Igual que descontar, pero sumando)
        if (stockItem.stockDiario) {
          if (!stockItem.stockDiario.esIlimitado) {
            stockItem.stockDiario.cantidadActual += cantidadAReponer;
            stockItem.ultimaActualizacion = Date.now();
            await stockItem.save();
            console.log(`✅ Stock actualizado (Moderno). Nuevo total: ${stockItem.stockDiario.cantidadActual}`);
          }
        } else {
          // Lógica Legacy
          if (!stockItem.esIlimitado) {
            stockItem.cantidad += cantidadAReponer;
            await stockItem.save();
            console.log(`✅ Stock actualizado (Legacy). Nuevo total: ${stockItem.cantidad}`);
          }
        }
      } else {
          console.warn(`⚠️ No se encontró el plato ${platoId} para reponer stock.`);
      }
    } catch (e) {
      console.error("❌ Error al reponer stock:", e);
    }
  }
}

module.exports = StockAdapter;
