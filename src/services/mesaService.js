
class MesaService {
  constructor(mesaRepository, pedidoRepository) {
    this.mesaRepository = mesaRepository;
    this.pedidoRepository = pedidoRepository;
  }

  // --------------------------------------------------
  // 1. LISTAR MESAS
  // --------------------------------------------------
  async listar() {
    return await this.mesaRepository.listarMesasConMozo();
  }

  // --------------------------------------------------
  // 2. OBTENER MESA POR ID
  // --------------------------------------------------
  async obtenerPorId(mesaId, transaction = null) {
    const mesa = await this.mesaRepository.buscarMesaPorId(mesaId, transaction);
    if (!mesa) {
      const error = new Error("MESA_NO_ENCONTRADA");
      error.status = 404;
      throw error;
    }
    return mesa;
  }

  // --------------------------------------------------
// 3. ABRIR MESA (SEGURA)
// --------------------------------------------------
async abrirMesa(mesaId, mozoId) {

  if (!mozoId) {
    const error = new Error("MOZO_REQUERIDO");
    error.status = 400;
    throw error;
  }

  const affectedRows = await this.mesaRepository.abrirMesaSiEstaLibre(
    mesaId,
    mozoId
  );

  if (affectedRows === 0) {
    const error = new Error("MESA_YA_OCUPADA");
    error.status = 400;
    throw error;
  }

  return { mensaje: "Mesa abierta correctamente" };
}


  // --------------------------------------------------
  // 4. CERRAR MESA
  // --------------------------------------------------
  /**
  * Cierra una mesa dentro de una transacción.
  *
  * Esta operación es atómica: si alguna parte falla
  * (validación, actualización, pedidos), todo se revierte.
  *
  * El Service define la lógica de negocio.
  * El Repository se encarga de ejecutar la transacción.
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
        const error = new Error("MESA_NO_ENCONTRADA");
        error.status = 404;
        throw error; // Si lanzamos error → inTransaction hará rollback
      }

      if (mesa.estado === "libre") {
        const error = new Error("MESA_YA_LIBRE");
        error.status = 400;
        throw error;
      }

      // 3️⃣ Guardamos el total antes de resetear la mesa
      const totalCobrado = Number(mesa.totalActual) || 0;

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
        totalCobrado
      };
    });
  }



  // --------------------------------------------------
  // 5. SUMAR TOTAL A MESA
  // --------------------------------------------------
  //Este método es llamado desde PedidoService.crearYValidarPedido()
  //Recibe transaction como parámetro para poder ejecutar la operación dentro de la misma transacción
  async sumarTotal(mesaId, monto, transaction = null) {
    const mesa = await this.obtenerPorId(mesaId, transaction);

    if (mesa.estado !== "ocupada") {
      const error = new Error("MESA_NO_OCUPADA");
      error.status = 400;
      throw error;
    }

    const incremento = Number(monto) || 0;
    mesa.totalActual = Number(mesa.totalActual) + incremento;

    await this.mesaRepository.actualizarMesa(mesa, transaction);

    return mesa;
  }

  // --------------------------------------------------
  // 6. RESTAR TOTAL A MESA
  // --------------------------------------------------
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
  // --------------------------------------------------
  // 6. AJUSTAR TOTAL A MESA
  // --------------------------------------------------
  async ajustarTotal(mesaId, diferencia, transaction = null) {
    const mesa = await this.obtenerPorId(mesaId, transaction);
    //Solo puedo modificar totales de mesas activas
    if (mesa.estado !== "ocupada") {
      const error = new Error("MESA_NO_OCUPADA");
      error.status = 400;
      throw error;
    }
    //No toco estado de mesa, solo ajusto total. Si queda en 0, la mesa sigue ocupada (no es mi responsabilidad liberarla)
    mesa.totalActual = Number(mesa.totalActual) + Number(diferencia);
    await this.mesaRepository.actualizarMesa(mesa, transaction);

    return mesa;
  }

}

module.exports = MesaService;
