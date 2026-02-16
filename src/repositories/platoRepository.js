class PlatoRepository {

  /**
   * Ejecuta una función dentro de una transacción.
   */
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

  // ================================
  // CONSULTAS
  // ================================

  async listarMenuCompleto() {
    throw new Error("Not implemented");
  }

  async buscarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  async buscarPorNombre(nombre, transaction = null) {
    throw new Error("Not implemented");
  }

  // ================================
  // ESCRITURAS
  // ================================

  async crearNuevoProducto(datos, transaction = null) {
    throw new Error("Not implemented");
  }

  async modificarProductoSeleccionado(id, datos, transaction = null) {
    throw new Error("Not implemented");
  }

  async eliminarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  async actualizarStock(id, nuevoStock, transaction = null) {
    throw new Error("Not implemented");
  }

  // ================================
  // OPERACIONES ATÓMICAS (OPCIONAL PRO)
  // ================================

  async descontarStockAtomico(id, cantidad, transaction) {
    throw new Error("Not implemented");
  }

  async restaurarStockAtomico(id, cantidad, transaction) {
    throw new Error("Not implemented");
  }

}

module.exports = PlatoRepository;
