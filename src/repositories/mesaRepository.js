class MesaRepository {
  /**
   * @description Abre una mesa si su estado actual es libre.
   * @param {number|string} mesaId - Id de la mesa.
   * @param {number|string} mozoId - Id del mozo asignado.
   * @returns {Promise<number>} Cantidad de filas afectadas.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async abrirMesaSiEstaLibre(mesaId, mozoId) {
    throw new Error("Not implemented");
  }

  /**
   * @description Devuelve todas las mesas con su mozo asociado.
   * @returns {Promise<Array<object>>} Listado de mesas.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async listarMesasConMozo() {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca una mesa por su ID.
   * @param {number|string} id - Id de la mesa.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Mesa encontrada o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarMesaPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Persiste los cambios de una mesa.
   * @param {object} mesa - Entidad mesa modificada.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa persistida.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async actualizarMesa(mesa, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Ejecuta una funcion dentro de una transaccion y maneja commit/rollback.
   * @param {(transaction: object) => Promise<any>} callback - Logica a ejecutar atomica.
   * @returns {Promise<any>} Resultado devuelto por callback.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

}

module.exports = MesaRepository;
