class UsuarioRepository {
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
   * @description Lista usuarios segun inclusion de inactivos.
   * @param {boolean} incluirInactivos - Indica si se incluyen inactivos.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<object>>} Lista de usuarios.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async listar(incluirInactivos = false, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca un usuario por id.
   * @param {number|string} id - Id del usuario.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Usuario encontrado o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Busca un usuario por legajo.
   * @param {string} legajo - Legajo a consultar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Usuario encontrado o `null`.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async buscarPorLegajo(legajo, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Crea un usuario.
   * @param {object} datos - Datos a persistir.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Usuario creado.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async crear(datos, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Actualiza un usuario por id.
   * @param {number|string} id - Id del usuario.
   * @param {object} datos - Campos a actualizar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<number|object>} Resultado de actualizacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async actualizar(id, datos, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Realiza baja logica de un usuario.
   * @param {number|string} id - Id del usuario.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<number|object>} Resultado de actualizacion.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async eliminarLogico(id, transaction = null) {
    throw new Error("Not implemented");
  }

  /**
   * @description Compara password plana contra hash persistido.
   * @param {string} passwordPlano - Password ingresada.
   * @param {string} passwordHash - Hash almacenado.
   * @returns {Promise<boolean>} `true` cuando coincide.
   * @throws {Error} Implementacion pendiente en clase concreta.
   */
  async compararPassword(passwordPlano, passwordHash) {
    throw new Error("Not implemented");
  }
}

module.exports = UsuarioRepository;
