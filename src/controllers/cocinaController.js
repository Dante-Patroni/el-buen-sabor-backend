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

  /**
   * @description Cambia el estado de un pedido desde la pantalla de cocina.
   * Transiciones válidas: pendiente → en_preparacion → listo → entregado
   * @param {import("express").Request} req - Request HTTP con params.id y body.estado.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Confirmación del cambio de estado.
   */
  cambiarEstado = async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({
          ok: false,
          msg: "El campo 'estado' es requerido",
        });
      }

      await this.pedidoService.actualizarEstadoPedido(id, estado);

      return res.status(200).json({
        ok: true,
        msg: `Estado del pedido #${id} actualizado a '${estado}'`,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = CocinaController;