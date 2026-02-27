const { Mesa, Usuario, sequelize } = require("../../models");
const MesaRepository = require("../mesaRepository");

class SequelizeMesaRepository extends MesaRepository {

  /**
   * @description Ejecuta una operacion atomica dentro de una transaccion Sequelize.
   * @param {(transaction: import("sequelize").Transaction) => Promise<any>} callback - Logica atomica.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Repropaga errores tras rollback.
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
   * @description Abre una mesa si se encuentra en estado libre.
   * @param {number|string} mesaId - Id de la mesa.
   * @param {number|string} mozoId - Id del mozo asignado.
   * @returns {Promise<number>} Cantidad de filas afectadas.
   */
  async abrirMesaSiEstaLibre(mesaId, mozoId) {
    const [affectedRows] = await Mesa.update(
      {
        estado: "ocupada",
        mozoId: mozoId,
        totalActual: 0
      },
      {
        where: {
          id: mesaId,
          estado: "libre"
        }
      }
    );

    return affectedRows;
  }


  /**
   * @description Trae todas las mesas con su mozo asociado.
   * @returns {Promise<Array<object>>} Mesas ordenadas por id.
   */
  async listarMesasConMozo() {
    return await Mesa.findAll({
      order: [['id', 'ASC']],
      include: [{
        model: Usuario,
        as: 'mozo',
        attributes: ['nombre', 'apellido', 'legajo']
      }]
    });
  }

  /**
   * @description Busca una mesa por su ID.
   * @param {number|string} id - Id de la mesa.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Mesa encontrada o `null`.
   */
  async buscarMesaPorId(id, transaction = null) {
    return await Mesa.findByPk(id, { transaction });
  }


  /**
   * @description Persiste los cambios de una entidad mesa existente.
   * @param {object} mesa - Instancia de mesa modificada.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa persistida.
   */
  async actualizarMesa(mesa, transaction = null) {
    return await mesa.save({ transaction });
  }

}

module.exports = SequelizeMesaRepository;
