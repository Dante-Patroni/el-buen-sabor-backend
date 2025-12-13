const { Pedido, DetallePedido, Plato, Mesa } = require("../models");
const StockAdapter = require("../adapters/MongoStockAdapter");

class PedidoService {

  constructor() {
    // Instanciamos el adapter para comunicarnos con Mongo
    this.stockAdapter = new StockAdapter();
  }

  // 1. CREAR PEDIDO
  async crearYValidarPedido(datosPedido) {
    const { mesa: mesaNumero, platoId, cliente } = datosPedido;

    try {
      // A. Validar Stock (MongoDB)
      const idProducto = parseInt(platoId);
      await this.stockAdapter.descontarStock(idProducto, 1);

      // B. Obtener Precio del Plato (MySQL)
      const plato = await Plato.findByPk(idProducto);
      if (!plato) throw new Error("PLATO_NO_ENCONTRADO");

      // C. Crear el Pedido (MySQL)
      const nuevoPedido = await Pedido.create({
        mesa: mesaNumero,
        cliente: cliente || "Anónimo",
        estado: 'pendiente',
        total: plato.precio
      });

      // D. Crear el Detalle
      await DetallePedido.create({
        PedidoId: nuevoPedido.id,
        PlatoId: plato.id,
        cantidad: 1,
        subtotal: plato.precio
      });

      // E. Actualizar la Mesa (Sincronización automática: SUMAR)
      await this._actualizarMesa(mesaNumero, plato.precio);

      return nuevoPedido;

    } catch (error) {
      console.error("Error en PedidoService:", error);
      throw error;
    }
  }

  // 2. LISTAR PEDIDOS (Con filtro opcional por estado)
  // Nota: Cambié el nombre de 'obtenerTodos' a 'listarPedidos' para coincidir con tu Controller
  async listarPedidos(estado) {
    const filtro = estado ? { where: { estado } } : {};

    return await Pedido.findAll({
      ...filtro,
      include: [DetallePedido]
    });
  }

  // 3. BUSCAR POR MESA (Faltaba este método)
  async buscarPedidosPorMesa(mesaNumero) {
    return await Pedido.findAll({
      where: { mesa: mesaNumero },
      include: [DetallePedido]
    });
  }

  // 4. ELIMINAR PEDIDO (Faltaba este método)
  async eliminarPedido(id) {
    try {
      // A. Buscar el pedido antes de borrarlo
      const pedido = await Pedido.findByPk(id);
      if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");

      // B. Restar el monto a la Mesa (IMPORTANTE: Mantenemos la consistencia)
      // Pasamos el precio en negativo para que la función _actualizarMesa lo reste
      await this._actualizarMesa(pedido.mesa, -pedido.total);

      // C. Intentar reponer Stock (Opcional, si tu Adapter lo soporta)
      // await this.stockAdapter.reponerStock(pedido.PlatoId, 1); 

      // D. Eliminar (o marcar como cancelado)
      await pedido.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // --- MÉTODOS PRIVADOS ---

  // Actualiza el total de la mesa (Sirve para SUMAR o RESTAR)
  async _actualizarMesa(mesaId, monto) {
    const mesa = await Mesa.findByPk(mesaId);
    if (mesa) {
      const totalAnterior = parseFloat(mesa.totalActual) || 0;
      const montoFloat = parseFloat(monto);

      let nuevoTotal = totalAnterior + montoFloat;

      // Evitamos negativos por error de redondeo
      if (nuevoTotal < 0) nuevoTotal = 0;

      mesa.totalActual = nuevoTotal;

      // Si el total es 0, la liberamos (opcional, o la dejamos ocupada hasta cerrar)
      if (nuevoTotal > 0) {
        mesa.estado = 'ocupada';
      }

      await mesa.save();
    }
  }
}

// 👇 ESTANDARIZACIÓN: Exportamos la Clase
module.exports = PedidoService;