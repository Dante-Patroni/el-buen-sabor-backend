const { Usuario } = require("../../models");
const bcrypt = require('bcryptjs');
const UsuarioRepository = require("../usuarioRepository");

class SequelizeUsuarioRepository extends UsuarioRepository {


  async buscarUsuarioPorId(legajo) {
    return await Usuario.findOne({ where: { legajo } });

  }

  async compararPassword(passwordPlano, passwordHash) {
     // Usamos 'bcrypt.compare' para verificar si "1234" coincide con el Hash de la BD.
    return await bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = SequelizeUsuarioRepository;
