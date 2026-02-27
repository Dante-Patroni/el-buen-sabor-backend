class RubroRepository {
   /**
    * @description Ejecuta una funcion en transaccion y administra commit/rollback.
    * @param {(transaction: object) => Promise<any>} callback - Logica atomica a ejecutar.
    * @returns {Promise<any>} Resultado del callback.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async inTransaction(callback) {
      throw new Error("Not implemented");
   }

   /**
    * @description Lista rubros en estructura jerarquica.
    * @returns {Promise<Array<object>>} Jerarquia de rubros.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async listarJerarquia() {
      throw new Error("Not implemented");
   }

   /**
    * @description Busca un rubro por id.
    * @param {number|string} id - Id del rubro.
    * @returns {Promise<object|null>} Rubro encontrado o `null`.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async buscarPorId(id) {
      throw new Error("Not implemented");
   }

   /**
    * @description Busca rubro por denominacion y padre (incluye activos e inactivos).
    * @param {string} denominacionNormalizada - Denominacion normalizada.
    * @param {number|null} padreId - Id de rubro padre o `null`.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<object|null>} Rubro encontrado o `null`.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async buscarPorDenominacionYPadre(denominacionNormalizada, padreId, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Busca duplicado por denominacion/padre excluyendo un id existente.
    * @param {string} denominacion - Denominacion normalizada.
    * @param {number|null} padreId - Id del padre o `null`.
    * @param {number} excluirId - Id a excluir en la busqueda.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<object|null>} Rubro duplicado o `null`.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async buscarPorDenominacionYPadreExcluyendoId(denominacion, padreId, excluirId, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Crea un rubro nuevo.
    * @param {object} datos - Datos del rubro.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<object>} Rubro creado.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async crear(datos, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Actualiza un rubro existente.
    * @param {number|string} id - Id del rubro.
    * @param {object} datos - Campos a actualizar.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<number|object>} Resultado de actualizacion.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async actualizar(id, datos, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Realiza baja logica de un rubro.
    * @param {number|string} id - Id del rubro.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<number|object>} Resultado de eliminacion.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async eliminar(id, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Indica si un rubro existe y esta activo.
    * @param {number|string} id - Id del rubro.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<boolean>} `true` si existe activo.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async existeActivo(id, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Verifica si un rubro tiene subrubros activos.
    * @param {number|string} id - Id del rubro padre.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<boolean>} `true` si tiene subrubros activos.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async tieneSubrubrosActivos(id, transaction = null) {
      throw new Error("Not implemented");
   }

   /**
    * @description Verifica si un rubro tiene platos activos asociados.
    * @param {number|string} id - Id del rubro.
    * @param {object|null} transaction - Transaccion opcional.
    * @returns {Promise<boolean>} `true` si tiene platos asociados.
    * @throws {Error} Implementacion pendiente en clase concreta.
    */
   async tienePlatosAsociados(id, transaction = null) {
      throw new Error("Not implemented");
   }
}
module.exports = RubroRepository;
