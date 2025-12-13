const { Mesa, Pedido, Sequelize } = require("../models");
const { Op } = Sequelize;

class MesaService {

  // 1. LISTAR MESAS
  async listar() {
    try {
      const mesas = await Mesa.findAll({
        order: [['id', 'ASC']]
      });
      return mesas;
    } catch (error) {
      console.error("Error en MesaService.listar:", error);
      throw error;
    }
  }

  // 2. CERRAR MESA (Lógica compleja de negocio)
  async cerrarMesa(mesaId) {
    try {
      // A. Liberar Mesa
      await Mesa.update({
        estado: 'libre',
        totalActual: 0.00,
        mozoId: null
      }, {
        where: { id: mesaId }
      });

      // B. Actualizar Pedidos a 'pagado'
      const [actualizados] = await Pedido.update(
        { estado: 'pagado' },
        {
          where: {
            mesa: mesaId,
            estado: { [Op.notIn]: ['pagado', 'rechazado'] }
          }
        }
      );

      return actualizados;
    } catch (error) {
      console.error("Error en MesaService.cerrarMesa:", error);
      throw error;
    }
  }
}


module.exports = MesaService;