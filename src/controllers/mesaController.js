const { manejarErrorHttp } = require("./errorMapper");

class MesaController {
  /**
   * @description Crea una instancia del controller de mesas.
   * @param {import("../services/mesaService")} mesaService - Servicio de mesas inyectado por la ruta.
   */
  constructor(mesaService) {
    this.mesaService = mesaService;
  }

  /**
   * @description Lista mesas y adapta la salida al contrato HTTP esperado por frontend.
   * @param {import("express").Request} req - Request HTTP.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Lista de mesas con formato consistente.
   * @throws {Error} Propaga errores de dominio para mapeo centralizado.
   */
  listar = async (req, res) => {
    try {
      const mesasRaw = await this.mesaService.listar();

      const mesasFormateadas = mesasRaw.map((m) => {
        const valorNumerico = parseFloat(m.totalActual) || 0;
        const itemsCalc = valorNumerico > 0 || m.estado === "ocupada" ? 1 : 0;

        return {
          id: m.id,
          nombre: m.nombre || `Mesa ${m.id}`,
          numero: m.numero || m.id.toString(),
          estado: m.estado,
          mozo: m.mozo,
          itemsPendientes: itemsCalc,
          totalActual: valorNumerico,
        };
      });

      return res.status(200).json(mesasFormateadas);
    } catch (error) {
      console.error("[MesaController] listar:", error.message);
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Abre una mesa asignando el mozo responsable.
   * @param {import("express").Request} req - Request HTTP con `params.id` y `body.idMozo`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Resultado de apertura.
   * @throws {Error} `MOZO_REQUERIDO` u otros errores de dominio.
   */
  abrirMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const { idMozo } = req.body;

      if (!idMozo) {
        throw new Error("MOZO_REQUERIDO");
      }

      const resultado = await this.mesaService.abrirMesa(id, idMozo);
      return res.status(200).json(resultado);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Cierra una mesa, cobra el total y libera recursos asociados.
   * @param {import("express").Request} req - Request HTTP con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Confirmacion de cierre.
   * @throws {Error} Errores de dominio mapeados por `manejarErrorHttp`.
   */
  cerrarMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.mesaService.cerrarMesa(id);

      return res.status(200).json({
        mensaje: "Mesa cerrada y cobrada exitosamente",
        ...resultado,
      });
    } catch (error) {
      console.error("[MesaController] cerrarMesa:", error.message);
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = MesaController;
