const { Plato } = require("../models");
const StockAdapter = require("../adapters/MongoStockAdapter"); // [Node.js Pattern: Dependency Injection]

class PlatoController {
  constructor() {
    this.stockAdapter = new StockAdapter();
  }

  // Usamos arrow function o bind en el constructor para mantener el scope de 'this'
  async listar(req, res) {
    try {
      console.log("⚡ [DEBUG] Iniciando Listar Platos...");
      // 1. Obtener definiciones estáticas (SQL)
      const platosSql = await Plato.findAll();

      // 2. Obtener estado dinámico del stock (MongoDB/Adapter)
      // Asumimos que el adapter tiene un método para traer todo el stock
      const stockMap = await this.stockAdapter.obtenerStockCompleto();

      // 3. Fusión de datos (Data Merging)
      const menuCompleto = platosSql.map((p) => {
        const platoJson = p.toJSON();

        // Agregamos URL imagen
        if (platoJson.imagenPath) {
          platoJson.imagenUrl = `${req.protocol}://${req.get("host")}/${platoJson.imagenPath}`;
        }

        // [UX REQUIREMENT] Agregamos lógica de Stock
        // Buscamos el stock de este plato en el mapa recuperado
        const stockInfo = stockMap[platoJson.id] || {
          cantidadActual: 0,
          esIlimitado: false,
        };

        // 🕵️ LOG 2: Ver qué encontró para el Plato 1 (Milanesa)
        if (platoJson.id === 1) {
          console.log(`🍔 [DEBUG] StockInfo para Plato 1:`, stockInfo);
        }

        platoJson.stock = {
          cantidad: stockInfo.cantidad,
          ilimitado: stockInfo.esIlimitado,
          estado: this._calcularEstadoStock(
            stockInfo.cantidadActual,
            stockInfo.esIlimitado,
          ),
        };

        return platoJson;
      });

      res.json(menuCompleto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el menú actualizado" });
    }
  }

  // Helper para lógica de negocio visual (Backend for Frontend pattern)
  _calcularEstadoStock(cantidad, esIlimitado) {
    if (esIlimitado) return "DISPONIBLE";
    if (cantidad <= 0) return "AGOTADO";
    if (cantidad < 5) return "BAJO_STOCK"; // Para el texto rojo que pidió UX
    return "DISPONIBLE";
  }
}

module.exports = new PlatoController();
