const MesaService = require("../../src/services/mesaService");

describe("MesaService", () => {
  let mesaRepositoryMock;
  let pedidoRepositoryMock;
  let facturacionServiceMock;
  let pedidoEmitterMock;
  let mesaService;

  beforeEach(() => {
    const transactionFake = { id: 'tx_123' };

    mesaRepositoryMock = {
      listarMesasConMozo: jest.fn(),
      buscarMesaPorId: jest.fn(),
      actualizarMesa: jest.fn(),
      abrirMesaSiEstaLibre: jest.fn(),
      inTransaction: jest.fn(async (callback) => await callback(transactionFake)),
    };

    pedidoRepositoryMock = {
      marcarPedidosComoPagados: jest.fn(),
      calcularTotalMesa: jest.fn(),
    };

    facturacionServiceMock = {
      generarResumenCierre: jest.fn(),
    };

    pedidoEmitterMock = {
      emit: jest.fn(),
    };

    mesaService = new MesaService(
      mesaRepositoryMock,
      pedidoRepositoryMock,
      facturacionServiceMock,
      pedidoEmitterMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------
  // TEST: LISTAR
  // --------------------------------------------------
  test("listar delega la búsqueda al mesaRepository", async () => {
    const mesasFake = [{ id: 1, estado: "libre" }];
    mesaRepositoryMock.listarMesasConMozo.mockResolvedValue(mesasFake);

    const resultado = await mesaService.listar();

    expect(mesaRepositoryMock.listarMesasConMozo).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(mesasFake);
  });

  // --------------------------------------------------
  // TEST: OBTENER POR ID
  // --------------------------------------------------
  test("obtenerPorId retorna mesa encontrada", async () => {
    const mesaFake = { id: 4, estado: "ocupada", nombre: "Mesa 4" };
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);

    const resultado = await mesaService.obtenerPorId(4);

    expect(mesaRepositoryMock.buscarMesaPorId).toHaveBeenCalledWith(4, null);
    expect(resultado).toEqual(mesaFake);
  });

  test("obtenerPorId lanza error si no encuentra mesa", async () => {
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(null);

    await expect(mesaService.obtenerPorId(99)).rejects.toThrow("MESA_NO_ENCONTRADA");
  });

  // --------------------------------------------------
  // TEST: ABRIR MESA
  // --------------------------------------------------
  test("abrirMesa abre una mesa libre", async () => {
    const mesaId = 1;
    const mozoId = 10;

    mesaRepositoryMock.abrirMesaSiEstaLibre.mockResolvedValue(1);

    const resultado = await mesaService.abrirMesa(mesaId, mozoId);

    expect(mesaRepositoryMock.abrirMesaSiEstaLibre).toHaveBeenCalledWith(mesaId, mozoId);
    expect(resultado).toEqual({ mensaje: "Mesa abierta correctamente" });
  });

  test("abrirMesa lanza error si falta mozoId", async () => {
    await expect(mesaService.abrirMesa(1, null)).rejects.toThrow("MOZO_REQUERIDO");
  });

  test("abrirMesa lanza error si ya está ocupada", async () => {
    mesaRepositoryMock.abrirMesaSiEstaLibre.mockResolvedValue(0);

    await expect(mesaService.abrirMesa(1, 10)).rejects.toThrow("MESA_YA_OCUPADA");
  });

  // --------------------------------------------------
  // TEST: SOLICITAR COBRO
  // --------------------------------------------------
  describe("solicitarCobro", () => {
    test("marca mesa como esperando_cobro y emite evento", async () => {
      const mesaFake = { id: 4, estado: "ocupada" };
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);
      mesaRepositoryMock.actualizarMesa.mockResolvedValue(true);

      const resultado = await mesaService.solicitarCobro(4);

      expect(mesaRepositoryMock.buscarMesaPorId).toHaveBeenCalledWith(4);
      expect(mesaFake.estado).toBe("esperando_cobro");
      expect(mesaRepositoryMock.actualizarMesa).toHaveBeenCalledWith(mesaFake);
      expect(pedidoEmitterMock.emit).toHaveBeenCalledWith(
        "mesa-esperando-cobro",
        { mesaId: 4, estado: "esperando_cobro" }
      );
      expect(resultado).toEqual({ mensaje: "Cobro solicitado correctamente" });
    });

    test("lanza MESA_NO_ENCONTRADA si la mesa no existe", async () => {
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(null);

      await expect(mesaService.solicitarCobro(99)).rejects.toThrow("MESA_NO_ENCONTRADA");
      expect(mesaRepositoryMock.actualizarMesa).not.toHaveBeenCalled();
    });

    test("lanza MESA_YA_LIBRE si la mesa está libre", async () => {
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue({ id: 1, estado: "libre" });

      await expect(mesaService.solicitarCobro(1)).rejects.toThrow("MESA_YA_LIBRE");
      expect(mesaRepositoryMock.actualizarMesa).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------
  // TEST: CERRAR MESA (con totales dinámicos)
  // --------------------------------------------------
  describe("cerrarMesa", () => {
    test("cierra una mesa en estado esperando_cobro calculando total dinámicamente", async () => {
      const mesaId = 4;
      // ✅ CORREGIDO: el service exige estado "esperando_cobro" para cerrar
      const mesaFake = {
        id: mesaId,
        estado: "esperando_cobro",
        mozoId: 2,
      };

      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);
      mesaRepositoryMock.actualizarMesa.mockResolvedValue(true);
      pedidoRepositoryMock.calcularTotalMesa.mockResolvedValue(15000);
      pedidoRepositoryMock.marcarPedidosComoPagados.mockResolvedValue(true);

      facturacionServiceMock.generarResumenCierre.mockResolvedValue({
        mesaId,
        pedidos: [],
        subtotal: 15000,
        recargo: 0,
        descuento: 0,
        totalFinal: 15000,
      });

      const resultado = await mesaService.cerrarMesa(mesaId);

      expect(pedidoRepositoryMock.calcularTotalMesa).toHaveBeenCalledWith(mesaId, expect.anything());
      expect(mesaFake.estado).toBe("libre");
      expect(mesaFake.mozoId).toBe(null);
      expect(pedidoRepositoryMock.marcarPedidosComoPagados).toHaveBeenCalledWith(mesaId, expect.anything());
      expect(mesaRepositoryMock.actualizarMesa).toHaveBeenCalledWith(mesaFake, expect.anything());
      expect(facturacionServiceMock.generarResumenCierre).toHaveBeenCalledWith(mesaId, expect.anything());
      expect(pedidoEmitterMock.emit).toHaveBeenCalledWith("ticket-generado", expect.any(Object));

      expect(resultado).toEqual({
        mesaId: 4,
        totalCobrado: 15000,
        facturacion: expect.any(Object),
      });
    });

    test("lanza MESA_NO_ENCONTRADA si la mesa no existe", async () => {
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(null);

      await expect(mesaService.cerrarMesa(99)).rejects.toThrow("MESA_NO_ENCONTRADA");
    });

    test("lanza MESA_YA_LIBRE si la mesa ya está libre", async () => {
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue({
        id: 1,
        estado: "libre",
      });

      await expect(mesaService.cerrarMesa(1)).rejects.toThrow("MESA_YA_LIBRE");
    });

    test("lanza MESA_NO_SOLICITO_COBRO si la mesa está ocupada pero no esperando cobro", async () => {
      // ✅ NUEVO: valida que el estado sea exactamente "esperando_cobro"
      mesaRepositoryMock.buscarMesaPorId.mockResolvedValue({
        id: 2,
        estado: "ocupada",
      });

      await expect(mesaService.cerrarMesa(2)).rejects.toThrow("MESA_NO_SOLICITO_COBRO");
      expect(pedidoRepositoryMock.calcularTotalMesa).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------
  // TEST: CALCULAR TOTAL ACTUAL
  // --------------------------------------------------
  describe("calcularTotalActual", () => {
    test("delega al pedidoRepository", async () => {
      pedidoRepositoryMock.calcularTotalMesa.mockResolvedValue(5400);

      const resultado = await mesaService.calcularTotalActual(4);

      expect(pedidoRepositoryMock.calcularTotalMesa).toHaveBeenCalledWith(4, null);
      expect(resultado).toBe(5400);
    });

    test("retorna 0 si no hay pedidos", async () => {
      pedidoRepositoryMock.calcularTotalMesa.mockResolvedValue(0);

      const resultado = await mesaService.calcularTotalActual(5);

      expect(resultado).toBe(0);
    });
  });
});
