const { Plato } = require('../models');

class PlatoController {

    async listar(req, res) {
        try {
            // 1. Buscamos todos los platos en la BD
            const platos = await Plato.findAll();
            // [B] TRANSFORMACIÓN DE DATOS (Data Transformation)
            // 2. Mapeamos para agregar la URL completa de la imagen
            // Si imagenPath es "uploads/foto.jpg", la URL será "http://localhost:3000/uploads/foto.jpg"
            const platosConUrl = platos.map(p => {
                const platoJson = p.toJSON();
                if (platoJson.imagenPath) {
                    // [C] Construcción de URL Absoluta
                    platoJson.imagenUrl = `${req.protocol}://${req.get('host')}/${platoJson.imagenPath}`;
                }
                return platoJson;
            });

            res.json(platosConUrl);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener el menú" });
        }
    }
}

module.exports = new PlatoController();