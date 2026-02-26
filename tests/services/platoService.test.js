const PlatoService = require("../../src/services/platoService");

describe("PlatoService - Test Suite", () => {
  let platoService;
  let platoRepositoryMock;

  beforeEach(() => {
    platoRepositoryMock = {
      listarMenuCompleto: jest.fn(),
      crearNuevoProducto: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorNombre: jest.fn(),
      modificarProductoSeleccionado: jest.fn(),
      actualizarProducto: jest.fn(),
      inTransaction: jest.fn((callback) => callback(null)),
    };

    platoService = new PlatoService(platoRepositoryMock);
    jest.clearAllMocks();
  });

  test("listarMenuCompleto devuelve la lista de platos", async () => {
    const platosMock = [
      { id: 1, nombre: "Pizza", precio: 1000 },
      { id: 2, nombre: "Hamburguesa", precio: 1500 },
    ];
    platoRepositoryMock.listarMenuCompleto.mockResolvedValue(platosMock);

    const resultado = await platoService.listarMenuCompleto();

    expect(resultado).toEqual(platosMock);
  });

  test("crearNuevoProducto crea un plato correctamente", async () => {
    const datosPlato = {
      nombre: "Milanesa",
      precio: 1800,
      rubroId: 1,
      stockActual: 10,
    };
    platoRepositoryMock.buscarPorNombre.mockResolvedValue(null);
    platoRepositoryMock.crearNuevoProducto.mockResolvedValue(datosPlato);

    const resultado = await platoService.crearNuevoProducto(datosPlato);

    expect(resultado).toEqual(datosPlato);
  });

  test("modificarProducto actualiza un plato existente", async () => {
    const platoExistente = { id: 1, nombre: "Pizza", precio: 1000 };
    const datosActualizados = { precio: 1200 };

    platoRepositoryMock.buscarPorId.mockResolvedValue(platoExistente);
    platoRepositoryMock.buscarPorNombre.mockResolvedValue(null);
    platoRepositoryMock.modificarProductoSeleccionado.mockResolvedValue({
      ...platoExistente,
      ...datosActualizados,
    });

    const resultado = await platoService.modificarProducto(1, datosActualizados);

    expect(platoRepositoryMock.buscarPorId).toHaveBeenCalledWith(1, null);
    expect(resultado.precio).toBe(1200);
  });

  test("modificarProducto lanza error si el plato no existe", async () => {
    platoRepositoryMock.buscarPorId.mockResolvedValue(null);

    await expect(
      platoService.modificarProducto(99, { precio: 2000 })
    ).rejects.toThrow("PLATO_NO_ENCONTRADO");
  });

  test("cargarImagenProducto debe actualizar path y devolver plato", async () => {
    const id = 35;
    const filename = "milanesa.jpg";
    const rutaFinal = "/uploads/milanesa.jpg";

    platoRepositoryMock.buscarPorId
      .mockResolvedValueOnce({ id, nombre: "Plato" })
      .mockResolvedValueOnce({ id, nombre: "Plato", imagenPath: rutaFinal });

    platoRepositoryMock.modificarProductoSeleccionado.mockResolvedValue(true);

    const resultado = await platoService.cargarImagenProducto(id, filename);

    expect(platoRepositoryMock.modificarProductoSeleccionado).toHaveBeenCalledWith(
      id,
      { imagenPath: rutaFinal },
      null
    );
    expect(resultado.imagenPath).toBe(rutaFinal);
  });

  test("cargarImagenProducto lanza error si el plato no existe", async () => {
    platoRepositoryMock.buscarPorId.mockResolvedValue(null);

    await expect(
      platoService.cargarImagenProducto(999, "foto.jpg")
    ).rejects.toThrow("PLATO_NO_ENCONTRADO");
    expect(platoRepositoryMock.modificarProductoSeleccionado).not.toHaveBeenCalled();
  });
});
