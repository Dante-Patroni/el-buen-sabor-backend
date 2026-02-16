
// NO importamos modelos directamente en el service
// el service habla SOLO con repositories

class PedidoService {
  constructor(pedidoRepository, platoService, mesaService, pedidoEmitter) {
    this.pedidoRepository = pedidoRepository;
    this.platoService = platoService;
    this.mesaService = mesaService;
    this.pedidoEmitter = pedidoEmitter;
  }

  // 1. CREAR PEDIDO (Soporta múltiples productos)

  async crearYValidarPedido(datosPedido) {
    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const { mesa: mesaNumero, productos, cliente } = datosPedido;

      if (!mesaNumero) {
        throw new Error("MESA_NO_PROPORCIONADA");
      }

      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error("PRODUCTOS_INVALIDOS");
      }

      // 1️⃣ Validar mesa a través de MesaService
      const mesa = await this.mesaService.obtenerMesaPorNumero(mesaNumero);
      if (!mesa) {
        throw new Error("MESA_NO_ENCONTRADA");
      }

      if (mesa.estado === "libre") {
        throw new Error("NO_SE_PUEDE_CREAR_PEDIDO_EN_MESA_LIBRE");
      }

      // 2️⃣ Procesar productos (validar stock y descontar)
      const { total, detalles } = await this._procesarProductos(productos, transaction);

      // 3️⃣ Crear pedido
      const nuevoPedido = await this.pedidoRepository.crearPedido({
        mesa: mesaNumero,
        cliente: cliente || "Anónimo",
        estado: "pendiente",
        total: parseFloat(total.toFixed(2)),
      }, transaction);

      // 4️⃣ Crear detalles asociados
      await this.pedidoRepository.crearDetalles(
        detalles.map(det => ({
          PedidoId: nuevoPedido.id,
          ...det
        })),
        transaction
      );

      // 5️⃣ Actualizar total de la mesa
      await this.mesaService.sumarTotal(mesaNumero, total, transaction);

