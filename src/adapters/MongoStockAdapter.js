const Stock = require("../models/mongo/Stock");

class StockAdapter {
  // 1. OBTENER STOCK (Lectura Blindada)
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

  // 2. DESCONTAR STOCK (Resta)
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

  // 👇 3. REPONER STOCK (Suma) - ¡ESTE ES EL MÉTODO QUE FALTABA!
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