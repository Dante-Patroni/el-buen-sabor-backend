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
   * @description Crea un pedido, descuenta stock, genera detalles (NO persiste total).
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
      const { detalles, comandaItems } = await this._procesarProductos(productos, transaction);

      // 3️⃣ Crear pedido SIN total
      const nuevoPedido = await this.pedidoRepository.crearPedido({
        mesa: mesaNumero,
        cliente: cliente || "Anónimo",
        estado: "pendiente",
        // ✅ NO se persiste 'total'
      }, transaction);

      // 4️⃣ Crear detalles asociados
      await this.pedidoRepository.crearDetalles(
        detalles.map(det => ({
          PedidoId: nuevoPedido.id,
          ...det
        })),
        transaction
      );

      // ✅ NO actualizamos Mesa.totalActual

      return { nuevoPedido, comandaItems };
    })
      .then(({ nuevoPedido, comandaItems }) => {
        const pedidoBase = typeof nuevoPedido.toJSON === "function"
          ? nuevoPedido.toJSON()
          : { ...nuevoPedido };

        // 🔔 Evento fuera de la transacción
        this.pedidoEmitter?.emit("pedido-creado", {
          pedido: {
            ...pedidoBase,
            items: comandaItems,
          }
        });

        return nuevoPedido;
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
    if (mesaNumero === undefined || mesaNumero === null) {
      throw new Error("MESA_NO_PROPORCIONADA");
    }
    return await this.pedidoRepository.buscarPedidosPorMesa(mesaNumero);
  }

  /**
   * @description Elimina un pedido pendiente restaurando stock (NO ajusta total de mesa).
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

      if (pedido.estado !== "pendiente") {
        throw new Error("SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES");
      }

      // 1️⃣ Obtener detalles
      const detalles = await this.pedidoRepository.obtenerDetallesPedido(pedidoId, transaction);

      // 2️⃣ Restaurar stock
      await this._restaurarStock(detalles, transaction);

      // ✅ NO ajustamos Mesa.totalActual

      // 3️⃣ Eliminar físicamente detalles y cabecera
      await this._eliminarPedidoFisico(pedidoId, transaction);

      return true;
    });
  }

  /**
   * @description Modifica un pedido pendiente recalculando detalles y stock (NO persiste total).
   * @param {{id:number|string, productos:Array<object>, mesa:number|string}} datos - Datos de modificacion.
   * @returns {Promise<object>} Pedido actualizado.
   * @throws {Error} Codigos de validacion de pedido/productos/estado.
   */
  async modificarPedido(datos) {
    return await this.pedidoRepository.inTransaction(async (transaction) => {

      const { id: pedidoId, productos } = datos;

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
      const { detalles } = await this._procesarProductos(productos, transaction);

      // 5️⃣ Crear nuevos detalles
      await this.pedidoRepository.crearDetalles(
        detalles.map(det => ({
          PedidoId: pedidoId,
          ...det
        })),
        transaction
      );

      // ✅ NO calculamos diferencia ni ajustamos Mesa.totalActual
      // ✅ NO actualizamos Pedido.total

      return pedidoId;

    }).then(async (pedidoId) => {

      const pedidoActualizado =
        await this.pedidoRepository.buscarPedidoPorId(pedidoId);

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
      return { pedidoId, nuevoEstado };
    }).then(({ pedidoId, nuevoEstado }) => {

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
   * @description Valida items, descuenta stock y construye detalles para persistencia.
   * @param {Array<{platoId:number|string,cantidad:number|string,aclaracion?:string}>} productos - Items solicitados.
   * @param {object} transaction - Transaccion activa.
   * @returns {Promise<{detalles:Array<object>, comandaItems:Array<object>}>} Detalles de persistencia e items para cocina.
   * @throws {Error} `PLATO_ID_INVALIDO`, `CANTIDAD_INVALIDA`, `PLATO_NO_ENCONTRADO`, `STOCK_INSUFICIENTE`.
   */
  async _procesarProductos(productos, transaction) {
    const detalles = [];
    const comandaItems = [];

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

      const plato = await this.platoService.buscarPorId(platoId, transaction);

      if (!plato) {
        throw new Error("PLATO_NO_ENCONTRADO");
      }

      if (!plato.esActivo) {
        throw new Error("PLATO_NO_DISPONIBLE");
      }

      const filasAfectadas = await this.platoService.descontarStock(
        platoId,
        cantidad,
        transaction
      );

      if (filasAfectadas === 0) {
        throw new Error("STOCK_INSUFICIENTE");
      }

      // ✅ Capturamos el precio en el momento de la venta
      const precioUnitario = parseFloat(plato.precio);
      const subtotal = precioUnitario * cantidad;

      detalles.push({
        PlatoId: plato.id,
        cantidad,
        precioUnitario, // ✅ Precio histórico
        subtotal,       // ✅ Calculado pero también persistido para consultas rápidas
        aclaracion: item.aclaracion || ""
      });

      comandaItems.push({
        platoId: plato.id,
        plato: plato.nombre || `Plato ${plato.id}`,
        cantidad,
        aclaracion: item.aclaracion || "",
      });
    }

    return { detalles, comandaItems };
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

      await this.platoService.restaurarStock(
        platoId,
        cantidad,
        transaction
      );
    }
  }

  /**
   * @description Obtiene los pedidos pendientes formateados para el monitor de cocina.
   * @returns {Promise<Array<object>>} Lista de pedidos mapeada.
   */
  async obtenerPedidosParaCocina() {
    const pedidos = await this.listarPedidos("pendiente");

    return pedidos.map((p) => ({
      id: p.id,
      mesa: p.mesa,
      cliente: p.cliente,
      estado: p.estado,
      hora: new Date(p.createdAt).toLocaleTimeString("es-AR"),
      items: (p.DetallePedidos ?? p.items ?? p.detalles ?? []).map((i) => ({
        nombre: i.Plato?.nombre ?? i.nombre ?? `Plato ${i.PlatoId || ""}`,
        cantidad: i.cantidad,
        aclaracion: i.aclaracion || "",
      })),
    }));
  }

  /**
   * @description Calcula el total de una mesa sumando los subtotales de DetallePedidos.
   * @param {number|string} mesaId - Id de mesa.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Total calculado dinámicamente.
   */
  async obtenerTotalPorMesa(mesaId, transaction = null) {
    return await this.pedidoRepository.calcularTotalMesa(mesaId, transaction);
  }

}

module.exports = PedidoService;