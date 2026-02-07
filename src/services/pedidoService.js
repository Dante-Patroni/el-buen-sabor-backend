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

  // 1️⃣ Procesar productos
  const { total, detalles } = await this._procesarProductos(productos);

  // 2️⃣ Crear pedido
  const nuevoPedido = await this.pedidoRepository.crearPedido({
    mesa: mesaNumero,
    cliente: cliente || "Anónimo",
    estado: "pendiente",
    total: parseFloat(total.toFixed(2)),
  });

  // 3️⃣ Crear detalles
  await this.pedidoRepository.crearDetalles(
    detalles.map(det => ({
      PedidoId: nuevoPedido.id,
      ...det,
    }))
  );

  // 4️⃣ Actualizar mesa
  await this._actualizarMesa(mesaNumero, total);

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
  const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);
  if (!pedido) {
    throw new Error("PEDIDO_NO_ENCONTRADO");
  }

  // 1️⃣ Obtener detalles ANTES de borrar
  const detalles = await this.pedidoRepository.obtenerDetallesPedido(pedidoId);

  // 2️⃣ Restaurar stock
  await this._restaurarStock(detalles);

  // 3️⃣ Actualizar mesa (resta el total)
  await this._actualizarMesa(pedido.mesa, -pedido.total);

  // 4️⃣ Eliminar pedido (detalles + cabecera)
  await this._eliminarPedidoFisico(pedidoId);

  return true;
}



  //MODIFICAR  UN PEDIDO
 async modificarPedido(datos) {
  const { id: pedidoId, productos, mesa: mesaNumero } = datos;

  const pedido = await this.pedidoRepository.buscarPedidoPorId(pedidoId);
  if (!pedido) throw new Error("PEDIDO_NO_ENCONTRADO");
  if (pedido.estado !== "pendiente") {
    throw new Error("Solo se pueden modificar pedidos pendientes");
  }

  // 1️⃣ Revertir impacto anterior
  await this._actualizarMesa(mesaNumero, -pedido.total);
  await this._restaurarStock(
    await this.pedidoRepository.obtenerDetallesPedido(pedidoId)
  );

  // 2️⃣ Limpiar
  await this.pedidoRepository.eliminarDetallesPedido(pedidoId);

  // 3️⃣ Procesar nuevo pedido
  const { total, detalles } = await this._procesarProductos(productos, pedidoId);

  await this.pedidoRepository.crearDetalles(detalles);
  await this.pedidoRepository.actualizarTotalPedido(pedidoId, total);
  await this._actualizarMesa(mesaNumero, total);

  const pedidoActualizado = await this.pedidoRepository.buscarPedidoPorId(pedidoId);

  this.pedidoEmitter?.emit("pedido-modificado", {
    mesa: mesaNumero,
    pedido: pedidoActualizado
  });

  return pedidoActualizado;
}


  // 5. CERRAR MESA
 async cerrarMesa(mesaId) {
  const mesa = await this.pedidoRepository.buscarMesaPorId(mesaId);

  if (!mesa){
    const error = new Error("MESA_NO_ENCONTRADA");
    error.status = 404;
    throw error;
  }

  const pedidosAbiertos =
    await this.pedidoRepository.buscarPedidoAbiertosPorMesa(mesaId);

  if (pedidosAbiertos.length === 0) {
  const error = new Error("NO_HAY_PEDIDOS_ABIERTOS");
  error.status = 400; // o 409
  throw error;
}

  const totalCierre = parseFloat(mesa.totalActual) || 0;

  await this.pedidoRepository.marcarPedidosComoPagados(mesaId);

  mesa.estado = "libre";
  mesa.totalActual = 0;
  mesa.mozo_id = null;

  await this.pedidoRepository.cerrarMesa(mesa);

  this.pedidoEmitter?.emit("mesa-cerrada", {
    mesaId: mesa.id,
    totalCobrado: totalCierre,
    pedidosCerrados: pedidosAbiertos.length
  });

  return {
    mesaId: mesa.id,
    totalCobrado: totalCierre,
    pedidosCerrados: pedidosAbiertos.length,
  };
}


   // ---------------------------------
  // MÉTODOS PRIVADOS
  // ---------------------------------

  async _eliminarPedidoFisico(pedidoId) {
    await this.pedidoRepository.eliminarDetallesPedido(pedidoId);
    await this.pedidoRepository.eliminarPedidoPorId(pedidoId);
  }
  //=====================================================
 async _actualizarMesa(mesaNumero, monto) {
  const mesa = await this.pedidoRepository.buscarMesaPorId(mesaNumero);
  if (!mesa) return;

  const totalAnterior = Number(mesa.totalActual) || 0;
  const incremento = Number(monto) || 0;

  let nuevoTotal = totalAnterior + incremento;

  if (nuevoTotal < 0) {
    nuevoTotal = 0;
  }

  mesa.totalActual = nuevoTotal;
  mesa.estado = this._calcularEstadoMesa(nuevoTotal);

  await this.pedidoRepository.actualizarMesa(mesa);
}
//=====================================================
_calcularEstadoMesa(total) {
  return total > 0 ? "ocupada" : "libre";
}

//==================================================================
  async _procesarProductos(productos) {
  let total = 0;
  const detalles = [];

  for (const item of productos) {
    const platoId = parseInt(item.platoId);
    const cantidad = parseInt(item.cantidad) || 1;

    if (!platoId || platoId < 1) {
      throw new Error("platoId inválido");
    }

    const plato = await this.platoRepository.buscarPorId(platoId);
    if (!plato) {
      throw new Error(`El plato ID ${platoId} no existe`);
    }

    if (plato.stockActual < cantidad) {
      throw new Error(`Stock insuficiente para ${plato.nombre}`);
    }

    const nuevoStock = plato.stockActual - cantidad;
    await this.platoRepository.actualizarStock(platoId, nuevoStock);

    const subtotal = plato.precio * cantidad;
    total += subtotal;

    detalles.push({
      PlatoId: plato.id,
      cantidad,
      subtotal,
      aclaracion: item.aclaracion || "",
    });
  }

  return { total, detalles };
}
//==================================================================
async _restaurarStock(detalles) {
  for (const detalle of detalles) {
    const plato = await this.platoRepository.buscarPorId(detalle.PlatoId);
    if (!plato) {
      throw new Error(`PLATO_NO_ENCONTRADO_${detalle.PlatoId}`);
    }

    const nuevoStock = plato.stockActual + detalle.cantidad;
    await this.platoRepository.actualizarStock(plato.id, nuevoStock);
  }
}


}

module.exports = PedidoService;
