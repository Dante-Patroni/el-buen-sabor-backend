class UsuarioRepository {
    async buscarUsuarioPorId(legajo) {
        throw new Error("Método no implementado");
    }

    async compararPassword(passwordPlano, passwordHash) {
        throw new Error("Método no implementado");
    }
    
}

module.exports = UsuarioRepository;