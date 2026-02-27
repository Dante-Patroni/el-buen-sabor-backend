const { manejarErrorHttp } = require("./errorMapper");
class RubroController {
  /**
   * @description Crea una instancia del controller de rubros.
   * @param {import("../services/rubroService")} rubroService - Servicio de rubros inyectado.
   */
  constructor(rubroService) {
    this.rubroService = rubroService;
  }

  /**
   * @description Lista la jerarquia completa de rubros activos.
   * @param {import("express").Request} req - Request HTTP.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Arbol de rubros.
   * @throws {Error} Errores de capa service/repository.
   */
  listarJerarquia = async (req, res) => {
    try {
      const rubros = await this.rubroService.obtenerJerarquiaCompleta();
      res.status(200).json(rubros);

    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  }

  /**
   * @description Crea un rubro nuevo o reactiva uno existente segun reglas de negocio.
   * @param {import("express").Request} req - Request con `denominacion` y `padreId`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Rubro creado o reactivado.
   * @throws {Error} Codigos de dominio de rubros.
   */
  crear = async (req, res) => {
    try {
      const { denominacion, padreId } = req.body;

      const resultado = await this.rubroService.crear({
        denominacion,
        padreId
      });

      res.status(201).json(resultado);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  }

  /**
   * @description Actualiza un rubro existente por id.
   * @param {import("express").Request} req - Request con `params.id` y datos.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Confirmacion de actualizacion.
   * @throws {Error} Codigos de dominio como `RUBRO_NO_EXISTE` o `RUBRO_YA_EXISTE`.
   */
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const { denominacion, padreId } = req.body;

      await this.rubroService.actualizar(
        Number(id),
        { denominacion, padreId }
      );

      res.status(200).json({
        mensaje: 'Rubro actualizado correctamente'
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  }

  /**
   * @description Realiza baja logica de un rubro si cumple precondiciones.
   * @param {import("express").Request} req - Request con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Respuesta 204 sin contenido.
   * @throws {Error} Codigos de dominio de validacion y dependencias.
   */
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      await this.rubroService.eliminar(Number(id));

      res.status(204).send();
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  }
}

module.exports = RubroController;
