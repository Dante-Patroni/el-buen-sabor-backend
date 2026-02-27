
// NO importamos modelos directamente en el service
// el service habla SOLO con repositories

class PedidoService {
  /**
   * @description Crea una instancia del servicio de pedidos.
   * @param {import("../repositories/pedidoRepository")} pedidoRepository - Repositorio de pedidos.
   * @param {import("./platoService")} platoService - Servicio de platos.
   * @param {import("./mesaService")} mesaService - Servicio de mesas.
   * @param {import("events").EventEmitter} pedidoEmitter - Emisor de eventos de pedidos.
   */
  constructor(pedidoRepository, platoService, mesaService, pedidoEmitter) {
    this.pedidoRepository = pedidoRepository;
    this.platoService = platoService;
    this.mesaService = mesaService;
    this.pedidoEmitter = pedidoEmitter;
  }

  /**
   * @description Crea un pedido, descuenta stock, genera detalles y actualiza total de mesa en una transaccion.
   * @param {{mesa:number|string, productos:Array<object>, cliente?:string}} datosPedido - Datos del pedido.
   * @returns {Promise<object>} Pedido creado.
   * @throws {Error} Codigos de validacion de mesa/productos/stock.
   */
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
      const mesa = await this.mesaService.obtenerPorId(mesaNumero, transaction);
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
  /**
   * @description Lista pedidos opcionalmente filtrados por estado.
   * @param {string|undefined} estado - Estado opcional para filtrar.
   * @returns {Promise<Array<object>>} Lista de pedidos.
   */
  async listarPedidos(estado) {
    return this.pedidoRepository.listarPedidosPorEstado(estado);
  }

  /**
   * @description Busca pedidos asociados a una mesa.
   * @param {number|string} mesaNumero - Numero/id de mesa ya validado por middleware.
   * @returns {Promise<Array<object>>} Pedidos de la mesa.
   * @throws {Error} `MESA_NO_PROPORCIONADA`.
   */
  async buscarPedidosPorMesa(mesaNumero) {
    // Defensa básica (por si alguien usa el service sin middleware)
    if (mesaNumero === undefined || mesaNumero === null) {
      throw new Error("MESA_NO_PROPORCIONADA");
    }
    // El repository siempre devuelve un array (vacío o con datos)
    return await this.pedidoRepository.buscarPedidosPorMesa(mesaNumero);

  }
  /**
   * @description Elimina un pedido pendiente restaurando stock y ajustando total de mesa de forma atomica.
   * @param {number|string} pedidoId - Id del pedido a eliminar.
   * @returns {Promise<boolean>} `true` si se elimina correctamente.
   * @throws {Error} `PEDIDO_NO_ENCONTRADO` y reglas de estado.
   */
  async eliminarPedido(pedidoId) {

    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId, transaction);

      if (!pedido) {
        throw new Error("PEDIDO_NO_ENCONTRADO");
      }

      // 🔒 Regla de negocio opcional (recomendado)
      if (pedido.estado !== "pendiente") {
        throw new Error("SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES");
      }

      // 1️⃣ Obtener detalles
      const detalles = await this.pedidoRepository.obtenerDetallesPedido(pedidoId, transaction);

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

  /**
   * @description Modifica un pedido pendiente recalculando detalles, stock y total de mesa en una transaccion.
   * @param {{id:number|string, productos:Array<object>, mesa:number|string}} datos - Datos de modificacion.
   * @returns {Promise<object>} Pedido actualizado.
   * @throws {Error} Codigos de validacion de pedido/productos/estado.
   */
  async modificarPedido(datos) {

    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const { id: pedidoId, productos, mesa: mesaId } = datos;

      if (!pedidoId) {
        throw new Error("PEDIDO_ID_INVALIDO");
      }

      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        throw new Error("PRODUCTOS_INVALIDOS");
      }

      const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId, transaction);

      if (!pedido) {
        throw new Error("PEDIDO_NO_ENCONTRADO");
      }

      if (pedido.estado !== "pendiente") {
        throw new Error("SOLO_SE_PUEDEN_MODIFICAR_PEDIDOS_PENDIENTES");
      }

      // 1️⃣ Obtener detalles actuales
      const detallesActuales =
        await this.pedidoRepository.obtenerDetallesPedido(pedidoId, transaction);

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

    }).then(async (pedidoId) => {//Fuera de la Transacción -Si hay un error no se emite el evento

      // 🔔 Evento fuera de la transacción
      const pedidoActualizado =
        await this.pedidoRepository.buscarPedidoPorId(pedidoId,);

      this.pedidoEmitter?.emit("pedido-modificado", {
        mesa: pedidoActualizado.mesa,
        pedido: pedidoActualizado
      });

      return pedidoActualizado;
    });
    
  }

  /**
   * @description Actualiza el estado de un pedido respetando transiciones permitidas.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {string} nuevoEstado - Estado destino.
   * @returns {Promise<boolean>} `true` cuando la transicion se concreta.
   * @throws {Error} Codigos de validacion de estado o existencia.
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado) {
    return await this.pedidoRepository.inTransaction(async (transaction) => {
      if (!pedidoId) {
        throw new Error("PEDIDO_ID_INVALIDO");
      }

      const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId, transaction);

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

      await this.pedidoRepository.actualizarEstadoPedido(pedidoId, nuevoEstado, transaction);
      return { pedidoId, nuevoEstado }; // ✅ Agregar esta línea
    }).then(({ pedidoId, nuevoEstado }) => { // ✅ Desestructurar correctamente//Si hay un error no se emite el evento

      // 🔔 Evento DESPUÉS de persistir
      this.pedidoEmitter?.emit("pedido-estado-actualizado", {
        pedidoId, estado: nuevoEstado
      });

      return true;
    });
  }

  /**
   * @description Elimina fisicamente cabecera y detalles de un pedido dentro de una transaccion existente.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<void>} Resolucion sin valor.
   */
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

  /**
   * @description Valida items, descuenta stock y construye detalles/total para persistencia.
   * @param {Array<{platoId:number|string,cantidad:number|string,aclaracion?:string}>} productos - Items solicitados.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<{total:number, detalles:Array<object>}>} Total calculado y detalles listos.
   * @throws {Error} `PLATO_ID_INVALIDO`, `CANTIDAD_INVALIDA`, `PLATO_NO_ENCONTRADO`, `STOCK_INSUFICIENTE`.
   */
  async _procesarProductos(productos, transaction) {

    let total = 0;
    const detalles = [];

    for (const item of productos) {

      const platoId = parseInt(item.platoId, 10);
      const cantidadParseada = parseInt(item.cantidad, 10);
      const cantidad = Number.isNaN(cantidadParseada) ? 1 : cantidadParseada;

      if (!platoId || platoId < 1) {
        throw new Error("PLATO_ID_INVALIDO");
      }

      if (cantidad < 1) {
        throw new Error("CANTIDAD_INVALIDA");
      }

      // 1️⃣ Obtener plato a través del PlatoService
      const plato = await this.platoService.buscarPorId(platoId);

      if (!plato) {
        throw new Error("PLATO_NO_ENCONTRADO");
      }

      // 2️⃣ Validar stock
      if (plato.stockActual < cantidad) {
        throw new Error("STOCK_INSUFICIENTE");
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
  /**
   * @description Restaura stock para cada detalle de pedido provisto.
   * @param {Array<{PlatoId:number,cantidad:number}>} detalles - Detalles del pedido.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<void>} Resolucion sin valor.
   * @throws {Error} `PLATO_ID_INVALIDO`.
   */
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
