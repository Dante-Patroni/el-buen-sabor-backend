class PedidoRepository {
  /**
   * @description Ejecuta una funcion dentro de una transaccion y administra commit/rollback.
   * @param {(transaction: object) => Promise<any>} callback - Logica atomica a ejecutar.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

  /**
   * @description Crea un nuevo pedido.
   * @param {object} data - Datos de cabecera del pedido.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Pedido creado.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async crearPedido(data, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Crea multiples detalles de pedido.
   * @param {Array<object>} detalles - Detalles a persistir.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<object>>} Detalles creados.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async crearDetalles(detalles, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Lista pedidos filtrados por estado.
   * @param {string|undefined} estado - Estado de pedido opcional.
   * @returns {Promise<Array<object>>} Pedidos encontrados.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async listarPedidosPorEstado(estado) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca pedidos asociados a una mesa.
   * @param {number|string} mesaNumero - Numero de mesa.
   * @returns {Promise<Array<object>>} Pedidos asociados.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPedidosPorMesa(mesaNumero) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca un pedido por su id.
   * @param {number|string} id - Id del pedido.
   * @returns {Promise<object|null>} Pedido encontrado o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPedidoPorId(id) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca pedidos abiertos de una mesa.
   * @param {number|string} mesaId - Id de mesa.
   * @returns {Promise<Array<object>>} Pedidos abiertos.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPedidoAbiertosPorMesa(mesaId) {
    throw new Error("Not implemented");
  }

  /**
   * @description Marca como pagados los pedidos abiertos de una mesa.
   * @param {number|string} mesaId - Id de mesa.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<void>} Resolucion sin valor.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async marcarPedidosComoPagados(mesaId, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Elimina un pedido por id.
   * @param {number|string} id - Id del pedido.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<boolean|number>} Resultado de eliminacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async eliminarPedidoPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Actualiza el estado de un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {string} nuevoEstado - Nuevo estado.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|number|boolean>} Resultado de actualizacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Obtiene los detalles de un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @returns {Promise<Array<object>>} Detalles encontrados.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async obtenerDetallesPedido(pedidoId) {
    throw new Error("Not implemented");
  }

  /**
   * @description Elimina los detalles asociados a un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<number|boolean>} Resultado de eliminacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async eliminarDetallesPedido(pedidoId, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Actualiza el total de un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {number} nuevoTotal - Nuevo total.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|number|boolean>} Resultado de actualizacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async actualizarTotalPedido(pedidoId, nuevoTotal, transaction = null) {
    throw new Error("Not implemented");
  }
}

module.exports = PedidoRepository;
