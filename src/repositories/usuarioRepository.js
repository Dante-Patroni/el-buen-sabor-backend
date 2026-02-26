class UsuarioRepository {
  // Contrato de transacciones: el Service define la logica,
  // el Repository ejecuta commit/rollback.
  async inTransaction(callback) {
    throw new Error("Not implemented");
  }

  // Consultas
  async listar(incluirInactivos = false, transaction = null) {
    throw new Error("Not implemented");
  }

  async buscarPorId(id, transaction = null) {
    throw new Error("Not implemented");
  }

  async buscarPorLegajo(legajo, transaction = null) {
    throw new Error("Not implemented");
  }

  // Escrituras
  async crear(datos, transaction = null) {
    throw new Error("Not implemented");
  }

  async actualizar(id, datos, transaction = null) {
    throw new Error("Not implemented");
  }

  async eliminarLogico(id, transaction = null) {
    throw new Error("Not implemented");
  }

  // Seguridad de autenticacion
  async compararPassword(passwordPlano, passwordHash) {
    throw new Error("Not implemented");
  }
}

module.exports = UsuarioRepository;
