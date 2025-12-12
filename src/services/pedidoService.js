/* Este es el Corazón de la Lógica de Negocio (Business Logic Layer). 
A diferencia de los Controladores (que solo reciben y responden) o los
 Modelos (que solo guardan datos), el Servicio es el que Piensa y 
 Toma Decisiones.*/
const { Pedido, Plato, Mesa, Sequelize } = require('../models');
const { Op } = Sequelize; // Importamos el Operador de Sequelize
const StockAdapter = require('../adapters/MongoStockAdapter');

class PedidoService {
  // 1. 👇 CORRECCIÓN: Instanciamos el adaptador aquí mismo
  constructor() {
    this.stockAdapter = new StockAdapter();
  }

  // LÓGICA: CREAR PEDIDO
  async crearYValidarPedido(cliente, platoId, mesa) {
    // 🛡️ BLINDAJE: Aseguramos que sea número
    const idProducto = parseInt(platoId);

    // 1. Validación de entrada
    if (!mesa || mesa.toString().trim() === "") {
      throw new Error("MESA_REQUERIDA");
    }

    // 2. PASO A: Verificar Stock
    const stockActual = await this.stockAdapter.obtenerStock(idProducto);

    if (stockActual <= 0) {
      console.error(`Error Stock: ID ${idProducto} tiene stock ${stockActual}`);
      throw new Error("STOCK_INSUFICIENTE");
    }

    // 3. Obtener el precio
    const platoInfo = await Plato.findByPk(idProducto);

    if (!platoInfo) {
      throw new Error("PLATO_NO_ENCONTRADO");
    }

    // 4. PASO B: Descontar Stock
    await this.stockAdapter.descontarStock(idProducto, 1);

    // 5. PASO C: Crear el Pedido
    const nuevoPedido = await Pedido.create({
      mesa,
      cliente,
      PlatoId: idProducto,
      fecha: new Date(),
      estado: "pendiente",
      total: platoInfo.precio,
    });

    // 👇 6. EL FIX: Actualizar el estado de la Mesa a 'OCUPADA'
    if (mesa) {
        console.log(`🔄 Cambiando estado de Mesa ${mesa} a OCUPADA...`);
        try {
            // Actualizamos la mesa. Asumimos que 'mesa' es el ID (primary key).
            await Mesa.update(
                { estado: 'ocupada' },
                totalActual: platoInfo.precio, 
                { where: { id: mesa } } 
            );
        } catch (error) {
            console.error("⚠️ Error actualizando estado de la mesa:", error.message);
        }
    }

    return nuevoPedido;
  }

  // LÓGICA: LISTAR PEDIDOS (Con filtro opcional por estadoFilter)
  async listarPedidos(estadoFilter) {
    // 1. Preparamos la clausula WHERE si hay filtro
    const whereClause = {};

    // Si se proporciona un estadoFilter, lo añadimos a la cláusula WHERE
    if (estadoFilter) {
      whereClause.estado = estadoFilter;
    }
    //2. Ejecutamos la consulta con el filtro y ordenación
    const pedidos = await Pedido.findAll({
      where: whereClause, // Filtro dinámico
      order: [["createdAt", "DESC"]],
    });
    return pedidos;
  }

  // 🆕 LÓGICA: ELIMINAR PEDIDO (Con reposición de stock)
  async eliminarPedido(id) {
    // 1. Buscar el pedido en MySQL para saber qué plato tenía
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      throw new Error("PEDIDO_NO_ENCONTRADO");
    }

    // 2. Devolver el Stock a Mongo (Rollback)
    // Solo reponemos si el pedido no estaba ya rechazado
    if (pedido.estado !== "rechazado") {
      await this.stockAdapter.reponerStock(pedido.PlatoId, 1);
    }

    // 3. Borrar físicamente de MySQL
    await pedido.destroy();

    return true;
  }

  // ---------------------------------------------------------
  // 3. BUSCAR POR MESA (Historial de Sesión)
  // ---------------------------------------------------------
  async buscarPedidosPorMesa(mesaNumero) {
    // Buscamos pedidos que coincidan con la mesa
    // Y que NO estén rechazados (ni pagados en el futuro)
    const pedidos = await Pedido.findAll({
      where: {
        mesa: mesaNumero,
        estado: {
          [Op.not]: ["rechazado", "pagado"] // Excluimos los pedidos rechazados/pagados
        }
      },
      include: [{
        model: Plato, //Traemos datos del plato (nombre, precio) para mostrar en el historial
        attributes: ['nombre', 'precio', 'imagenPath']
      }],
      order: [['createdAt', 'DESC']] // Ordenamos por fecha descendente
    });
    return pedidos;
  }
}

// Exportamos la instancia lista para usar
module.exports = new PedidoService();