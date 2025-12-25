const { Pedido, DetallePedido, Plato, Mesa, sequelize } = require("../models");
const StockAdapter = require("../adapters/MongoStockAdapter");
const { Op } = require('sequelize'); // 🆕 Para operadores lógicos
const pedidoEmitter = require('../events/pedidoEvents');

class PedidoService {

  constructor() {
    // Instanciamos el adapter para comunicarnos con Mongo
    this.stockAdapter = new StockAdapter();
  }

  // 1. CREAR PEDIDO
  // 1. CREAR PEDIDO (Soporta múltiples productos)
  async crearYValidarPedido(datosPedido) {
    // 👇 CAMBIO 1: Ahora extraemos 'productos' (el array), no un solo platoId
    const { mesa: mesaNumero, productos, cliente } = datosPedido;

    try {
      let totalCalculado = 0;
      const detallesParaCrear = []; // Guardamos los datos temporalmente

      // A. Validar y Calcular (Iteramos sobre cada producto del array)
      for (const item of productos) {
        const idProducto = parseInt(item.platoId);
        const cantidad = parseInt(item.cantidad) || 1;

        // 1. Validar Stock (MongoDB) - Descontamos la cantidad solicitada
        await this.stockAdapter.descontarStock(idProducto, cantidad);

        // 2. Obtener Precio (MySQL)
        const plato = await Plato.findByPk(idProducto);
        if (!plato) throw new Error(`El plato ID ${idProducto} no existe`);

        // 3. Calcular Subtotal
        const subtotal = plato.precio * cantidad;
        totalCalculado += subtotal;

        // 4. Preparamos el detalle para guardarlo luego
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
        total: totalCalculado // 👇 Total real de la suma de todo
      });

      // C. Crear los Detalles (MySQL) - Renglones
      for (const detalle of detallesParaCrear) {
        await DetallePedido.create({
          PedidoId: nuevoPedido.id, // Vinculamos al pedido recién creado
          ...detalle
        });
      }

      // D. Actualizar la Mesa (Sincronización automática: SUMAR TOTAL)
      await this._actualizarMesa(mesaNumero, totalCalculado);

      return nuevoPedido;

    } catch (error) {
      console.error("Error en PedidoService:", error);
      // Opcional: Aquí podrías implementar una lógica para "devolver" el stock si algo falla
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

  // =================================================================
    // 💰 CERRAR MESA (Versión Debuggeada y Blindada)
    // =================================================================
    async cerrarMesa(mesaId) {
        const t = await sequelize.transaction();

        try {
            console.log(`🔎 Servicio: Buscando Mesa ID ${mesaId}...`);
            const mesa = await Mesa.findByPk(mesaId, { transaction: t });

            if (!mesa) throw new Error('Mesa no encontrada');

            // 👇 IMPRIMIMOS LO QUE ENCONTRAMOS (Para ver si tiene número)
            console.log("📄 Datos de la Mesa encontrada:", mesa.toJSON());

            // 🛡️ PARCHE DE SEGURIDAD (FALLBACK):
            // Si la columna 'numero' está vacía, usamos el ID convertido a string.
            // Esto evita que 'mesa.numero' sea undefined.
            const numeroParaBuscar = mesa.numero || mesa.id.toString();
            
            console.log(`🎯 Buscando pedidos para la mesa visual: "${numeroParaBuscar}"`);

            const pedidosPorCobrar = await Pedido.findAll({
                where: {
                    // Usamos la variable segura
                    mesa: numeroParaBuscar, 
                    estado: { [Op.notIn]: ['pagado', 'rechazado'] }
                },
                transaction: t
            });

            if (pedidosPorCobrar.length === 0) {
                console.log("⚠️ No se encontraron pedidos cobrables.");
                throw new Error('La mesa no tiene consumos pendientes de cobro.');
            }

            console.log(`💰 Encontrados ${pedidosPorCobrar.length} pedidos. Calculando total...`);

            const totalCalculado = pedidosPorCobrar.reduce((acc, p) => acc + p.total, 0);

            await Pedido.update(
                { estado: 'pagado' },
                {
                    where: {
                        id: pedidosPorCobrar.map(p => p.id)
                    },
                    transaction: t
                }
            );

            mesa.estado = 'libre';
            mesa.totalActual = 0;
            await mesa.save({ transaction: t });

            await t.commit();

            // Evento
            pedidoEmitter.emit('mesa-cerrada', { 
                mesaId, 
                mesaNumero: numeroParaBuscar,
                total: totalCalculado,
                items: pedidosPorCobrar.length 
            });

            return {
                mensaje: 'Mesa cerrada correctamente',
                totalCobrado: totalCalculado,
                pedidosProcesados: pedidosPorCobrar.length
            };

        } catch (error) {
            await t.rollback();
            // Re-lanzamos el error para que el Controller lo muestre
            throw error; 
        }
    }
}

// 👇 ESTANDARIZACIÓN: Exportamos la Clase
module.exports = PedidoService;