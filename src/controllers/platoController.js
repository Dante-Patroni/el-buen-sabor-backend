class PlatoController {

  constructor(platoService) {
    this.platoService = platoService;
  }

  // 1. LISTAR
  listarMenu = async (req, res) => {
    try {
      const menu = await this.platoService.listarMenu();
      res.status(200).json(menu);
    } catch (error) {
      console.error("Error en PlatoController.listar:", error);
      res.status(500).json({ error: "Error al obtener el menú." });
    }
  }

  // 👇 2. NUEVO: CREAR (Esto arregla el error "is not a function")
  crear = async (req, res) => {
    try {
      const nuevoPlato = await this.platoService.crearPlato(req.body);
      res.status(201).json(nuevoPlato);
    } catch (error) {
      console.error("Error al crear plato:", error);
      res.status(500).json({ error: "Error interno al crear el plato." });
    }
  }

  // 👇 3. NUEVO: EDITAR (PUT)
  editar = async (req, res) => {
    try {
      const { id } = req.params;
      const platoActualizado = await this.platoService.updatePlato(id, req.body);

      if (!platoActualizado) {
        return res.status(404).json({ error: "Plato no encontrado." });
      }

      res.status(200).json(platoActualizado);
    } catch (error) {
      console.error("Error al editar plato:", error);
      res.status(500).json({ error: "Error interno al editar." });
    }
  }

  // 4. SUBIR IMAGEN
  subirImagen = async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen." });
      }

      const platoActualizado = await this.platoService.actualizarImagen(id, req.file.filename);

      if (!platoActualizado) {
        return res.status(404).json({ error: "Plato no encontrado." });
      }

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

module.exports = PlatoController;