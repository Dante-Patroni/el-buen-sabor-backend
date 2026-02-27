const { manejarErrorHttp } = require("./errorMapper");

class PlatoController {
  /**
   * @description Crea una instancia del controller de platos.
   * @param {import("../services/platoService")} platoService - Servicio de platos inyectado.
   */
  constructor(platoService) {
    this.platoService = platoService;
  }

  /**
   * @description Devuelve el menu completo de platos.
   * @param {import("express").Request} req - Request HTTP.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Menu listado.
   * @throws {Error} Errores de service/repository.
   */
  listarMenuCompleto = async (req, res) => {
    try {
      const menu = await this.platoService.listarMenuCompleto();
      res.status(200).json(menu);
    } catch (error) {
      return manejarErrorHttp(error, res);

    }
  }

  /**
   * @description Crea un nuevo plato aplicando validaciones de negocio.
   * @param {import("express").Request} req - Request con datos del plato.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Plato creado.
   * @throws {Error} Codigos de dominio como `PRODUCTO_YA_EXISTE` o validaciones.
   */
  crearNuevoProducto = async (req, res) => {
    try {

      const nuevoPlato =
        await this.platoService.crearNuevoProducto(req.body);

      return res.status(201).json(nuevoPlato);

    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Modifica un plato existente por id.
   * @param {import("express").Request} req - Request con `params.id` y campos a actualizar.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Plato actualizado.
   * @throws {Error} Errores de dominio de validacion o inexistencia.
   */
  modificarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const platoActualizado =
        await this.platoService.modificarProducto(id, req.body);


      return res.status(200).json(platoActualizado);

    } catch (error) {

      return manejarErrorHttp(error, res);

    }
  };

  /**
   * @description Elimina un plato por id.
   * @param {import("express").Request} req - Request con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Confirmacion de eliminacion.
   * @throws {Error} `PLATO_NO_ENCONTRADO` u otros codigos de dominio.
   */
  eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await this.platoService.eliminarProducto(id);

    return res.status(200).json({
      mensaje: "PLATO_ELIMINADO_CORRECTAMENTE",
    });
  } catch (error) {
    return manejarErrorHttp(error, res);
  }
};

  /**
   * @description Asocia una imagen subida a un plato existente.
   * @param {import("express").Request} req - Request con `params.id` y `file`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Plato con imagen actualizada.
   * @throws {Error} `NO_SE_ENVIO_IMAGEN`, `PLATO_NO_ENCONTRADO` y errores de infraestructura.
   */
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
