const PlatoService = require("../../src/services/platoService");

describe("PlatoService", () => {
  let platoService;
  let platoRepositoryMock;

  beforeEach(() => {
    platoRepositoryMock = {
      listarMenuCompleto: jest.fn(),
      crearNuevoProducto: jest.fn(),
      buscarProductoPorId: jest.fn(),
      modificarProductoSeleccionado: jest.fn(),
      actualizarProducto: jest.fn(),
    };

    platoService = new PlatoService(platoRepositoryMock);
  });

  // 🧪 1. LISTAR MENÚ
  test("listarMenuCompleto devuelve la lista de platos", async () => {
    const platosMock = [
      { id: 1, nombre: "Pizza", precio: 1000 },
      { id: 2, nombre: "Hamburguesa", precio: 1500 },
    ];

    platoRepositoryMock.listarMenuCompleto.mockResolvedValue(platosMock);

    const resultado = await platoService.listarMenuCompleto();

    expect(resultado).toEqual(platosMock);
    expect(platoRepositoryMock.listarMenuCompleto).toHaveBeenCalledTimes(1);
  });

  // 🧪 2. CREAR PLATO
  test("crearNuevoProducto crea un plato correctamente", async () => {
    const datosPlato = {
      nombre: "Milanesa",
      precio: 1800,
      rubroId: 1,
    };

    platoRepositoryMock.crearNuevoProducto.mockResolvedValue(datosPlato);

    const resultado = await platoService.crearNuevoProducto(datosPlato);

    expect(resultado).toEqual(datosPlato);
    expect(platoRepositoryMock.crearNuevoProducto).toHaveBeenCalledWith(datosPlato);
  });

  // 🧪 3. MODIFICAR PLATO (EXISTE)
  test("modificarProducto actualiza un plato existente", async () => {
    const platoExistente = { id: 1, nombre: "Pizza", precio: 1000 };
    const datosActualizados = { precio: 1200 };

    platoRepositoryMock.buscarProductoPorId.mockResolvedValue(platoExistente);
    platoRepositoryMock.modificarProductoSeleccionado.mockResolvedValue({
      ...platoExistente,
      ...datosActualizados,
    });

    const resultado = await platoService.modificarProducto(1, datosActualizados);

    expect(platoRepositoryMock.buscarProductoPorId).toHaveBeenCalledWith(1);
    expect(platoRepositoryMock.modificarProductoSeleccionado).toHaveBeenCalledWith(
      1,
      datosActualizados
    );
    expect(resultado.precio).toBe(1200);
  });

  // 🧪 4. MODIFICAR PLATO (NO EXISTE)
  test("modificarProducto devuelve null si el plato no existe", async () => {
    platoRepositoryMock.buscarProductoPorId.mockResolvedValue(null);

    const resultado = await platoService.modificarProducto(99, { precio: 2000 });

    expect(resultado).toBeNull();
    expect(platoRepositoryMock.modificarProductoSeleccionado).not.toHaveBeenCalled();
  });
});
