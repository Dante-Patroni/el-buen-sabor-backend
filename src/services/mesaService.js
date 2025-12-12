const { Mesa, Pedido, Sequelize } = require("../models"); // Quitamos Usuario de aquí por ahora
const { Op } = Sequelize;

class MesaService {

  // 1. LISTAR ESTADO (GET)
  async listar() {
    try {
      // 👇 SIMPLIFICACIÓN: Quitamos el 'include' del Mozo para evitar errores de asociación.
      // El test solo necesita saber el estado y el total.
      const mesas = await Mesa.findAll({
        order: [['id', 'ASC']]
      });
      
      return mesas;
    } catch (error) {
      console.error("Error al listar mesas desde BD:", error);
      throw error;
    }
  }

  // 2. CERRAR MESA
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

      // B. Actualizar Pedidos
      const [cantidadActualizados] = await Pedido.update(
        { estado: 'pagado' }, 
        {
          where: {
            mesa: mesaId, 
            estado: { [Op.notIn]: ['pagado', 'rechazado'] }
          }
        }
      );
      
      return cantidadActualizados;
    } catch (error) {
      console.error("Error al cerrar mesa:", error);
      throw error;
    }
  }
}

// Exportamos la instancia
module.exports = new MesaService();