
class PlatoService {
  /**
   * @description Crea una instancia del servicio de platos.
   * @param {import("../repositories/platoRepository")} platoRepository - Repositorio de platos inyectado.
   */
  constructor(platoRepository) {
    this.platoRepository = platoRepository;
  }

  /**
   * @description Busca un plato por id.
   * @param {number|string} id - Id del plato.
   * @returns {Promise<object|null>} Plato encontrado o `null`.
   */
  async buscarPorId(id) {
    return await this.platoRepository.buscarPorId(id);
  }

  /**
   * @description Descuenta stock de un plato de forma atomica.
   * @param {number} platoId - Id del plato.
   * @param {number} cantidadADescontar - Cantidad a descontar.
   * @param {object|null} transaction - Transaccion activa opcional.
   * @returns {Promise<boolean>} `true` si la operacion se concreta.
   * @throws {Error} `PLATO_NO_ENCONTRADO` o `STOCK_INSUFICIENTE`.
   */
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

  /**
   * @description Restaura stock de un plato de forma atomica.
   * @param {number} platoId - Id del plato.
   * @param {number} cantidadARestaurar - Cantidad a reponer.
   * @param {object|null} transaction - Transaccion activa opcional.
   * @returns {Promise<boolean>} `true` cuando finaliza correctamente.
   * @throws {Error} `PLATO_NO_ENCONTRADO`.
   */
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

  /**
   * @description Lista el menu completo con relaciones necesarias.
   * @returns {Promise<Array<object>>} Lista de platos.
   */
  async listarMenuCompleto() {
    return await this.platoRepository.listarMenuCompleto();
  }

  /**
   * @description Crea un plato validando datos y manejando transaccion propia o externa.
   * @param {object} datos - Payload del plato.
   * @param {object|null} transaction - Transaccion opcional inyectada por otro servicio.
   * @returns {Promise<object>} Plato creado.
   * @throws {Error} Codigos de validacion de dominio y conflicto de nombre.
   */
  async crearNuevoProducto(datos, transaction = null) {
    // Si recibimos transacción externa, desde PedidoService la usamos
    if (transaction) {
      const datosValidados = await this._validarProducto(datos, null, transaction);
      return await this.platoRepository.crearNuevoProducto(datosValidados, transaction);
    }
    // Si NO recibimos transacción, creamos una propia
    return await this.platoRepository.inTransaction(async (t) => {
      const datosValidados = await this._validarProducto(datos, null, t);
      return await this.platoRepository.crearNuevoProducto(datosValidados, t);
    });
  }

  /**
   * @description Modifica un plato existente validando negocio y unicidad.
   * @param {number|string} id - Id del plato.
   * @param {object} datos - Campos a modificar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Plato actualizado.
   * @throws {Error} `PLATO_NO_ENCONTRADO` y codigos de validacion.
   */
  async modificarProducto(id, datos, transaction = null) {
    // Si recibimos transacción externa, desde PedidoServicela usamos
    if (transaction) {
      const producto = await this.platoRepository.buscarPorId(id, transaction);
      if (!producto) 
        throw new Error("PLATO_NO_ENCONTRADO");

      const datosValidados = await this._validarProducto(datos, producto, transaction);

      return await this.platoRepository.modificarProductoSeleccionado(
        id, datosValidados, transaction
      );
    }
    // Si NO recibimos transacción, creamos una propia
    return await this.platoRepository.inTransaction(async (t) => {
      const producto = await this.platoRepository.buscarPorId(id, t);

      if (!producto) throw new Error("PLATO_NO_ENCONTRADO");

      const datosValidados = await this._validarProducto(datos, producto, t);

      return await this.platoRepository.modificarProductoSeleccionado(
        id, datosValidados, t
      );
    });
  }

  /**
   * @description Elimina un plato por id con soporte transaccional.
   * @param {number|string} id - Id del plato.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<boolean>} `true` si se elimina.
   * @throws {Error} `PLATO_NO_ENCONTRADO`.
   */
  async eliminarProducto(id, transaction = null) {
    if (transaction) {
      const producto = await this.platoRepository.buscarPorId(id, transaction);
      if (!producto) throw new Error("PLATO_NO_ENCONTRADO");

      await this.platoRepository.eliminarPorId(id, transaction);

      return true;
    }
    return await this.platoRepository.inTransaction(async (t) => {
      const producto = await this.platoRepository.buscarPorId(id, t);
      if (!producto) throw new Error("PLATO_NO_ENCONTRADO");
      await this.platoRepository.eliminarPorId(id, t);
      return true;
    });
  }

  /**
   * @description Asigna una imagen a un plato existente.
   * @param {number|string} id - Id del plato.
   * @param {string} nombreArchivo - Nombre de archivo persistido por multer.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Plato actualizado con imagen.
   * @throws {Error} `PLATO_NO_ENCONTRADO`.
   */
  async cargarImagenProducto(id, nombreArchivo, transaction = null) {

    const producto = await this.platoRepository.buscarPorId(id, transaction);
    if (!producto) throw new Error("PLATO_NO_ENCONTRADO");

    const imagenPath = `/uploads/${nombreArchivo}`;

    await this.platoRepository.modificarProductoSeleccionado(
      id,
      { imagenPath },
      transaction
    );

    return await this.platoRepository.buscarPorId(id, transaction);
  }

  /**
   * @description Valida y normaliza datos de plato para alta o modificacion.
   * @param {object} datos - Payload recibido.
   * @param {object|null} productoExistente - Entidad actual para contexto de update.
   * @param {object|null} transaction - Transaccion opcional para validaciones de unicidad.
   * @returns {Promise<object>} Datos listos para persistir.
   * @throws {Error} Codigos de validacion de dominio.
   */
  async _validarProducto(datos, productoExistente = null, transaction = null) {

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

      const existente = await this.platoRepository.buscarPorNombre(nombreFinal, transaction);

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
