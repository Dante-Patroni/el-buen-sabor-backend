const { manejarErrorHttp } = require("./errorMapper");

class CocinaController {
  /**
   * @description Crea una instancia del controller de cocina.
   * @param {import("../services/pedidoService")} pedidoService - Servicio de pedidos inyectado.
   */
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  /**
   * @description Lista pedidos pendientes para el monitor de cocina.
   * @param {import("express").Request} req - Request HTTP.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Listado de pedidos formateado para la cocina.
   */
  listarPendientes = async (req, res) => {
    try {
      const data = await this.pedidoService.obtenerPedidosParaCocina();

      return res.status(200).json({
        cantidad: data.length,
        data,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = CocinaController;