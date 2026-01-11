const { Mesa, Usuario } = require("../../models");
const MesaRepository = require("../mesaRepository");

class SequelizeMesaRepository extends MesaRepository {

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
  async buscarMesaPorId(id) {
    return await Mesa.findByPk(id);
  }

  /**
   * Persiste una mesa ya modificada
   * El Service decide QUÉ cambiar
   */
  async actualizarMesa(mesa) {
    return await mesa.save();
  }
}

module.exports = SequelizeMesaRepository;
