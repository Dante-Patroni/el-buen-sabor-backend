
class PlatoService {

  constructor(platoRepository) {
    this.platoRepository = platoRepository;
  }

  // ================================
  // 🔎 BUSCAR POR ID (Necesario para Pedido)
  // ================================
  async buscarPorId(id) {
    return await this.platoRepository.buscarPorId(id);
  }

  // ================================
// ➖ DESCONTAR STOCK (ATÓMICO)
// ================================
async descontarStock(platoId, cantidadADescontar, transaction = null) {

  const plato = await this.platoRepository.buscarPorId(platoId, transaction);

  if (!plato) {
    throw new Error("PLATO_NO_ENCONTRADO");
  }

  if (plato.esIlimitado) {
    return true;
  }

  const filasAfectadas =
    await this.platoRepository.descontarStockAtomico(
      platoId,
      cantidadADescontar,
      transaction
    );

  if (filasAfectadas === 0) {
    throw new Error("STOCK_INSUFICIENTE");
  }

  return true;
}


 // ================================
// ➕ RESTAURAR STOCK (ATÓMICO)
// ================================
async restaurarStock(platoId, cantidadARestaurar, transaction = null) {

  const plato = await this.platoRepository.buscarPorId(platoId, transaction);

  if (!plato) {
    throw new Error("PLATO_NO_ENCONTRADO");
  }

  if (plato.esIlimitado) {
    return true;
  }

  await this.platoRepository.restaurarStockAtomico(
    platoId,
    cantidadARestaurar,
    transaction
  );

  return true;
}


  // ================================
  // CRUD NORMAL (sin cambios fuertes)
  // ================================

  async listarMenuCompleto() {
    return await this.platoRepository.listarMenuCompleto();
  }

  async crearNuevoProducto(datos, transaction = null) {
    const datosValidados = await this._validarProducto(datos);
    return await this.platoRepository.crearNuevoProducto(datosValidados, transaction);
  }

  async modificarProducto(id, datos, transaction = null) {

    const producto = await this.platoRepository.buscarPorId(id, transaction);
    if (!producto) return null;

    const datosValidados = await this._validarProducto(datos, producto);

    return await this.platoRepository.modificarProductoSeleccionado(
      id,
      datosValidados,
      transaction
    );
  }

  async eliminarProducto(id, transaction = null) {

    const producto = await this.platoRepository.buscarPorId(id, transaction);
    if (!producto) return null;

    await this.platoRepository.eliminarPorId(id, transaction);

    return true;
  }

  async cargarImagenProducto(id, nombreArchivo, transaction = null) {

  const producto = await this.platoRepository.buscarPorId(id, transaction);
  if (!producto) return null;

  const imagenPath = `/uploads/${nombreArchivo}`;

  await this.platoRepository.modificarProductoSeleccionado(
    id,
    { imagenPath },
    transaction
  );

  return await this.platoRepository.buscarPorId(id, transaction);
}


    // 5. VALIDAR DATOS DE PRODUCTO (Lógica Compleja de Validación)
    async _validarProducto(datos, productoExistente = null) {

        const esCreacion = !productoExistente;

        const datosFinales = {};

        // =========================
        // NOMBRE
        // =========================
        if (esCreacion || datos.nombre !== undefined) {

            if (!datos.nombre || datos.nombre.trim() === "") {
                throw new Error("NOMBRE_REQUERIDO");
            }

            if (datos.nombre.trim().length > 100) {
                throw new Error("NOMBRE_DEMASIADO_LARGO");
            }

            const nombreFinal = datos.nombre.trim().toLowerCase();

            const existente = await this.platoRepository.buscarPorNombre(nombreFinal);

            if (existente && (!productoExistente || existente.id !== productoExistente.id)) {
                throw new Error("PRODUCTO_YA_EXISTE");
            }

            datosFinales.nombre = nombreFinal;
        }

        // =========================
        // PRECIO
        // =========================
        if (esCreacion || datos.precio !== undefined) {

            if (datos.precio === undefined || datos.precio === null) {
                throw new Error("PRECIO_REQUERIDO");
            }

            if (isNaN(datos.precio) || Number(datos.precio) <= 0) {
                throw new Error("PRECIO_INVALIDO");
            }

            datosFinales.precio = Number(datos.precio);
        }

        // =========================
        // DESCRIPCIÓN
        // =========================
        if (datos.descripcion !== undefined) {

            if (datos.descripcion && datos.descripcion.trim().length > 255) {
                throw new Error("DESCRIPCION_DEMASIADO_LARGA");
            }

            datosFinales.descripcion =
                datos.descripcion && datos.descripcion.trim() !== ""
                    ? datos.descripcion.trim()
                    : null;
        }

        // =========================
        // RUBRO
        // =========================
        if (esCreacion || datos.rubroId !== undefined) {

            if (!datos.rubroId) {
                throw new Error("RUBRO_REQUERIDO");
            }

            datosFinales.rubroId = datos.rubroId;
        }

        // =========================
        // STOCK
        // =========================
        if (esCreacion || datos.esIlimitado !== undefined || datos.stockActual !== undefined) {

            const esIlimitado = datos.esIlimitado ?? productoExistente?.esIlimitado ?? false;
            datosFinales.esIlimitado = esIlimitado;

            if (!esIlimitado) {

                const stock = datos.stockActual ?? productoExistente?.stockActual;

                if (stock === undefined || stock === null) {
                    throw new Error("STOCK_REQUERIDO");
                }

                if (isNaN(stock) || Number(stock) <= 0) {
                    throw new Error("STOCK_INVALIDO");
                }

                datosFinales.stockActual = Number(stock);
            } else {
                // Si es ilimitado, ignoramos stock
                datosFinales.stockActual = 0;
            }
        }


        // =========================
        // MENU DEL DIA
        // =========================
        if (datos.esMenuDelDia !== undefined) {
            datosFinales.esMenuDelDia = !!datos.esMenuDelDia;
        }

        return datosFinales;
    }

}

module.exports = PlatoService;