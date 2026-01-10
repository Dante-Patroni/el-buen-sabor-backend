const { Pedido, DetallePedido, Plato, Mesa } = require("../models");
const StockAdapter = require("../adapters/MongoStockAdapter");

// 👇 1. 🆕 IMPORTAR EL EMISOR DE EVENTOS
const pedidoEmitter = require("../events/pedidoEvents");

class PedidoService {
  constructor(pedidoRepository, stockAdapter, pedidoEmitter) {
    this.pedidoRepository = pedidoRepository;
    this.stockAdapter = stockAdapter;
    this.pedidoEmitter = pedidoEmitter;
  }

  // 1. CREAR PEDIDO (Soporta múltiples productos)
   async crearYValidarPedido(datosPedido) {
    const { mesa: mesaNumero, productos, cliente } = datosPedido;

    let totalCalculado = 0;
    const detallesParaCrear = [];

    // 1️⃣ Validar y calcular
    for (const item of productos) {
      const platoId = parseInt(item.platoId);
      const cantidad = parseInt(item.cantidad) || 1;

      if (!platoId || platoId < 1) {
        throw new Error("platoId inválido");
      }

      // Stock (infraestructura, pero abstracta)
      await this.stockAdapter.descontarStock(platoId, cantidad);

      // Precio (vía repository)
      const plato = await this.pedidoRepository.buscarPlatoPorId(platoId);
      if (!plato) {
        throw new Error(`El plato ID ${platoId} no existe`);
      }

      const subtotal = plato.precio * cantidad;
      totalCalculado += subtotal;

      detallesParaCrear.push({
        PlatoId: plato.id,
        cantidad,
        subtotal,
        aclaracion: item.aclaracion || ""
      });
    }

    // 2️⃣ Crear pedido
    const nuevoPedido = await this.pedidoRepository.crearPedido({
      mesa: mesaNumero,
      cliente: cliente || "Anónimo",
      estado: "pendiente",
      total: totalCalculado
    });

    // 3️⃣ Crear detalles
    await this.pedidoRepository.crearDetalles(
      detallesParaCrear.map(det => ({
        PedidoId: nuevoPedido.id,
        ...det
      }))
    );

    // 4️⃣ Actualizar mesa
    await this._actualizarMesa(mesaNumero, totalCalculado);

    // 5️⃣ Evento
    this.pedidoEmitter.emit("pedido-creado", {
      pedido: nuevoPedido.toJSON()
    });

    return nuevoPedido;
  }

  async _actualizarMesa(mesaId, monto) {
    const mesa = await this.pedidoRepository.buscarMesaPorId(mesaId);
    if (!mesa) return;

    const totalAnterior = parseFloat(mesa.totalActual) || 0;
    const nuevoTotal = Math.max(0, totalAnterior + parseFloat(monto));

    mesa.totalActual = nuevoTotal;
    mesa.estado = nuevoTotal > 0 ? "ocupada" : "libre";

    await this.pedidoRepository.actualizarMesa(mesa);
  }


  // 2. LISTAR PEDIDOS
  async listarPedidos(estado) {
    return await this.pedidoRepository.listarPedidosPorEstado(estado);
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