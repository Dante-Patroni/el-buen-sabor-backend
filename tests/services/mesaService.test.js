const MesaService = require("../../src/services/mesaService");

describe("MesaService", () => {

  let mesaRepositoryMock;
  let mesaService;

  beforeEach(() => {
    mesaRepositoryMock = {
      listarMesasConMozo: jest.fn(),
      buscarMesaPorId: jest.fn(),
      actualizarMesa: jest.fn(),
    };

    mesaService = new MesaService(mesaRepositoryMock);
  });

  test("listar delega la búsqueda al mesaRepository", async () => {
    // Arrange
    const mesasFake = [
      { id: 1, estado: "libre" },
      { id: 2, estado: "ocupada" },
    ];

    mesaRepositoryMock.listarMesasConMozo.mockResolvedValue(mesasFake);

    // Act
    const resultado = await mesaService.listar();

    // Assert
    expect(mesaRepositoryMock.listarMesasConMozo).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(mesasFake);
  });

  test("abrirMesa abre una mesa libre", async () => {
    // Arrange
    const mesaFake = {
      id: 1,
      estado: "libre",
      mozoId: null,
    };

    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);
    mesaRepositoryMock.actualizarMesa.mockResolvedValue(mesaFake);

    // Act
    const resultado = await mesaService.abrirMesa(1, 10);

    // Assert
    expect(mesaRepositoryMock.buscarMesaPorId).toHaveBeenCalledWith(1);
    expect(mesaFake.estado).toBe("ocupada");
    expect(mesaFake.mozoId).toBe(10);
    expect(mesaRepositoryMock.actualizarMesa).toHaveBeenCalledWith(mesaFake);
    expect(resultado).toBe(mesaFake);
  });

  test("cerrarMesa cierra una mesa ocupada correctamente", async () => {
    // Arrange
    const mesaFake = {
      id: 4,
      estado: "ocupada",
      totalActual: 15000,
      mozoId: 2
    };

    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(mesaFake);
    mesaRepositoryMock.actualizarMesa.mockResolvedValue(mesaFake);

    // Act
    const resultado = await mesaService.cerrarMesa(4);

    // Assert
    expect(mesaFake.estado).toBe("libre");
    expect(mesaFake.totalActual).toBe(0);
    expect(mesaFake.mozoId).toBe(null);

    expect(mesaRepositoryMock.actualizarMesa)
      .toHaveBeenCalledWith(mesaFake);

    expect(resultado).toEqual({
      mesaId: 4,
      totalCobrado: 15000
    });
  });

  test("cerrarMesa lanza error si la mesa no existe", async () => {
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue(null);

    await expect(
      mesaService.cerrarMesa(99)
    ).rejects.toThrow("MESA_NO_ENCONTRADA");
  });

  test("cerrarMesa lanza error si la mesa ya está libre", async () => {
    mesaRepositoryMock.buscarMesaPorId.mockResolvedValue({
      id: 1,
      estado: "libre"
    });

    await expect(
      mesaService.cerrarMesa(1)
    ).rejects.toThrow("MESA_YA_CERRADA");
  });

});
