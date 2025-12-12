const { Mesa, Pedido, Sequelize } = require("../models");
const { Op } = Sequelize;

class MesaService {

  // 1. LISTAR (GET)
  async listar() {
    // Verificación de seguridad: ¿Existe el modelo?
    if (!Mesa) {
        throw new Error("CRITICAL: El modelo Mesa no se cargó correctamente.");
    }

    // Buscamos simple, sin asociaciones peligrosas por ahora
    const mesas = await Mesa.findAll({
      order: [['id', 'ASC']]
    });
    
    return mesas;
  }

  // 2. CERRAR MESA
  async cerrarMesa(mesaId) {
    // Limpiamos la mesa
    await Mesa.update({
      estado: 'libre', 
      totalActual: 0.00,
      mozoId: null 
    }, {
      where: { id: mesaId }
    });

    // Marcamos pedidos como pagados
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
  }
}

// 👇 EXPORTAMOS LA INSTANCIA (IMPORTANTE)
module.exports = new MesaService();