const { Pedido, DetallePedido, Plato, Mesa } = require("../models");
const StockAdapter = require("../adapters/MongoStockAdapter");

// 👇 1. 🆕 IMPORTAR EL EMISOR DE EVENTOS
const pedidoEmitter = require("../events/pedidoEvents"); 

class PedidoService {

  constructor() {
    this.stockAdapter = new StockAdapter();
  }

  // 1. CREAR PEDIDO (Soporta múltiples productos)
  async crearYValidarPedido(datosPedido) {
    const { mesa: mesaNumero, productos, cliente } = datosPedido;

    try {
      let totalCalculado = 0;
      const detallesParaCrear = []; 

      // A. Validar y Calcular
      for (const item of productos) {
        const idProducto = parseInt(item.platoId);
        const cantidad = parseInt(item.cantidad) || 1;

        // 1. Validar Stock (MongoDB)
        await this.stockAdapter.descontarStock(idProducto, cantidad);

        // 2. Obtener Precio (MySQL)
        const plato = await Plato.findByPk(idProducto);
        if (!plato) throw new Error(`El plato ID ${idProducto} no existe`);

        // 3. Calcular Subtotal
        const subtotal = plato.precio * cantidad;
        totalCalculado += subtotal;

        // 4. Preparamos detalle
        detallesParaCrear.push({
          PlatoId: plato.id,
          cantidad: cantidad,
          subtotal: subtotal,
          aclaracion: item.aclaracion || ""
        });
      }

      // B. Crear el Pedido (MySQL) - Cabecera
      const nuevoPedido = await Pedido.create({
        mesa: mesaNumero,
        cliente: cliente || "Anónimo",
        estado: 'pendiente',
        total: totalCalculado 
      });

      // C. Crear los Detalles (MySQL) - Renglones
      for (const detalle of detallesParaCrear) {
        await DetallePedido.create({
          PedidoId: nuevoPedido.id, 
          ...detalle
        });
      }

      // D. Actualizar la Mesa
      await this._actualizarMesa(mesaNumero, totalCalculado);

      // 👇 2. 🆕 ¡EL MOMENTO MÁGICO! DISPARAMOS EL EVENTO
      // Esto despierta al Listener (setupListeners.js), que a su vez grita por WebSocket
      console.log("📢 SERVICE: Emitiendo evento 'pedido-creado'...");
      pedidoEmitter.emit("pedido-creado", { pedido: nuevoPedido.toJSON() });

      return nuevoPedido;

    } catch (error) {
      console.error("Error en PedidoService:", error);
      throw error;
    }
  }

  // 2. LISTAR PEDIDOS
  async listarPedidos(estado) {
    const filtro = estado ? { where: { estado } } : {};
    return await Pedido.findAll({
      ...filtro,
      include: [DetallePedido]
    });
  }

  // 3. BUSCAR POR MESA
  async buscarPedidosPorMesa(mesaNumero) {
    return await Pedido.findAll({
      where: { mesa: mesaNumero },
      include: [DetallePedido]
    });
  }

  // 4. ELIMINAR PEDIDO
  async eliminarPedido(id) {
    try {
      const pedido = await Pedido.findByPk(id);
      if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");
      await this._actualizarMesa(pedido.mesa, -pedido.total);
      await pedido.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 5. CERRAR MESA
  async cerrarMesa(mesaId) {
    try {
      const mesa = await Mesa.findByPk(mesaId);
      if (!mesa) throw new Error("Mesa no encontrada");

      const pedidosPendientes = await Pedido.findAll({
        where: { mesa: mesaId, estado: 'pendiente' }
      });

      const totalCierre = mesa.totalActual || 0;

      // Actualizar estados
      const { Op } = require("sequelize");
      await Pedido.update(
        { estado: 'pagado' },
        {
          where: {
            mesa: mesaId,
            estado: {
              [Op.or]: [
                { [Op.eq]: 'pendiente' },
                { [Op.eq]: 'en_preparacion' },
                { [Op.eq]: 'entregado' },
                { [Op.is]: null },
                { [Op.eq]: '' }
              ]
            }
          }
        }
      );

      // Liberar mesa
      mesa.estado = 'libre';
      mesa.totalActual = 0;
      mesa.mozoAsignado = null; 
      await mesa.save();

      return {
        mesaId: mesa.id,
        totalCobrado: totalCierre,
        pedidosCerrados: pedidosPendientes.length
      };

    } catch (error) {
      console.error("Error al cerrar mesa:", error);
      throw error;
    }
  }

  // --- MÉTODOS PRIVADOS ---
  async _actualizarMesa(mesaId, monto) {
    const mesa = await Mesa.findByPk(mesaId);
    if (mesa) {
      const totalAnterior = parseFloat(mesa.totalActual) || 0;
      const montoFloat = parseFloat(monto);
      let nuevoTotal = totalAnterior + montoFloat;
      if (nuevoTotal < 0) nuevoTotal = 0;
      mesa.totalActual = nuevoTotal;
      if (nuevoTotal > 0) mesa.estado = 'ocupada';
      await mesa.save();
    }
  }
}

module.exports = PedidoService;