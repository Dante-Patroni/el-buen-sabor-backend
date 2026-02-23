const { Mesa, Usuario, sequelize } = require("../../models");
const MesaRepository = require("../mesaRepository");

class SequelizeMesaRepository extends MesaRepository {


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
   * Trae todas las mesas con su mozo asociado
   * Infraestructura pura (ORM)
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
   * Busca una mesa por su ID
   * No valida negocio, solo devuelve datos
   */
  async buscarMesaPorId(id, transaction = null) {
    return await Mesa.findByPk(id, { transaction });
  }


  /**
   * Persiste una mesa ya modificada
   * El Service decide QUÉ cambiar
   */
  async actualizarMesa(mesa, transaction = null) {
    return await mesa.save({ transaction });
  }

}

module.exports = SequelizeMesaRepository;
