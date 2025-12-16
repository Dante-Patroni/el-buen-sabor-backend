const { Plato, Rubro } = require("../models"); // Asegúrate de importar Rubro si quieres devolver la categoría
const StockAdapter = require("../adapters/MongoStockAdapter");

class PlatoService {

    constructor() {
        this.stockAdapter = new StockAdapter();
    }

    // 1. LISTAR (Tu lógica Híbrida MySQL + Mongo)
    async listar() {
        try {
            // A. MySQL: Traemos platos e incluimos el nombre del Rubro
            const platosSql = await Plato.findAll({
                include: [{ model: Rubro, as: 'rubro', attributes: ['denominacion'] }] 
            });

            // B. MongoDB: Enriquecemos con Stock
            const menuCompleto = await Promise.all(
                platosSql.map(async (plato) => {
                    const platoJson = plato.toJSON();
                    const stockInfo = await this.stockAdapter.obtenerStock(plato.id);

                    platoJson.stock = {
                        cantidad: stockInfo.cantidad,
                        ilimitado: stockInfo.esIlimitado,
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

    // 👇 2. NUEVO: CREAR PLATO
    async crearPlato(datos) {
        // datos trae: nombre, precio, rubroId, esMenuDelDia, etc.
        try {
            const nuevoPlato = await Plato.create(datos);
            // Opcional: Crear stock inicial en Mongo aquí si quisieras
            return nuevoPlato;
        } catch (error) {
            throw error;
        }
    }

    // 👇 3. NUEVO: ACTUALIZAR PLATO (Para editar precio o Menu del Dia)
    async updatePlato(id, datos) {
        try {
            const plato = await Plato.findByPk(id);
            if (!plato) return null;
            
            await plato.update(datos);
            return plato;
        } catch (error) {
            throw error;
        }
    }

    // 4. ACTUALIZAR IMAGEN (Tu código original)
    async actualizarImagen(id, nombreArchivo) {
        try {
            const plato = await Plato.findByPk(id);
            if (!plato) return null;

            // Guardamos ruta relativa
            plato.imagenPath = `/uploads/${nombreArchivo}`; // Ojo: en tu modelo se llama 'imagenPath' o 'imagenUrl'? Verifica el nombre exacto en el modelo.
            await plato.save();

            return plato;
        } catch (error) {
            throw error;
        }
    }

    // --- MÉTODOS PRIVADOS ---
    _calcularEstadoStock(cantidad, esIlimitado) {
        if (esIlimitado) return "DISPONIBLE";
        if (cantidad <= 0) return "AGOTADO";
        if (cantidad < 5) return "BAJO_STOCK";
        return "DISPONIBLE";
    }
}

module.exports = PlatoService;