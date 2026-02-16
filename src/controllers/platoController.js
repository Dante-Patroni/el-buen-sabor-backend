class PlatoController {

  constructor(platoService) {
    this.platoService = platoService;
  }

  // 1. LISTAR
  listarMenuCompleto = async (req, res) => {
    try {
      const menu = await this.platoService.listarMenuCompleto();
      res.status(200).json(menu);
    } catch (error) {
      console.error("Error en PlatoController.listar:", error);
      res.status(500).json({ error: "Error al obtener el menú." });
    }
  }

  // 👇 2. NUEVO: CREAR (Esto arregla el error "is not a function")
  crearNuevoProducto = async (req, res) => {
    try {

      const nuevoPlato =
        await this.platoService.crearNuevoProducto(req.body);

      return res.status(201).json(nuevoPlato);

    } catch (error) {

      console.error("Error al crear producto:", error.message);

      // ===============================
      // ERRORES DE VALIDACIÓN (400)
      // ===============================
      const errores400 = [
        "NOMBRE_REQUERIDO",
        "NOMBRE_DEMASIADO_LARGO",
        "PRECIO_REQUERIDO",
        "PRECIO_INVALIDO",
        "RUBRO_REQUERIDO",
        "DESCRIPCION_DEMASIADO_LARGA",
        "STOCK_REQUERIDO",
        "STOCK_INVALIDO"
      ];

      if (errores400.includes(error.message)) {
        return res.status(400).json({ error: error.message });
      }

      // ===============================
      // ERROR DE CONFLICTO (409)
      // ===============================
      if (
        error.message === "PRODUCTO_YA_EXISTE" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(409).json({
          error: "PRODUCTO_YA_EXISTE"
        });
      }

      // ===============================
      // ERROR REAL DEL SERVIDOR (500)
      // ===============================
      return res.status(500).json({
        error: "ERROR_INTERNO_SERVIDOR"
      });
    }
  };


  // 👇 3. NUEVO: EDITAR (PUT)
    modificarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const platoActualizado =
        await this.platoService.modificarProducto(id, req.body);

      if (!platoActualizado) {
        return res.status(404).json({ error: "Plato no encontrado." });
      }

      return res.status(200).json(platoActualizado);

    } catch (error) {

      console.error("Error al editar plato:", error.message);

      const errores400 = [
        "NOMBRE_REQUERIDO",
        "NOMBRE_DEMASIADO_LARGO",
        "PRECIO_REQUERIDO",
        "PRECIO_INVALIDO",
        "RUBRO_REQUERIDO",
        "DESCRIPCION_DEMASIADO_LARGA",
        "STOCK_REQUERIDO",
        "STOCK_INVALIDO"
      ];

      if (errores400.includes(error.message)) {
        return res.status(400).json({ error: error.message });
      }

      if (
        error.message === "PRODUCTO_YA_EXISTE" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(409).json({
          error: "PRODUCTO_YA_EXISTE"
        });
      }

      return res.status(500).json({
        error: "ERROR_INTERNO_SERVIDOR"
      });
    }
  };  // 🔥 ESTA LLAVE CIERRA EL MÉTODO

    // =============================
    // ELIMINAR PRODUCTO
    // ===============================
    eliminarProducto = async (req, res) => {
      try {
        const { id } = req.params;

        const eliminado = await this.platoService.eliminarProducto(id);

        if (!eliminado) {
          return res.status(404).json({ error: "Plato no encontrado." });
        }

        return res.status(200).json({
          mensaje: "Plato eliminado correctamente"
        });

      } catch (error) {
        console.error("Error al eliminar plato:", error);
        return res.status(500).json({
          error: "ERROR_INTERNO_SERVIDOR"
        });
      }
    };


    // 4. SUBIR IMAGEN
    cargarImagenProducto = async (req, res) => {
      try {
        const { id } = req.params;

        if (!req.file) {
          return res.status(400).json({ error: "No se envió ninguna imagen." });
        }

        const productoActualizado =
          await this.platoService.cargarImagenProducto(id, req.file.filename);


        if (!productoActualizado) {
          return res.status(404).json({ error: "Producto no encontrado." });
        }

        res.status(200).json({
          mensaje: "Imagen subida correctamente",
          plato: productoActualizado
        });

      } catch (error) {
        console.error("Error al subir imagen:", error);
        res.status(500).json({ error: "Error interno al procesar la imagen." });
      }
    };
  }

module.exports = PlatoController;