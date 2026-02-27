class PlatoRepository {

  /**
   * @description Ejecuta una funcion dentro de una transaccion y maneja commit/rollback.
   * @param {(transaction: object) => Promise<any>} callback - Logica atomica a ejecutar.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

  // ================================
  // CONSULTAS
  // ================================
  /**
   * @description Lista el menu completo de platos.
   * @returns {Promise<Array<object>>} Lista de platos.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async listarMenuCompleto() {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca un plato por id.
   * @param {number|string} id - Id del plato.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato encontrado o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca un plato por nombre.
   * @param {string} nombre - Nombre del plato.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato encontrado o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPorNombre(nombre, transaction = null) {
    throw new Error("Not implemented");
  }

  // ================================
  // ESCRITURAS
  // ================================
  /**
   * @description Crea un nuevo plato.
   * @param {object} datos - Datos del plato.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Plato creado.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async crearNuevoProducto(datos, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Actualiza un plato existente.
   * @param {number|string} id - Id del plato.
   * @param {object} datos - Campos a actualizar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|number>} Resultado de actualizacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async modificarProductoSeleccionado(id, datos, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Elimina un plato por id.
   * @param {number|string} id - Id del plato.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<number|boolean>} Filas afectadas o bandera de exito.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async eliminarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Actualiza el stock absoluto de un plato.
   * @param {number|string} id - Id del plato.
   * @param {number} nuevoStock - Nuevo valor de stock.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Plato actualizado.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async actualizarStock(id, nuevoStock, transaction = null) {
    throw new Error("Not implemented");
  }

  // ================================
  // OPERACIONES ATÓMICAS (OPCIONAL PRO)
  // ================================
  /**
   * @description Descuenta stock de forma atomica evitando condiciones de carrera.
   * @param {number|string} id - Id del plato.
   * @param {number} cantidad - Cantidad a descontar.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<number>} Cantidad de filas afectadas.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async descontarStockAtomico(id, cantidad, transaction) {
    throw new Error("Not implemented");
  }

  /**
   * @description Restaura stock de forma atomica.
   * @param {number|string} id - Id del plato.
   * @param {number} cantidad - Cantidad a reponer.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<void>} Resolucion sin valor.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async restaurarStockAtomico(id, cantidad, transaction) {
    throw new Error("Not implemented");
  }

}

module.exports = PlatoRepository;
