const MesaService = require("../../src/services/mesaService");

describe("MesaService", () => {

  let mesaRepositoryMock;
  let mesaService;

  beforeEach(() => {
    // Mock del repository
    mesaRepositoryMock = {
      listarMesasConMozo: jest.fn(),
      buscarMesaPorId: jest.fn(),
      actualizarMesa: jest.fn(),
    };

    // Inyectamos el mock
    mesaService = new MesaService(mesaRepositoryMock);
  });

  test("listar delega la búsqueda al mesaRepository", async () => {
  // Arrange (preparar escenario)
  const mesasFake = [
    { id: 1, estado: "libre" },
    { id: 2, estado: "ocupada" },
  ];

  // El mock devuelve datos simulados
  mesaRepositoryMock.listarMesasConMozo.mockResolvedValue(mesasFake);

  // Act (ejecutar)
  const resultado = await mesaService.listar();

  // Assert (verificar)
  expect(mesaRepositoryMock.listarMesasConMozo).toHaveBeenCalledTimes(1);
  expect(resultado).toEqual(mesasFake);
});

test("abrirMesa abre una mesa libre", async () => {
  // Arrange
  const mesaFake = {
    id: 1,
    estado: "libre",
    mozoId: null,
    save: jest.fn()
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

});
