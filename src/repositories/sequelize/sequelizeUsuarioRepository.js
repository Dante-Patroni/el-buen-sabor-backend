const bcrypt = require("bcryptjs");
const { Usuario, sequelize } = require("../../models");
const UsuarioRepository = require("../usuarioRepository");

class SequelizeUsuarioRepository extends UsuarioRepository {
  // Ejecuta un bloque atomico. Si algo falla, todo vuelve atras.
  async inTransaction(callback) {
    const transaction = await sequelize.transaction();

    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Por defecto lista solo usuarios activos.
  async listar(incluirInactivos = false, transaction = null) {
    const where = incluirInactivos ? {} : { activo: true };

    return await Usuario.findAll({
      where,
      order: [["id", "ASC"]],
      transaction,
    });
  }

  async buscarPorId(id, transaction = null) {
    return await Usuario.findByPk(id, { transaction });
  }

  // Se usa tanto para login como para validar legajo duplicado.
  async buscarPorLegajo(legajo, transaction = null) {
    return await Usuario.findOne({
      where: { legajo },
      transaction,
    });
  }

  async crear(datos, transaction = null) {
    return await Usuario.create(datos, { transaction });
  }

  // Devuelve cantidad de filas afectadas (estilo Sequelize).
  async actualizar(id, datos, transaction = null) {
    const [filasAfectadas] = await Usuario.update(datos, {
      where: { id },
      transaction,
    });

    return filasAfectadas;
  }

  // "Delete" de usuario = baja logica (activo=false).
  async eliminarLogico(id, transaction = null) {
    const [filasAfectadas] = await Usuario.update(
      { activo: false },
      {
        where: { id },
        transaction,
      }
    );

    return filasAfectadas;
  }

  // Nunca comparar passwords manualmente: siempre bcrypt.compare.
  async compararPassword(passwordPlano, passwordHash) {
    return await bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = SequelizeUsuarioRepository;
