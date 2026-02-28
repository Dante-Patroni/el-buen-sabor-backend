
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

    // Se delega al repository la ejecución transaccional.
    // Le pasamos una función (callback) que contiene
    // toda la lógica que debe ejecutarse de forma atómica.
    return await this.mesaRepository.inTransaction(async (transaction) => {

      /**
       * 🔹 ¿Qué es este "transaction"?
       *
       * Es el objeto de transacción que el Repository creó
       * internamente usando Sequelize.
       *
       * El Service NO sabe cómo se creó.
       * Solo lo recibe y lo pasa a los métodos que deben
       * ejecutarse dentro de la misma unidad atómica.
       */

      // 1️⃣ Buscar la mesa dentro de la transacción
      const mesa = await this.mesaRepository.buscarMesaPorId(mesaId, transaction);

      // 2️⃣ Validaciones de negocio
      if (!mesa) {
        throw new Error("MESA_NO_ENCONTRADA");
      }

      if (mesa.estado === "libre") {
        throw new Error("MESA_YA_LIBRE");
      }

      // 3️⃣ Guardamos el total antes de resetear la mesa
      const totalCobrado = Number(mesa.totalActual) || 0;
      const facturacion = this.facturacionService
        ? await this.facturacionService.generarResumenCierre(mesaId, transaction)
        : null;

      // 4️⃣ Actualizamos los pedidos asociados a la mesa
      // También dentro de la misma transacción
      await this.pedidoRepository.marcarPedidosComoPagados(mesaId, transaction);

      // 5️⃣ Modificamos el estado de la entidad en memoria
      mesa.estado = "libre";
      mesa.totalActual = 0;
      mesa.mozoId = null;

      /**
       * 🔹 Punto clave:
       * El Service decide QUÉ cambiar.
       * El Repository solo persiste.
       */

      await this.mesaRepository.actualizarMesa(mesa, transaction);

      // 6️⃣ Retornamos información relevante
      // Este valor será el que devuelva inTransaction
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
   * @description Suma un monto al total actual de una mesa ocupada.
   * @param {number|string} mesaId - Id de mesa.
   * @param {number|string} monto - Monto a sumar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa actualizada.
   * @throws {Error} `MESA_NO_ENCONTRADA` o `MESA_NO_OCUPADA`.
   */
  async sumarTotal(mesaId, monto, transaction = null) {
    const mesa = await this.obtenerPorId(mesaId, transaction);

    if (mesa.estado !== "ocupada") {
      throw new Error("MESA_NO_OCUPADA");
    }

    const incremento = Number(monto) || 0;
    mesa.totalActual = Number(mesa.totalActual) + incremento;

    await this.mesaRepository.actualizarMesa(mesa, transaction);

    return mesa;
  }

  /**
   * @description Resta un monto al total de una mesa y la libera si queda en cero.
   * @param {number|string} mesaId - Id de mesa.
   * @param {number|string} monto - Monto a restar.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa actualizada.
   * @throws {Error} `MESA_NO_ENCONTRADA`.
   */
  async restarTotal(mesaId, monto, transaction = null) {
    const mesa = await this.obtenerPorId(mesaId, transaction);

    const decremento = Number(monto) || 0;
    let nuevoTotal = Number(mesa.totalActual) - decremento;

    if (nuevoTotal < 0) {
      nuevoTotal = 0;
    }

    mesa.totalActual = nuevoTotal;

    // Regla de negocio: si queda en 0 → libre
    if (nuevoTotal === 0) {
      mesa.estado = "libre";
      mesa.mozoId = null;
    }

    await this.mesaRepository.actualizarMesa(mesa, transaction);

    return mesa;
  }
  /**
   * @description Ajusta el total de una mesa ocupada segun una diferencia positiva o negativa.
   * @param {number|string} mesaId - Id de mesa.
   * @param {number} diferencia - Delta a aplicar sobre total actual.
   * @param {object|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Mesa actualizada.
   * @throws {Error} `MESA_NO_ENCONTRADA` o `MESA_NO_OCUPADA`.
   */
  async ajustarTotal(mesaId, diferencia, transaction = null) {
    const mesa = await this.obtenerPorId(mesaId, transaction);
    //Solo puedo modificar totales de mesas activas
    if (mesa.estado !== "ocupada") {
      throw new Error("MESA_NO_OCUPADA");
    }
    //No toco estado de mesa, solo ajusto total. Si queda en 0, la mesa sigue ocupada (no es mi responsabilidad liberarla)
    mesa.totalActual = Number(mesa.totalActual) + Number(diferencia);
    await this.mesaRepository.actualizarMesa(mesa, transaction);

    return mesa;
  }

}

module.exports = MesaService;
