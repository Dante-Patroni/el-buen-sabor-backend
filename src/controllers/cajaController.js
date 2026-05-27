const { manejarErrorHttp } = require("./errorMapper");

class CajaController {
  /**
   * @description Crea una instancia del controller de caja.
   * @param {import("../services/cajaService")} cajaService - Servicio de caja.
   */
  constructor(cajaService) {
    this.cajaService = cajaService;
  }

  /**
   * @description Lista mesas visibles desde caja.
   */
  listarMesas = async (req, res) => {
    try {
      const mesas = await this.cajaService.listarMesasAbiertas();
      return res.status(200).json(mesas);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Obtiene el detalle de una mesa para el cobro.
   */
  obtenerMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const mesa = await this.cajaService.obtenerMesaPorId(id);
      return res.status(200).json(mesa);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Muestra el ticket de cierre sin cerrar la mesa.
   */
  obtenerTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await this.cajaService.obtenerTicketCierre(id);
      return res.status(200).json(ticket);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Cobra y cierra una mesa.
   */
  cobrarMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.cajaService.cobrarMesa(id);
      return res.status(200).json({
        mensaje: "Mesa cobrada y cerrada correctamente",
        ...resultado,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = CajaController;
