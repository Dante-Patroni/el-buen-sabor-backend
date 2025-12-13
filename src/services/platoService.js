const { Plato } = require("../models"); // Modelo MySQL
const StockAdapter = require("../adapters/MongoStockAdapter"); // Adapter Mongo

class PlatoService {

    constructor() {
        // Instanciamos el adapter aquí para usarlo en los métodos
        this.stockAdapter = new StockAdapter();
    }

    // 1. Obtener todos los platos (Fusionando MySQL + MongoDB)
    async listar() {
        try {
            // A. Buscamos la info base en MySQL
            const platosSql = await Plato.findAll();

            // B. Enriquecemos cada plato con su info de Stock (MongoDB)
            // Usamos Promise.all para que sea rápido y paralelo
            const menuCompleto = await Promise.all(
                platosSql.map(async (plato) => {
                    const platoJson = plato.toJSON();

                    // Consultamos el stock al Adapter
                    const stockInfo = await this.stockAdapter.obtenerStock(plato.id);

                    // Agregamos la info de stock al objeto
                    platoJson.stock = {
                        cantidad: stockInfo.cantidad,
                        ilimitado: stockInfo.esIlimitado,
                        // Calculamos el estado (Lógica de Negocio)
                        estado: this._calcularEstadoStock(stockInfo.cantidad, stockInfo.esIlimitado)
                    };

                    return platoJson;
                })
            );

            return menuCompleto;
        } catch (error) {
            console.error("Error en PlatoService.listar:", error);
            throw error;
        }
    }

    async actualizarImagen(id, nombreArchivo) {
        try {
            // 1. Buscamos si el plato existe
            const plato = await Plato.findByPk(id);
            if (!plato) return null; // Retornamos null si no existe

            // 2. Construimos la URL (ajusta según tu servidor, ej: /uploads/...)
            // Guardamos la ruta relativa para que sea fácil de servir
            const urlImagen = `/uploads/${nombreArchivo}`;

            // 3. Actualizamos en MySQL
            plato.imagenUrl = urlImagen;
            await plato.save();

            return plato;
        } catch (error) {
            throw error;
        }
    }

    // --- MÉTODOS PRIVADOS (Lógica de Negocio Pura) ---

    // Regla de negocio: Define si está Agotado, Bajo Stock o Disponible
    _calcularEstadoStock(cantidad, esIlimitado) {
        if (esIlimitado) return "DISPONIBLE";
        if (cantidad <= 0) return "AGOTADO";
        if (cantidad < 5) return "BAJO_STOCK"; // Alerta visual
        return "DISPONIBLE";
    }
}

// 👇 ESTANDARIZACIÓN: Exportamos la CLASE para permitir inyección de dependencias
module.exports = PlatoService;