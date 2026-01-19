// NO importamos modelos directamente en el service
// el service habla SOLO con repositories
const pedidoEmitter = require("../events/pedidoEvents");

class PedidoService {
    constructor(pedidoRepository, platoRepository, pedidoEmitter) {
    this.pedidoRepository = pedidoRepository;
    this.platoRepository = platoRepository; 
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

      // 🔹 Buscar plato
      const plato = await this.platoRepository.buscarPorId(platoId);
      if (!plato) {
        throw new Error(`El plato ID ${platoId} no existe`);
      }

      // 🔹 Validar stock (MySQL)
      if (plato.stockActual < cantidad) {
        throw new Error(`Stock insuficiente para ${plato.nombre}`);
      }

      // 🔹 Descontar stock (CORREGIDO) 🛠️
      // ANTES TENÍAS: 
      // await this.platoRepository.actualizarProductoSeleccionado(platoId); <--- ESTO FALLABA

      // AHORA USA EL MÉTODO QUE SÍ EXISTE:
      const nuevoStock = plato.stockActual - cantidad;
      await this.platoRepository.actualizarStock(platoId, nuevoStock);
      
      // Actualizamos el objeto local por si se usa más abajo
      plato.stockActual = nuevoStock; 

      // 🔹 Calcular subtotal
      const subtotal = plato.precio * cantidad;
      totalCalculado += subtotal;

      // 🔹 Preparar detalle para crear después

      detallesParaCrear.push({
        PlatoId: plato.id,
        cantidad,
        subtotal,
        aclaracion: item.aclaracion || "",
      });
    }

    // 2️⃣ Crear pedido
    const nuevoPedido = await this.pedidoRepository.crearPedido({
      mesa: mesaNumero,
      cliente: cliente || "Anónimo",
      estado: "pendiente",
      total: parseFloat(totalCalculado.toFixed(2)),
    });

    // 3️⃣ Crear detalles
    await this.pedidoRepository.crearDetalles(
      detallesParaCrear.map(det => ({
        PedidoId: nuevoPedido.id,
        ...det,
      }))
    );

    // 4️⃣ Actualizar mesa
    await this._actualizarMesa(mesaNumero, totalCalculado);

    // 5️⃣ Emitir evento
    this.pedidoEmitter.emit("pedido-creado", {
      pedido: nuevoPedido.toJSON(),
    });

    return nuevoPedido;
  }

  // 2. LISTAR PEDIDOS
  async listarPedidos(estado) {
    return this.pedidoRepository.listarPedidosPorEstado(estado);
  }

  // 3. BUSCAR POR MESA
  async buscarPedidosPorMesa(mesaNumero) {
    return this.pedidoRepository.buscarPedidosPorMesa(mesaNumero);
  }

