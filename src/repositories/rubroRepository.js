class RubroRepository {

   async inTransaction(callback) {
      throw new Error("Not implemented");
   }

   async listarJerarquia() {
      throw new Error("Not implemented");
   }

   async buscarPorId(id) {
      throw new Error("Not implemented");
   }

   async buscarPorDenominacionYPadre(denominacionNormalizada, padreId, transaction = null) {
      throw new Error("Not implemented");
   }

   async buscarPorDenominacionYPadreExcluyendoId(denominacion, padreId, excluirId, transaction = null) {
      throw new Error("Not implemented");
   }

   async crear(datos, transaction = null) {
      throw new Error("Not implemented");
   }

   async actualizar(id, datos, transaction = null) {
      throw new Error("Not implemented");
   }

   async eliminar(id, transaction = null) {
      throw new Error("Not implemented");
   }

   async existeActivo(id, transaction = null) {
      throw new Error("Not implemented");
   }

   async tieneSubrubrosActivos(id, transaction = null) {
      throw new Error("Not implemented");
   }

   async tienePlatosAsociados(id, transaction = null) {
      throw new Error("Not implemented");
   }
}
module.exports = RubroRepository;