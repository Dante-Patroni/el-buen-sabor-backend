const PlatoService = require("../../src/services/platoService");

describe("PlatoService - Test Suite", () => {
  let platoService;
  let platoRepositoryMock;

  beforeEach(() => {
    // 🔧 MOCK LIMPIO: Ahora todo coincide con 'buscarPorId'
    platoRepositoryMock = {
      listarMenuCompleto: jest.fn(),
      crearNuevoProducto: jest.fn(),
      buscarPorId: jest.fn(),            // ✅ Coincide con tu corrección
      buscarPorNombre: jest.fn(),        // ✅ Usado en _validarProducto
      modificarProductoSeleccionado: jest.fn(),
      actualizarProducto: jest.fn(),
      inTransaction: jest.fn((callback) => callback(null)), // ✅ Mock de transacción
    };

    platoService = new PlatoService(platoRepositoryMock);
    jest.clearAllMocks();
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
  });

  // 🧪 2. CREAR PLATO
  test("crearNuevoProducto crea un plato correctamente", async () => {
    const datosPlato = { nombre: "Milanesa", precio: 1800, rubroId: 1, stockActual: 10 };
    platoRepositoryMock.buscarPorNombre.mockResolvedValue(null); // No existe duplicado
    platoRepositoryMock.crearNuevoProducto.mockResolvedValue(datosPlato);

    const resultado = await platoService.crearNuevoProducto(datosPlato);

    expect(resultado).toEqual(datosPlato);
  });

  // 🧪 3. MODIFICAR PLATO (EXISTE)
  test("modificarProducto actualiza un plato existente", async () => {
    const platoExistente = { id: 1, nombre: "Pizza", precio: 1000 };
    const datosActualizados = { precio: 1200 };

    // Usamos buscarPorId
    platoRepositoryMock.buscarPorId.mockResolvedValue(platoExistente);
    platoRepositoryMock.buscarPorNombre.mockResolvedValue(null);

    platoRepositoryMock.modificarProductoSeleccionado.mockResolvedValue({
      ...platoExistente, ...datosActualizados,
    });

    const resultado = await platoService.modificarProducto(1, datosActualizados);

    expect(platoRepositoryMock.buscarPorId).toHaveBeenCalledWith(1, null);
    expect(resultado.precio).toBe(1200);
  });

  // 🧪 4. MODIFICAR PLATO (NO EXISTE)
  test("modificarProducto devuelve null si el plato no existe", async () => {
    platoRepositoryMock.buscarPorId.mockResolvedValue(null);

    const resultado = await platoService.modificarProducto(99, { precio: 2000 });

    expect(resultado).toBeNull();
  });

  // 🧪 5. GESTIÓN DE IMÁGENES
  test("cargarImagenProducto debe actualizar path y devolver plato", async () => {
    const id = 35;
    const filename = "milanesa.jpg";
    const rutaFinal = "/uploads/milanesa.jpg";

    // Simulamos las dos llamadas que hace tu código usando buscarPorId
    platoRepositoryMock.buscarPorId
      .mockResolvedValueOnce({ id, nombre: "Plato" }) // 1ra: Validación
      .mockResolvedValueOnce({ id, nombre: "Plato", imagenPath: rutaFinal }); // 2da: Retorno

    platoRepositoryMock.modificarProductoSeleccionado.mockResolvedValue(true);

    const resultado = await platoService.cargarImagenProducto(id, filename);

    expect(platoRepositoryMock.modificarProductoSeleccionado).toHaveBeenCalledWith(
      id, { imagenPath: rutaFinal }, null
    );
    expect(resultado.imagenPath).toBe(rutaFinal);
  });

  test("cargarImagenProducto devuelve null si el plato no existe", async () => {
    platoRepositoryMock.buscarPorId.mockResolvedValue(null);

    const resultado = await platoService.cargarImagenProducto(999, "foto.jpg");

    expect(resultado).toBeNull();
    expect(platoRepositoryMock.modificarProductoSeleccionado).not.toHaveBeenCalled();
  });
});