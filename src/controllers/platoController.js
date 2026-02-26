const { manejarErrorHttp } = require("./errorMapper");

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
      return manejarErrorHttp(error, res);

    }
  }

  // 👇 2. NUEVO: CREAR (Esto arregla el error "is not a function")
  crearNuevoProducto = async (req, res) => {
    try {

      const nuevoPlato =
        await this.platoService.crearNuevoProducto(req.body);

      return res.status(201).json(nuevoPlato);

    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };


  // 👇 3. NUEVO: EDITAR (PUT)
  modificarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const platoActualizado =
        await this.platoService.modificarProducto(id, req.body);


      return res.status(200).json(platoActualizado);

    } catch (error) {

      return manejarErrorHttp(error, res);

    }
  };  // 🔥 ESTA LLAVE CIERRA EL MÉTODO

  // =============================
  // ELIMINAR PRODUCTO
  // ===============================
  eliminarProducto = async (req, res) => {
    try {
      const { id } = req.params;

      return res.status(200).json({
        mensaje: "PLATO_ELIMINADO_CORRECTAMENTE",
      });

    } catch (error) {
      return manejarErrorHttp(error, res);

    }
  };

  // 4. SUBIR IMAGEN
  cargarImagenProducto = async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        throw new Error("NO_SE_ENVIO_IMAGEN");
      }

      const productoActualizado =
        await this.platoService.cargarImagenProducto(id, req.file.filename);


      res.status(200).json({
        mensaje: "Imagen subida correctamente",

        plato: productoActualizado
      });

    } catch (error) {
      return manejarErrorHttp(error, res);

    }
  };
}

module.exports = PlatoController;