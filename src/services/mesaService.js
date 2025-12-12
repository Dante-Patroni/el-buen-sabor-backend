// Importamos los modelos NUEVOS que creamos
const { Mesa, Usuario, Pedido, Sequelize } = require("../models");
const { Op } = Sequelize;

class MesaService {

  // ---------------------------------------------------------
  // 1. LISTAR ESTADO (GET) - AHORA CONECTADO A BASE DE DATOS
  // ---------------------------------------------------------
  async listar() {
    try {
      // 👇 MAGIA: Ya no usamos un array fijo. Leemos la tabla 'mesas' real.
      const mesas = await Mesa.findAll({
        // Incluimos al Mozo para ver quién atiende (EBS-20)
        include: [{
          model: Usuario,
          as: 'mozo',
          attributes: ['nombre', 'apellido', 'legajo'] // Solo traemos datos útiles, no la password
        }],
        order: [['id', 'ASC']] // Ordenamos por número de mesa
      });
      
      return mesas;
    } catch (error) {
      console.error("Error al listar mesas desde BD:", error);
      throw error;
    }
  }

  // ---------------------------------------------------------
  // 2. CERRAR MESA (Híbrido: Actualiza Mesa + Pedidos)
  // ---------------------------------------------------------
  async cerrarMesa(mesaId) {
    try {
      // PASO A: Liberar la Mesa Física (Tabla 'mesas')
      // Esto hace que en el mapa se ponga verde y se borre el total visual
      await Mesa.update({
        estado: 'libre',
        totalActual: 0.00,
        mozoId: null // Desasignamos al mozo
      }, {
        where: { id: mesaId }
      });

      // PASO B: Marcar Pedidos como Pagados (Tabla 'Pedidos')
      // Mantenemos esto para que tu historial de ventas quede correcto
      const [cantidadActualizados] = await Pedido.update(
        { estado: 'pagado' }, 
        {
          where: {
            mesa: mesaId, // Nota: Aquí seguimos usando el string "Mesa 1" o el ID según como lo guardes
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

module.exports = new MesaService();