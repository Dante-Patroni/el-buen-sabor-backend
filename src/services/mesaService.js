class MesaService {
  /**
   * @description Crea una instancia del servicio de mesas.
   * @param {import("../repositories/mesaRepository")} mesaRepository - Repositorio de mesas.
   * @param {import("../repositories/pedidoRepository")} pedidoRepository - Repositorio de pedidos.
   * @param {import("./facturacionService")|null} facturacionService - Servicio de facturacion para cierre de mesa.
   * @param {import("events").EventEmitter|undefined} pedidoEmitter - Emisor de eventos para notificaciones en tiempo real.
   */
  constructor(mesaRepository, pedidoRepository, facturacionService = null, pedidoEmitter = undefined) {
    this.mesaRepository = mesaRepository;
    this.pedidoRepository = pedidoRepository;
    this.facturacionService = facturacionService;
    this.pedidoEmitter = pedidoEmitter;
  }

  /**
   * @description Lista todas las mesas con informacion de mozo asociada.
   * @returns {Promise<Array<object>>} Lista de mesas.
   */
  async listar() {
    return await this.mesaRepository.listarMesasConMozo();
  }

  /**
   * @description Obtiene una mesa por id dentro o fuera de una transaccion.
   * @param {number|string} mesaId - Id de la mesa.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa encontrada.
   * @throws {Error} `MESA_NO_ENCONTRADA`.
   */
  async obtenerPorId(mesaId, transaction = null) {
    const mesa = await this.mesaRepository.buscarMesaPorId(mesaId, transaction);
    if (!mesa) {
      throw new Error("MESA_NO_ENCONTRADA");
    }
    return mesa;
  }

  /**
   * @description Abre una mesa libre y asigna mozo.
   * @param {number|string} mesaId - Id de mesa.
   * @param {number|string} mozoId - Id del mozo.
   * @returns {Promise<{mensaje:string}>} Confirmacion de apertura.
   * @throws {Error} `MOZO_REQUERIDO` o `MESA_YA_OCUPADA`.
   */
  async abrirMesa(mesaId, mozoId) {
    if (!mozoId) {
      throw new Error("MOZO_REQUERIDO");
    }

    const affectedRows = await this.mesaRepository.abrirMesaSiEstaLibre(
      mesaId,
      mozoId
    );

    if (affectedRows === 0) {
      throw new Error("MESA_YA_OCUPADA");
    }

    return { mensaje: "Mesa abierta correctamente" };
  }

  /**
   * @description Cierra una mesa en forma atomica, marca pedidos como pagados y libera la mesa.
   * @param {number|string} mesaId - Id de la mesa a cerrar.
   * @returns {Promise<{mesaId:number,totalCobrado:number,facturacion?:object}>} Datos de cierre para respuesta HTTP.
   * @throws {Error} `MESA_NO_ENCONTRADA` o `MESA_YA_LIBRE`.
   */
  async cerrarMesa(mesaId) {
    return await this.mesaRepository.inTransaction(async (transaction) => {

      // 1️⃣ Buscar la mesa dentro de la transacción
      const mesa = await this.mesaRepository.buscarMesaPorId(mesaId, transaction);

      // 2️⃣ Validaciones de negocio
      if (!mesa) {
        throw new Error("MESA_NO_ENCONTRADA");
      }

      if (mesa.estado === "libre") {
        throw new Error("MESA_YA_LIBRE");
      }

      // 3️⃣ Calcular el total dinámicamente desde DetallePedidos
      const totalCobrado = await this.pedidoRepository.calcularTotalMesa(mesaId, transaction);

      // 4️⃣ Generar facturación (si existe el servicio)
      const facturacion = this.facturacionService
        ? await this.facturacionService.generarResumenCierre(mesaId, transaction)
        : null;

      // 5️⃣ Marcar pedidos como pagados
      await this.pedidoRepository.marcarPedidosComoPagados(mesaId, transaction);

      // 6️⃣ Liberar la mesa (NO tocamos totalActual, lo dejamos como está)
      mesa.estado = "libre";
      mesa.mozoId = null;
      // ✅ NO reseteamos mesa.totalActual (campo deprecated)

      await this.mesaRepository.actualizarMesa(mesa, transaction);

      // 7️⃣ Retornar información relevante
      return {
        mesaId: mesa.id,
        totalCobrado,
        ...(facturacion ? { facturacion } : {}),
      };
    }).then((resultadoCierre) => {
      if (resultadoCierre.facturacion && this.pedidoEmitter?.emit) {
        this.pedidoEmitter.emit("ticket-generado", resultadoCierre.facturacion);
      }

      return resultadoCierre;
    });
  }

  /**
   * @description Calcula dinámicamente el total actual de una mesa sumando subtotales de DetallePedidos.
   * @param {number|string} mesaId - Id de mesa.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Total calculado desde DetallePedidos.
   */
  async calcularTotalActual(mesaId, transaction = null) {
    return await this.pedidoRepository.calcularTotalMesa(mesaId, transaction);
  }

  // ========================================================================
  // ⚠️ MÉTODOS DEPRECATED - Mantener por compatibilidad, eliminar después
  // ========================================================================

  /**
   * @deprecated Ya no se usa. El total se calcula dinámicamente.
   * @description Suma un monto al total actual de una mesa ocupada.
   */
  async sumarTotal(mesaId, monto, transaction = null) {
    console.warn("⚠️ sumarTotal() está deprecated. El total se calcula dinámicamente.");
    // No hace nada - mantener solo por compatibilidad
    return await this.obtenerPorId(mesaId, transaction);
  }

  /**
   * @deprecated Ya no se usa. El total se calcula dinámicamente.
   * @description Resta un monto al total de una mesa.
   */
  async restarTotal(mesaId, monto, transaction = null) {
    console.warn("⚠️ restarTotal() está deprecated. El total se calcula dinámicamente.");
    // No hace nada - mantener solo por compatibilidad
    return await this.obtenerPorId(mesaId, transaction);
  }

  /**
   * @deprecated Ya no se usa. El total se calcula dinámicamente.
   * @description Ajusta el total de una mesa.
   */
  async ajustarTotal(mesaId, diferencia, transaction = null) {
    console.warn("⚠️ ajustarTotal() está deprecated. El total se calcula dinámicamente.");
    // No hace nada - mantener solo por compatibilidad
    return await this.obtenerPorId(mesaId, transaction);
  }
}

module.exports = MesaService;