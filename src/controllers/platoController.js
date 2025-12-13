// Nota: No importamos el servicio aquí, se inyectará en el constructor.

class PlatoController {

  // 👇 Inyección de Dependencias
  constructor(platoService) {
    this.platoService = platoService;
  }

  // 1. Listar Platos
  listar = async (req, res) => {
    try {
      // Delegamos el trabajo sucio al servicio
      const menu = await this.platoService.listar();

      res.status(200).json(menu);
    } catch (error) {
      console.error("Error en PlatoController.listar:", error);
      res.status(500).json({ error: "Error al obtener el menú." });
    }
  }

  // 👇 MOTODO PARA SUBIR IMAGEN
  subirImagen = async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Validación: Error 400 (Bad Request)
      if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen." });
      }

      // 2. Llamamos al servicio
      const platoActualizado = await this.platoService.actualizarImagen(id, req.file.filename);

      // 3. Validación: Error 404 (Not Found)
      if (!platoActualizado) {
        return res.status(404).json({ error: "Plato no encontrado." });
      }

      // 4. Éxito: 200 OK
      res.status(200).json({
        mensaje: "Imagen subida correctamente",
        plato: platoActualizado
      });

    } catch (error) {
      console.error("Error al subir imagen:", error);
      res.status(500).json({ error: "Error interno al procesar la imagen." });
    }
  }
}


// 👇 Exportamos la CLASE
module.exports = PlatoController;