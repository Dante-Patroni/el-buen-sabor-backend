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
  async buscarMesaPorId(id) {
    throw new Error("Not implemented");
  }

  /**
   * Persiste los cambios de una mesa
   */
  async actualizarMesa(mesa) {
    throw new Error("Not implemented");
  }
}

module.exports = MesaRepository;
