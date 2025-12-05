// Importamos el Modelo de Base de Datos (Sequelize)
// Necesitamos leer los pedidos para saber qué mesas están ocupadas.
const { Pedido } = require("../models");
// ⚠️ Asegúrate de que tu archivo models/index.js exporte 'Pedido' correctamente.
// Si no usas index.js, importa directo: require('../models/sql/Pedido');

class MesaService {
  async listarEstadoMesas() {
    //1. DEFINICION FISICA (Virtual)
    // Como no tenemos tabla de mesas, definimos que el restaurante tiene 10 mesas.
    // Esto es lo que hace que el sistema sea un "MVP" rápido.

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

    //// 2. CONSULTA DE "LO QUE ESTÁ PASANDO" (Active Data)
    // Buscamos SOLO los pedidos que están vivos (ni pagados, ni rechazados).
    // Traemos 'pendiente' (recién pedido) y 'en_preparacion' (en cocina).

    const pedidosActivos = await Pedido.findAll({
      where: {
        estado: ["pendiente", "en_preparacion"],
      },
    });

    //// 3. PROCESAMIENTO: DETERMINAR EL ESTADO DE CADA MESA

    // Filtramos los pedidos que pertenecen a ESTA mesa actual (ej: Mesa 4)
    // Nota: Asegúrate de que en tu DB la columna sea 'mesa' (string o int)
    const estadoMesas = mesasFisicas.map((mesa) => {
      // Filtramos los pedidos que pertenecen a ESTA mesa actual (ej: Mesa 4)
      const pedidosDeLaMesa = pedidosActivos.filter(
        (pedido) => pedido.mesa == mesa.id,
      );

      // Si hay pedidos en esta mesa, está "ocupada"
      if (pedidosDeLaMesa.length > 0) {
        // 🔴 ANTES (Posible causante del null):
        // const totalAcumulado = pedidosDeLaMesa.reduce((sum, pedido) => sum + pedido.total, 0);

        // 🟢 AHORA (Blindado):
        // Parseamos a Float por si viene como texto ("1500.00") y usamos || 0 por si es null.
        const totalAcumulado = pedidosDeLaMesa.reduce((sum, pedido) => {
          const valorPedido = parseFloat(pedido.total) || 0;
          return sum + valorPedido;
        }, 0);
        const primerPedido = pedidosDeLaMesa.sort(
          (a, b) => a.fecha - b.fecha,
        )[0];

        return {
          ...mesa,
          estado: "ocupada",
          totalActual: totalAcumulado,
          itemsPendientes: pedidosDeLaMesa.length,
          fechaApertura: primerPedido.createdAt,
        };
      } else {
        // Si no hay pedidos, la mesa está "libre"
        return {
          ...mesa,
          estado: "libre",
          totalActual: 0,
        };
      }
    });

    //// 4. DEVOLVEMOS EL RESULTADO

    return estadoMesas;
    {
    }
  }
}

module.exports = MesaService;
