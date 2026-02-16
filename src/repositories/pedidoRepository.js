class PedidoRepository {

  /**
   * Ejecuta una función dentro de una transacción.
   */
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

  /**
   * Crea un nuevo pedido.
   */
  async crearPedido(data, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Crea múltiples detalles de pedido.
   */
  async crearDetalles(detalles, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Lista pedidos filtrados por estado.
   */
  async listarPedidosPorEstado(estado) {
    throw new Error("Not implemented");
  }

  /**
   * Busca pedidos asociados a una mesa.
   */
  async buscarPedidosPorMesa(mesaNumero) {
    throw new Error("Not implemented");
  }

  /**
   * Busca un pedido por su ID.
   */
  async buscarPedidoPorId(id) {
    throw new Error("Not implemented");
  }

  /**
   * Busca pedidos abiertos de una mesa.
   */
  async buscarPedidoAbiertosPorMesa(mesaId) {
    throw new Error("Not implemented");
  }

  /**
   * Marca como pagados los pedidos abiertos de una mesa.
   */
  async marcarPedidosComoPagados(mesaId, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Elimina un pedido por ID.
   */
  async eliminarPedidoPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Actualiza el estado de un pedido.
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Obtiene los detalles de un pedido.
   */
  async obtenerDetallesPedido(pedidoId) {
    throw new Error("Not implemented");
  }

  /**
   * Elimina los detalles asociados a un pedido.
   */
  async eliminarDetallesPedido(pedidoId, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Actualiza el total del pedido.
   */
  async actualizarTotalPedido(pedidoId, nuevoTotal, transaction = null) {
    throw new Error("Not implemented");
  }
}

module.exports = PedidoRepository;