// 4. ELIMINAR PEDIDO
  async eliminarPedido(id) {
    const pedido = await this.pedidoRepository.buscarPedidoPorId(id);
    if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");

    // A. RESTAURAR STOCK (Igual que en modificar)
    // Necesitamos los detalles antes de borrar el pedido
    const detalles = await this.pedidoRepository.obtenerDetallesPedido(id);
    
    for (const detalle of detalles) {
      // Ojo: asegúrate de que detalle traiga el Plato o búscalo por ID
      const plato = await this.platoRepository.buscarPorId(detalle.PlatoId);
      if (plato) {
        await this.platoRepository.actualizarStock(plato.id, plato.stockActual + detalle.cantidad);
      }
    }

    // B. ACTUALIZAR MESA (Restando el monto)
    // Pasamos el total en negativo para que _actualizarMesa lo descuente
    await this._actualizarMesa(pedido.mesa, -pedido.total);

    // C. ELIMINAR FÍSICAMENTE
    // (Tu repo debe encargarse de borrar primero los detalles y luego la cabecera, o tener CASCADE en la BD)
    await this.pedidoRepository.eliminarDetallesPedido(id); // Primero detalles
    await this.pedidoRepository.eliminarPedidoPorId(id);    // Luego cabecera

    return true;
  }


  //MODIFICAR DETALLE DE UN PEDIDO
 async modificarPedido(datos) {
    // 1. Recibimos los datos del Front
    // mesa: se necesita para el socket y logs.
    // productos: es la NUEVA lista completa de ítems.
    const { id: pedidoId, productos: productosNuevos, mesa: mesaNumero } = datos;

    // --- VALIDACIONES ---
    const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);
    if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");
    if (pedido.estado !== "pendiente") {
      throw new Error("Solo se pueden modificar pedidos en estado 'pendiente'");
    }

    // =========================================================
    // PASO A: RESTAURAR STOCK (Mirando tu tabla 'detallepedidos') 🔙
    // =========================================================
    // Obtenemos las filas actuales (las que mostraste en la foto 4)
    const detallesViejos = await this.pedidoRepository.obtenerDetallesPedido(pedidoId);
    
    for (const detalle of detallesViejos) {
      // detalle.PlatoId viene de tu columna en la BD
      const plato = await this.platoRepository.buscarPorId(detalle.PlatoId);
      if (plato) {
        // Devolvemos la cantidad al stock
        await this.platoRepository.actualizarStock(plato.id, plato.stockActual + detalle.cantidad); 
      }
    }

    // =========================================================
    // PASO B: LIMPIEZA 🗑️
    // =========================================================
    // Esto borra las filas en la tabla 'detallepedidos' con PedidoId = pedidoId
    await this.pedidoRepository.eliminarDetallesPedido(pedidoId);

    // =========================================================
    // PASO C: PROCESAR LO NUEVO 🆕
    // =========================================================
    let nuevoTotal = 0;
    const nuevosDetallesParaCrear = [];

    for (const item of productosNuevos) {
      const platoId = parseInt(item.platoId);
      const cantidad = parseInt(item.cantidad) || 1;

      // Buscamos info del plato (Precio, Stock)
      const plato = await this.platoRepository.buscarPorId(platoId);
      if (!plato) throw new Error(`El plato ID ${platoId} no existe`);

      // Validamos stock contra lo que queda
      if (plato.stockActual < cantidad) {
        throw new Error(`Stock insuficiente para ${plato.nombre}`);
      }

      // Descontamos el stock
      await this.platoRepository.actualizarStock(plato.id, plato.stockActual - cantidad);

      const subtotal = plato.precio * cantidad;
      nuevoTotal += subtotal;

      // Armamos el objeto tal cual lo pide tu tabla 'detallepedidos'
      nuevosDetallesParaCrear.push({
        PedidoId: pedidoId,   // <--- Columna 'PedidoId' de tu foto
        PlatoId: plato.id,    // <--- Columna 'PlatoId' de tu foto
        cantidad: cantidad,   // <--- Columna 'cantidad'
        subtotal: subtotal,   // <--- Columna 'subtotal'
        aclaracion: item.aclaracion || "" // Si agregas esa columna a futuro
      });
    }

    // =========================================================
    // PASO D: INSERTAR Y GUARDAR ✅
    // =========================================================
    // Insertamos las nuevas filas en 'detallepedidos'
    await this.pedidoRepository.crearDetalles(nuevosDetallesParaCrear);
    
    // Actualizamos el total en la tabla 'pedidos'
    await this.pedidoRepository.actualizarTotalPedido(pedidoId, nuevoTotal);

    // Buscamos el pedido limpio para devolver
    const pedidoActualizado = await this.pedidoRepository.buscarPedidoPorId(pedidoId);

    // Notificamos a la cocina
    if (this.pedidoEmitter) {
        this.pedidoEmitter.emit("pedido-modificado", {
            mesa: mesaNumero, 
            pedido: pedidoActualizado
        });
    }

    return pedidoActualizado;
  }

  
  // 5. CERRAR MESA
  async cerrarMesa(mesaId) {
    const mesa = await this.pedidoRepository.buscarMesaPorId(mesaId);
    if (!mesa) throw new Error("Mesa no encontrada");

    const pedidosAbiertos =
      await this.pedidoRepository.buscarPedidoAbiertosPorMesa(mesaId);

    if (pedidosAbiertos.length === 0) {
      throw new Error("No hay pedidos pendientes para esta mesa");
    }

    const totalCierre = mesa.totalActual || 0;

    // Marcar pedidos como pagados
    await this.pedidoRepository.marcarPedidosComoPagados(mesaId);

    // Liberar mesa
    mesa.estado = "libre";
    mesa.totalActual = 0;
    mesa.mozo_id = null;

    await this.pedidoRepository.cerrarMesa(mesa);

    return {
      mesaId: mesa.id,
      totalCobrado: totalCierre,
      pedidosCerrados: pedidosAbiertos.length,
    };
  }

  // --- MÉTODO PRIVADO ---
  async _actualizarMesa(mesaId, monto) {
    const mesa = await this.pedidoRepository.buscarMesaPorId(mesaId);
    if (!mesa) return;

    const totalAnterior = parseFloat(mesa.totalActual) || 0;
    let nuevoTotal = totalAnterior + parseFloat(monto);

    if (nuevoTotal < 0) nuevoTotal = 0;

    mesa.totalActual = nuevoTotal;
    mesa.estado = nuevoTotal > 0 ? "ocupada" : "libre";

    await this.pedidoRepository.actualizarMesa(mesa);
  }
}

module.exports = PedidoService;
