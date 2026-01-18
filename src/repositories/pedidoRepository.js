
class PedidoRepository {
  async crearPedido(data) {
    throw new Error("Not implemented");
  }

  async crearDetalles(detalles) {
    throw new Error("Not implemented");
  }

  async buscarPlatoPorId(id) {
    throw new Error("Not implemented");
  }

  async buscarMesaPorId(id) {
    throw new Error("Not implemented");
  }

  async actualizarMesa(mesa) {
    throw new Error("Not implemented");
  }

  async listarPedidosPorEstado(estado) {
    throw new Error("Not implemented");
  }
  async buscarPedidosPorMesa(mesaNumero) {
    throw new Error("Not implemented");
  }

  async buscarPedidoPorId(id) {
    throw new Error("Not implemented");
  }

  async buscarPedidoAbiertosPorMesa(mesaId) {
    throw new Error("Not implemented");
  }
  async marcarPedidosComoPagados(mesaId) {
    throw new Error("Not implemented");
  }

  async eliminarPedidoPorId(id) {
    throw new Error("Not implemented");
  }

  async actualizarEstadoPedido(mesaId) {
    throw new Error("Not implemented");
  }
async obtenerDetallesPedido(pedidoId) {
    throw new Error("Not implemented");
  }

  // 2. El "Borrón" de los items viejos
  async eliminarDetallesPedido(pedidoId) {
    throw new Error("Not implemented");
  }

  // 3. Actualizar el precio final en la cabecera del pedido
  async actualizarTotalPedido(pedidoId, nuevoTotal) {
   throw new Error("Not implemented");
  }
}

module.exports = PedidoRepository;
