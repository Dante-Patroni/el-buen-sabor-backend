const bcrypt = require("bcryptjs");
const { Usuario, Rol, Permiso, sequelize } = require("../../models");
const UsuarioRepository = require("../usuarioRepository");

class SequelizeUsuarioRepository extends UsuarioRepository {
  /**
   * @description Include reutilizable para cargar rol con permisos.
   */
  _includeRolConPermisos() {
    return [
      {
        model: Rol,
        as: "rol",
        attributes: ["id", "nombre"],
        include: [
          {
            model: Permiso,
            as: "permisos",
            attributes: ["id", "codigo"],
            through: { attributes: [] }, // no exponer tabla intermedia
          },
        ],
      },
    ];
  }

  /**
   * @description Ejecuta una operacion atomica usando transaccion de Sequelize.
   */
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

  /**
   * @description Lista usuarios con filtro opcional por activo.
   */
  async listar(incluirInactivos = false, transaction = null) {
    const where = incluirInactivos ? {} : { activo: true };

    return await Usuario.findAll({
      where,
      include: this._includeRolConPermisos(),
      order: [["id", "ASC"]],
      transaction,
    });
  }

  /**
   * @description Busca un usuario por clave primaria, incluyendo rol y permisos.
   */
  async buscarPorId(id, transaction = null) {
    return await Usuario.findByPk(id, {
      include: this._includeRolConPermisos(),
      transaction,
    });
  }

  /**
   * @description Busca un usuario por legajo, incluyendo rol y permisos.
   */
  async buscarPorLegajo(legajo, transaction = null) {
    return await Usuario.findOne({
      where: { legajo },
      include: this._includeRolConPermisos(),
      transaction,
    });
  }

  /**
   * @description Crea un usuario y lo retorna con rol y permisos.
   */
  async crear(datos, transaction = null) {
    const nuevo = await Usuario.create(datos, { transaction });

    // Recargar con include para devolver el DTO completo.
    return await this.buscarPorId(nuevo.id, transaction);
  }

  /**
   * @description Actualiza un usuario por id.
   */
  async actualizar(id, datos, transaction = null) {
    const [filasAfectadas] = await Usuario.update(datos, {
      where: { id },
      transaction,
    });

    return filasAfectadas;
  }

  /**
   * @description Realiza baja logica de usuario estableciendo `activo=false`.
   */
  async eliminarLogico(id, transaction = null) {
    const [filasAfectadas] = await Usuario.update(
      { activo: false },
      { where: { id }, transaction }
    );

    return filasAfectadas;
  }

  /**
   * @description Compara password plana contra hash usando bcrypt.
   */
  async compararPassword(passwordPlano, passwordHash) {
    return await bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = SequelizeUsuarioRepository;