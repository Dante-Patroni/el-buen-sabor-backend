const { Mesa, Pedido, Usuario, Sequelize } = require("../models");
const { Op } = Sequelize;

class MesaService {

  // 1. LISTAR MESAS
  async listar() {
    try {
      const mesas = await Mesa.findAll({
        order: [['id', 'ASC']],
        // 👇 ESTO ES CRÍTICO: "Eager Loading"
        // Le dice a Sequelize: "Traeme también los datos del Mozo asociado"
        include: [{
          model: Usuario,
          as: 'mozo', // Debe coincidir con tu belongsTo en mesa.js
          attributes: ['nombre', 'apellido', 'legajo'] // Solo traemos lo necesario, no la password
        }]
      });
      return mesas;
    } catch (error) {
      console.error("Error en MesaService.listar:", error);
      throw error;
    }
  }
  // 2. ABRIR MESA
  async abrirMesa(idMesa, idMozo) {
    try {
      const mesa = await Mesa.findByPk(idMesa);
      if (!mesa) throw new Error('Mesa no encontrada');
      
      if (mesa.estado === 'ocupada') throw new Error('La mesa ya está ocupada');

      mesa.estado = 'ocupada';
      mesa.mozoId = idMozo; // Vinculamos al mozo
      await mesa.save();

      return mesa;
    } catch (error) {
      console.error("Error en MesaService.abrirMesa:", error);
      throw error;
    }
  }

  // 3. CERRAR MESA (Lógica compleja de negocio)
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