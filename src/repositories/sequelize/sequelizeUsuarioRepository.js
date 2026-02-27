const bcrypt = require("bcryptjs");
const { Usuario, sequelize } = require("../../models");
const UsuarioRepository = require("../usuarioRepository");

class SequelizeUsuarioRepository extends UsuarioRepository {
  /**
   * @description Ejecuta una operacion atomica usando transaccion de Sequelize.
   * @param {(transaction: import("sequelize").Transaction) => Promise<any>} callback - Logica atomica.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Repropaga cualquier error tras rollback.
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
   * @param {boolean} incluirInactivos - Si es `true`, no filtra por activo.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<object>>} Usuarios encontrados.
   */
  async listar(incluirInactivos = false, transaction = null) {
    const where = incluirInactivos ? {} : { activo: true };

    return await Usuario.findAll({
      where,
      order: [["id", "ASC"]],
      transaction,
    });
  }

  /**
   * @description Busca un usuario por clave primaria.
   * @param {number|string} id - Id del usuario.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Usuario encontrado o `null`.
   */
  async buscarPorId(id, transaction = null) {
    return await Usuario.findByPk(id, { transaction });
  }

  /**
   * @description Busca un usuario por legajo.
   * @param {string} legajo - Legajo a consultar.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Usuario encontrado o `null`.
   */
  async buscarPorLegajo(legajo, transaction = null) {
    return await Usuario.findOne({
      where: { legajo },
      transaction,
    });
  }

  /**
   * @description Crea un usuario.
   * @param {object} datos - Datos validados del usuario.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Usuario creado.
   */
  async crear(datos, transaction = null) {
    return await Usuario.create(datos, { transaction });
  }

  /**
   * @description Actualiza un usuario por id.
   * @param {number|string} id - Id del usuario.
   * @param {object} datos - Campos a actualizar.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Cantidad de filas afectadas.
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
   * @param {number|string} id - Id del usuario.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Cantidad de filas afectadas.
   */
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

  /**
   * @description Compara password plana contra hash usando bcrypt.
   * @param {string} passwordPlano - Password sin hash.
   * @param {string} passwordHash - Hash almacenado.
   * @returns {Promise<boolean>} `true` cuando coincide.
   */
  async compararPassword(passwordPlano, passwordHash) {
    return await bcrypt.compare(passwordPlano, passwordHash);
  }
}

module.exports = SequelizeUsuarioRepository;