      return nuevoPedido;
    })
      .then((pedido) => {

        // 🔔 Evento fuera de la transacción
        this.pedidoEmitter?.emit("pedido-creado", {
          pedido: pedido.toJSON()
        });

        return pedido;
      });
  }




  // 2. LISTAR PEDIDOS
  async listarPedidos(estado) {
    return this.pedidoRepository.listarPedidosPorEstado(estado);
  }

  // 3. BUSCAR POR MESA
  //Recibe mesa ya validada por el middleware y devuelve los pedidos asociados a esa mesa
  //Nunca accede a req.params ni a nada de Express, solo recibe el dato limpio y validado
  async buscarPedidosPorMesa(mesaNumero) {
    // Defensa básica (por si alguien usa el service sin middleware)
    if (mesaNumero === undefined || mesaNumero === null) {
      throw new Error("Número de mesa no proporcionado");
    }
    // El repository siempre devuelve un array (vacío o con datos)
    return await this.pedidoRepository.buscarPedidosPorMesa(mesaNumero);

  }


  // 4. ELIMINAR PEDIDO
  async eliminarPedido(pedidoId) {

    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);

      if (!pedido) {
        throw new Error("PEDIDO_NO_ENCONTRADO");
      }

      // 🔒 Regla de negocio opcional (recomendado)
      if (pedido.estado !== "pendiente") {
        throw new Error("SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES");
      }

      // 1️⃣ Obtener detalles
      const detalles = await this.pedidoRepository.obtenerDetallesPedido(pedidoId);

      // 2️⃣ Restaurar stock
      await this._restaurarStock(detalles, transaction);

      // 3️⃣ Ajustar total de la mesa
      await this.mesaService.restarTotal(
        pedido.mesa,
        pedido.total,
        transaction
      );

      // 4️⃣ Eliminar físicamente detalles y cabecera
      await this._eliminarPedidoFisico(pedidoId, transaction);

      return true;
    });

  }

  //MODIFICAR  UN PEDIDO
  //Durante la modificación, la mesa nunca debe pasar a "libre"
  //Uso transacción para asegurar que si algo falla, no quede el pedido en un estado inconsistente 
  // (ej: detalles sin cabecera, o stock descontado sin crear el pedido)
  async modificarPedido(datos) {

    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const { id: pedidoId, productos, mesa: mesaId } = datos;

      if (!pedidoId) {
        throw new Error("PEDIDO_ID_INVALIDO");
      }

      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error("PRODUCTOS_INVALIDOS");
      }

      const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);

      if (!pedido) {
        throw new Error("PEDIDO_NO_ENCONTRADO");
      }

      if (pedido.estado !== "pendiente") {
        throw new Error("SOLO_SE_PUEDEN_MODIFICAR_PEDIDOS_PENDIENTES");
      }

      // 1️⃣ Obtener detalles actuales
      const detallesActuales =
        await this.pedidoRepository.obtenerDetallesPedido(pedidoId);

      // 2️⃣ Restaurar stock anterior
      await this._restaurarStock(detallesActuales, transaction);

      // 3️⃣ Eliminar detalles anteriores
      await this.pedidoRepository.eliminarDetallesPedido(
        pedidoId,
        transaction
      );

      // 4️⃣ Procesar nuevos productos
      const { total, detalles } =
        await this._procesarProductos(productos, transaction);

      // 5️⃣ Crear nuevos detalles
      await this.pedidoRepository.crearDetalles(
        detalles.map(det => ({
          PedidoId: pedidoId,
          ...det
        })),
        transaction
      );

      // 6️⃣ Ajustar diferencia en la mesa
      const diferencia = total - pedido.total;

      if (diferencia !== 0) {
        await this.mesaService.ajustarTotal(
          mesaId,
          diferencia,
          transaction
        );
      }

      // 7️⃣ Actualizar total del pedido
      await this.pedidoRepository.actualizarTotalPedido(
        pedidoId,
        parseFloat(total.toFixed(2)),
        transaction
      );

      return pedidoId;

    }).then(async (pedidoId) => {//Si hay un error no se emite el evento

      // 🔔 Evento fuera de la transacción
      const pedidoActualizado =
        await this.pedidoRepository.buscarPedidoPorId(pedidoId);

      this.pedidoEmitter?.emit("pedido-modificado", {
        mesa: pedidoActualizado.mesa,
        pedido: pedidoActualizado
      });

      return pedidoActualizado;
    });

  }

  //MODIFICAR  UN PEDIDO
 async actualizarEstadoPedido(pedidoId, nuevoEstado) {

  if (!pedidoId) {
    throw new Error("PEDIDO_ID_INVALIDO");
  }

  const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);

  if (!pedido) {
    throw new Error("PEDIDO_NO_ENCONTRADO");
  }

  if (pedido.estado === "pagado") {
    throw new Error("NO_SE_PUEDE_MODIFICAR_PEDIDO_PAGADO");
  }

  if (nuevoEstado === "pagado") {
    throw new Error("ESTADO_PAGADO_SOLO_DESDE_CIERRE_DE_MESA");
  }

  const transicionesValidas = {
    pendiente: ["en_preparacion"],
    en_preparacion: ["entregado"],
    entregado: [],
  };

  const estadosPermitidos = transicionesValidas[pedido.estado] || [];

  if (!estadosPermitidos.includes(nuevoEstado)) {
    throw new Error("TRANSICION_ESTADO_INVALIDA");
  }

  await this.pedidoRepository.actualizarEstadoPedido(
    pedidoId,
    nuevoEstado
  );

  // 🔔 Evento DESPUÉS de persistir
  this.pedidoEmitter?.emit("pedido-estado-actualizado", {
    pedidoId,
    estado: nuevoEstado
  });

  return true;
}



  // ---------------------------------
  // MÉTODOS PRIVADOS
  // ---------------------------------

  async _eliminarPedidoFisico(pedidoId, transaction) {

    await this.pedidoRepository.eliminarDetallesPedido(
      pedidoId,
      transaction
    );

    await this.pedidoRepository.eliminarPedidoPorId(
      pedidoId,
      transaction
    );
  }


  //==================================================================
  async _procesarProductos(productos, transaction) {

    let total = 0;
    const detalles = [];

    for (const item of productos) {

      const platoId = parseInt(item.platoId);
      const cantidad = parseInt(item.cantidad) || 1;

      if (!platoId || platoId < 1) {
        throw new Error("PLATO_ID_INVALIDO");
      }

      if (cantidad < 1) {
        throw new Error("CANTIDAD_INVALIDA");
      }

      // 1️⃣ Obtener plato a través del PlatoService
      const plato = await this.platoService.buscarPorId(platoId);

      if (!plato) {
        throw new Error(`PLATO_NO_ENCONTRADO_${platoId}`);
      }

      // 2️⃣ Validar stock
      if (plato.stockActual < cantidad) {
        throw new Error(`STOCK_INSUFICIENTE_${plato.nombre}`);
      }

      // 3️⃣ Delegar descuento de stock al PlatoService
      await this.platoService.descontarStock(platoId, cantidad, transaction);

      const subtotal = plato.precio * cantidad;
      total += subtotal;

      detalles.push({
        PlatoId: plato.id,
        cantidad,
        subtotal,
        aclaracion: item.aclaracion || ""
      });
    }

    return { total, detalles };
  }

  //==================================================================
  async _restaurarStock(detalles, transaction) {

    for (const detalle of detalles) {

      const platoId = detalle.PlatoId;
      const cantidad = detalle.cantidad;

      if (!platoId) {
        throw new Error("PLATO_ID_INVALIDO");
      }

      // Delegamos completamente la lógica de restauración
      await this.platoService.restaurarStock(
        platoId,
        cantidad,
        transaction
      );
    }
  }



}

module.exports = PedidoService;
