class CajaService {
  /**
   * @description Crea una instancia del servicio de caja.
   * @param {import("./mesaService")} mesaService - Servicio de mesas.
   * @param {import("./pedidoService")} pedidoService - Servicio de pedidos.
   * @param {import("./facturacionService")} facturacionService - Servicio de facturación.
   */
  constructor(mesaService, pedidoService, facturacionService) {
    this.mesaService = mesaService;
    this.pedidoService = pedidoService;
    this.facturacionService = facturacionService;
  }

  /**
   * @description Lista todas las mesas disponibles para caja.
   * @returns {Promise<Array<object>>} Mesas con estado y mozo.
   */
  async listarMesasAbiertas() {
    return await this.mesaService.listar();
  }

  /**
   * @description Obtiene los datos de una mesa junto con pedidos asociados y total dinámico.
   * @param {number|string} mesaId - Id de la mesa.
   * @returns {Promise<object>} Datos de la mesa listos para caja.
   */
  async obtenerMesaPorId(mesaId) {
    const mesa = await this.mesaService.obtenerPorId(mesaId);
    const totalActual = await this.mesaService.calcularTotalActual(mesaId);
    const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesaId);

    const mesaBase = typeof mesa.toJSON === "function"
      ? mesa.toJSON()
      : { ...mesa };

    return {
      ...mesaBase,
      totalActual,
      pedidos,
    };
  }

  /**
   * @description Genera el ticket de cierre de mesa sin cerrar la mesa.
   * @param {number|string} mesaId - Id de la mesa.
   * @returns {Promise<object>} Resumen de facturación.
   */
  async obtenerTicketCierre(mesaId) {
    return await this.facturacionService.generarResumenCierre(mesaId);
  }

  /**
   * @description Cobra la mesa y cierra la operación de caja.
   * @param {number|string} mesaId - Id de la mesa.
   * @returns {Promise<object>} Resultado del cierre.
   */
  async cobrarMesa(mesaId) {
    return await this.mesaService.cerrarMesa(mesaId);
  }
}

module.exports = CajaService;
