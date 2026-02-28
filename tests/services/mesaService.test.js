const MesaService = require("../../src/services/mesaService");

describe("MesaService", () => {
  let mesaRepositoryMock;
  let pedidoRepositoryMock;
  let facturacionServiceMock;
  let pedidoEmitterMock;
  let mesaService;

  beforeEach(() => {
    // Definimos una "transacción" ficticia para los tests
    const transactionFake = { id: 'tx_123' };

    mesaRepositoryMock = {
      listarMesasConMozo: jest.fn(),
      buscarMesaPorId: jest.fn(),
      actualizarMesa: jest.fn(),
      abrirMesaSiEstaLibre: jest.fn(),
      // El mock de inTransaction debe pasar la transacción fake al callback
      inTransaction: jest.fn(async (callback) => await callback(transactionFake)),
    };

    pedidoRepositoryMock = {
      marcarPedidosComoPagados: jest.fn(),
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
  // TEST: ABRIR MESA
  // --------------------------------------------------
  test("abrirMesa abre una mesa libre", async () => {
    const mesaId = 1;
    const mozoId = 10;
    
    mesaRepositoryMock.abrirMesaSiEstaLibre.mockResolvedValue(1);

    const resultado = await mesaService.abrirMesa(mesaId, mozoId);

    expect(mesaRepositoryMock.abrirMesaSiEstaLibre).toHaveBeenCalledWith(mesaId, mozoId);
    // Según MesaService.js, el retorno es un objeto con 'mensaje'
    expect(resultado).toEqual({ mensaje: "Mesa abierta correctamente" });
  });

  test("abrirMesa lanza error si ya está ocupada", async () => {
    mesaRepositoryMock.abrirMesaSiEstaLibre.mockResolvedValue(0);

    await expect(mesaService.abrirMesa(1, 10)).rejects.toThrow("MESA_YA_OCUPADA");
  });

  // --------------------------------------------------
  // TEST: CERRAR MESA
  // --------------------------------------------------
  test("cerrarMesa cierra una mesa ocupada correctamente", async () => {
    // Arrange
    const mesaId = 4;
    const mesaFake = {
      id: mesaId,
      estado: "ocupada",
      totalActual: 15000,
      mozoId: 2
    };

    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);
    mesaRepositoryMock.actualizarMesa.mockResolvedValue(true);
    pedidoRepositoryMock.marcarPedidosComoPagados.mockResolvedValue(true);
    facturacionServiceMock.generarResumenCierre.mockResolvedValue({
      mesaId,
      pedidos: [],
      subtotal: 15000,
      recargo: 0,
      descuento: 0,
      totalFinal: 15000,
    });

    // Act
    const resultado = await mesaService.cerrarMesa(mesaId);

    // Assert
    // Verificamos que los datos en memoria se resetearon
    expect(mesaFake.estado).toBe("libre");
    expect(mesaFake.totalActual).toBe(0);
    expect(mesaFake.mozoId).toBe(null);

    // Verificamos la persistencia con la transacción
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

  test("cerrarMesa lanza error si la mesa no existe", async () => {
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(null);

    await expect(mesaService.cerrarMesa(99)).rejects.toThrow("MESA_NO_ENCONTRADA");
  });

  test("cerrarMesa lanza error si la mesa ya está libre", async () => {
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue({
      id: 1,
      estado: "libre"
    });

    await expect(mesaService.cerrarMesa(1)).rejects.toThrow("MESA_YA_LIBRE");
  });
});
