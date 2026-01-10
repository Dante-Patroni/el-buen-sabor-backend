
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

}

module.exports = PedidoRepository;
