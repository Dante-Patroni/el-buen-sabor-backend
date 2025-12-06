// Importamos el Modelo de Base de Datos (Sequelize)
const { Pedido, Sequelize } = require("../models");
const { Op } = Sequelize; // Importamos el Operador de Sequelize

class MesaService {
  
  // ---------------------------------------------------------
  // 1. LISTAR ESTADO (GET)
  // ---------------------------------------------------------
  async listarEstadoMesas() {
    // 1. DEFINICION FISICA (Virtual)
    const mesasFisicas = [
      { id: 1, nombre: "Mesa 1" },
      { id: 2, nombre: "Mesa 2" },
      { id: 3, nombre: "Mesa 3" },
      { id: 4, nombre: "Mesa 4" },
      { id: 5, nombre: "Mesa 5" },
      { id: 6, nombre: "Mesa 6" },
      { id: 7, nombre: "Mesa 7" },
      { id: 8, nombre: "Mesa 8" },
      { id: 9, nombre: "Mesa 9" },
      { id: 10, nombre: "Mesa 10" },
    ];

    // 2. CONSULTA DE "LO QUE ESTÁ PASANDO" (Active Data)
    const pedidosActivos = await Pedido.findAll({
      where: {
        estado: ["pendiente", "en_preparacion", "entregado"], // Agregué 'entregado' porque si están comiendo, la mesa sigue ocupada
      },
    });

    // 3. PROCESAMIENTO
    const estadoMesas = mesasFisicas.map((mesa) => {
      // Filtramos pedidos de ESTA mesa
      const pedidosDeLaMesa = pedidosActivos.filter(
        (pedido) => String(pedido.mesa) === String(mesa.id), // Conversión a String para evitar errores de tipo
      );

      if (pedidosDeLaMesa.length > 0) {
        // Calculamos total blindado
        const totalAcumulado = pedidosDeLaMesa.reduce((sum, pedido) => {
          const valorPedido = parseFloat(pedido.total) || 0;
          return sum + valorPedido;
        }, 0);
        
        // Buscamos fecha de apertura
        const primerPedido = pedidosDeLaMesa.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        )[0];

        return {
          ...mesa,
          estado: "ocupada",
          totalActual: totalAcumulado,
          itemsPendientes: pedidosDeLaMesa.length,
          fechaApertura: primerPedido ? primerPedido.createdAt : new Date(),
        };
      } else {
        return {
          ...mesa,
          estado: "libre",
          totalActual: 0,
        };
      }
    });

    return estadoMesas;
  }

  // ---------------------------------------------------------
  // 2. CERRAR MESA (Actualización Masiva - EBS-13)
  // ---------------------------------------------------------
  async cerrarMesa(mesaId) {
    // Ejecutamos un UPDATE masivo en la tabla Pedidos
    // UPDATE Pedidos SET estado = 'pagado' WHERE mesa = mesaId AND estado != 'pagado'...

    const [cantidadActualizados] = await Pedido.update(
      { estado: 'pagado' }, 
      {
        where: {
          mesa: mesaId,
          estado: {
            [Op.notIn]: ['pagado', 'rechazado']
          }
        }
      }
    );
    return cantidadActualizados; // Devuelve cuántos pedidos se cobraron
  }
}

module.exports = MesaService;