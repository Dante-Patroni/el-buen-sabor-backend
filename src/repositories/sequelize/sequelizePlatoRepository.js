const { Plato, Rubro } = require("../models"); // Asegúrate de importar Rubro si quieres devolver la categoría



class SequelizePlatoRepository extends PlatoRepository {

    // 1. LISTAR MENU COMPLETO
    async listarMenuCompleto() {
            // A. MySQL: Traemos platos e incluimos el nombre del Rubro
            return await Plato.findAll({
                include: [{ model: Rubro, as: 'rubro', attributes: ['denominacion'] }] 
            });

    }

// 👇 2. CREAR PLATO
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


}