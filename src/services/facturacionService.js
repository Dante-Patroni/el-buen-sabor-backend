class FacturacionService {
  /**
   * @description Porcentaje de IVA aplicado al subtotal.
   * @type {number}
   */
  static IVA_PORCENTAJE = 0.21;

  /**
   * @description Crea una instancia del servicio de facturacion.
   * @param {import("../repositories/pedidoRepository")} pedidoRepository - Repositorio de pedidos inyectado.
   */
  constructor(pedidoRepository) {
    this.pedidoRepository = pedidoRepository;
  }

  /**
   * @description Genera el resumen de facturacion de una mesa a partir de pedidos abiertos.
   * @param {number|string} mesaId - Id o numero de mesa a facturar.
   * @param {object|null} transaction - Transaccion opcional para consistencia de lectura.
   * @returns {Promise<object>} Ticket/resumen estructurado para caja.
   * @throws {Error} Propaga errores de infraestructura del repositorio.
   */
  async generarResumenCierre(mesaId, transaction = null) {
    const pedidosDb = await this.pedidoRepository.buscarPedidosFacturablesPorMesa(
      mesaId,
      transaction
    );

    const pedidos = (pedidosDb || []).map((pedido) => this._mapearPedidoFacturable(pedido));
    const subtotal = this._redondear(
      pedidos.reduce((acum, pedido) => acum + pedido.totalPedido, 0)
    );
    const iva = this._redondear(subtotal * FacturacionService.IVA_PORCENTAJE);
    const recargo = 0;
    const descuento = 0;
    const totalFinal = this._redondear(subtotal + iva + recargo - descuento);

    return {
      mesaId: Number(mesaId),
      fechaCierre: new Date().toISOString(),
      pedidos,
      subtotal,
      impuestos: {
        ivaPorcentaje: 21,
        ivaImporte: iva,
      },
      recargo,
      descuento,
      totalFinal,
    };
  }

  /**
   * @description Mapea una entidad pedido con detalles ORM al formato de ticket.
   * @param {object} pedido - Pedido con relacion de detalles.
   * @returns {{pedidoId:number, cliente:string, items:Array<object>, totalPedido:number}} Pedido listo para salida.
   */
  _mapearPedidoFacturable(pedido) {
    const detalles = this._obtenerDetallesPedido(pedido);
    const items = detalles.map((detalle) => this._mapearItemFacturable(detalle));
    const totalPedido = this._redondear(
      items.reduce((acum, item) => acum + item.subtotal, 0)
    );

    return {
      pedidoId: pedido.id,
      cliente: pedido.cliente || "Anonimo",
      items,
      totalPedido,
    };
  }

  /**
   * @description Obtiene el arreglo de detalles desde distintas variantes de serializacion del ORM.
   * @param {object} pedido - Pedido ORM.
   * @returns {Array<object>} Detalles del pedido.
   */
  _obtenerDetallesPedido(pedido) {
    if (Array.isArray(pedido?.DetallePedidos)) {
      return pedido.DetallePedidos;
    }

    if (Array.isArray(pedido?.detallePedidos)) {
      return pedido.detallePedidos;
    }

    return [];
  }

  /**
   * @description Mapea un detalle de pedido al item facturable final.
   * @param {object} detalle - Detalle ORM con posible relacion `Plato`.
   * @returns {{platoId:number|null, plato:string, cantidad:number, precioUnitario:number, subtotal:number}} Item del ticket.
   */
  _mapearItemFacturable(detalle) {
    const cantidad = Number(detalle?.cantidad) || 0;
    const subtotal = this._redondear(Number(detalle?.subtotal) || 0);
    const precioPlato = Number(detalle?.Plato?.precio);
    const precioUnitario = this._redondear(
      Number.isFinite(precioPlato) && precioPlato > 0
        ? precioPlato
        : cantidad > 0
          ? subtotal / cantidad
          : 0
    );

    return {
      platoId: detalle?.PlatoId ?? detalle?.Plato?.id ?? null,
      plato: detalle?.Plato?.nombre || "Plato sin nombre",
      cantidad,
      precioUnitario,
      subtotal,
    };
  }

  /**
   * @description Redondea montos monetarios a dos decimales.
   * @param {number} valor - Monto a redondear.
   * @returns {number} Monto redondeado.
   */
  _redondear(valor) {
    return Number(Number(valor || 0).toFixed(2));
  }
}

module.exports = FacturacionService;
