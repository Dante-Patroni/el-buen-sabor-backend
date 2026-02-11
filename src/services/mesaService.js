class MesaService {
  constructor(mesaRepository) {
    this.mesaRepository = mesaRepository;
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
  async obtenerPorId(mesaId) {
    const mesa = await this.mesaRepository.buscarMesaPorId(mesaId);
    if (!mesa) {
      const error = new Error("MESA_NO_ENCONTRADA");
      error.status = 404;
      throw error;
    }
    return mesa;
  }

  // --------------------------------------------------
  // 3. ABRIR MESA
  // --------------------------------------------------
  async abrirMesa(mesaId, mozoId) {
    const mesa = await this.obtenerPorId(mesaId);

    if (mesa.estado === "ocupada") {
      const error = new Error("MESA_YA_OCUPADA");
      error.status = 400;
      throw error;
    }

    if (!mozoId) {
      const error = new Error("MOZO_REQUERIDO");
      error.status = 400;
      throw error;
    }

    mesa.estado = "ocupada";
    mesa.mozoId = mozoId;
    mesa.totalActual = 0;

    await this.mesaRepository.actualizarMesa(mesa);

    return mesa;
  }

  // --------------------------------------------------
  // 4. CERRAR MESA
  // --------------------------------------------------
  async cerrarMesa(mesaId) {
    const mesa = await this.obtenerPorId(mesaId);

    if (mesa.estado === "libre") {
      const error = new Error("MESA_YA_LIBRE");
      error.status = 400;
      throw error;
    }

    const totalCobrado = Number(mesa.totalActual) || 0;

    mesa.estado = "libre";
    mesa.totalActual = 0;
    mesa.mozoId = null;

    await this.mesaRepository.actualizarMesa(mesa);

    return {
      mesaId: mesa.id,
      totalCobrado
    };
  }

  // --------------------------------------------------
  // 5. SUMAR TOTAL A MESA
  // --------------------------------------------------
  async sumarTotal(mesaId, monto) {
    const mesa = await this.obtenerPorId(mesaId);

    if (mesa.estado !== "ocupada") {
      const error = new Error("MESA_NO_OCUPADA");
      error.status = 400;
      throw error;
    }

    const incremento = Number(monto) || 0;
    mesa.totalActual = Number(mesa.totalActual) + incremento;

    await this.mesaRepository.actualizarMesa(mesa);

    return mesa;
  }

  // --------------------------------------------------
  // 6. RESTAR TOTAL A MESA
  // --------------------------------------------------
  async restarTotal(mesaId, monto) {
    const mesa = await this.obtenerPorId(mesaId);

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

    await this.mesaRepository.actualizarMesa(mesa);

    return mesa;
  }
  // --------------------------------------------------
  // 6. AJUSTAR TOTAL A MESA
  // --------------------------------------------------
  async ajustarTotal(mesaId, diferencia) {
    const mesa = await this.obtenerPorId(mesaId);
    //Solo puedo modificar totales de mesas activas
    if (mesa.estado !== "ocupada") {
      const error = new Error("MESA_NO_OCUPADA");
      error.status = 400;
      throw error;
    }
    //No toco estado de mesa, solo ajusto total. Si queda en 0, la mesa sigue ocupada (no es mi responsabilidad liberarla)
    mesa.totalActual = Number(mesa.totalActual) + Number(diferencia);
    await this.mesaRepository.actualizarMesa(mesa);

    return mesa;
  }

}

module.exports = MesaService;
