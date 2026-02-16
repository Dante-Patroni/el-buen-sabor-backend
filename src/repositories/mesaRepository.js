class MesaRepository {

  /**
   * Devuelve todas las mesas con su mozo asociado
   */
  async listarMesasConMozo() {
    throw new Error("Not implemented");
  }

  /**
   * Busca una mesa por su ID
   */
  async buscarMesaPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * Persiste los cambios de una mesa
   */
  async actualizarMesa(mesa, transaction = null) {
    throw new Error("Not implemented");
  }

    async cerrarMesa(mesa) {
    throw new Error("Not implemented");
  }
  
  /// Ejecuta una función dentro de una transacción
  async inTransaction(callback) {
  throw new Error("Not implemented");
}

}

module.exports = MesaRepository;
