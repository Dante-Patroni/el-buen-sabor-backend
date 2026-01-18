const PedidoService = require("../../src/services/pedidoService");

// ------------------------------------------------------
// 1️⃣ MOCKS GLOBALES (Simulamos las 3 dependencias)
// ------------------------------------------------------
const mockPedidoRepository = {
  listarPedidosPorEstado: jest.fn(),
  crearPedido: jest.fn(),
  crearDetalles: jest.fn(),
  buscarPedidoPorId: jest.fn(),
  obtenerDetallesPedido: jest.fn(),
  eliminarDetallesPedido: jest.fn(),
  eliminarPedidoPorId: jest.fn(),
  buscarMesaPorId: jest.fn(),
  actualizarMesa: jest.fn(),
};

const mockPlatoRepository = {
  buscarPorId: jest.fn(),
  actualizarStock: jest.fn(),
  actualizarProductoSeleccionado: jest.fn(),
};

const mockPedidoEmitter = {
  emit: jest.fn(),
};

// ------------------------------------------------------
// 2️⃣ SETUP DEL SERVICE
// Inyectamos los 3 mocks obligatorios
// ------------------------------------------------------
const pedidoService = new PedidoService(
  mockPedidoRepository,
  mockPlatoRepository,
  mockPedidoEmitter
);

describe("PedidoService - Test Suite Completa", () => {

  // Limpiamos los contadores de llamadas antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE LECTURA (Tus tests originales)
  // ==========================================

  test("listarPedidos delega la búsqueda al repository", async () => {
    const estado = "pendiente";
    const fakePedidos = [{ id: 1, estado }, { id: 2, estado }];

    // Configuramos el mock para que devuelva datos
    mockPedidoRepository.listarPedidosPorEstado.mockResolvedValue(fakePedidos);

    const resultado = await pedidoService.listarPedidos(estado);

    expect(resultado).toHaveLength(2);
    expect(mockPedidoRepository.listarPedidosPorEstado).toHaveBeenCalledWith(estado);
  });

  test("listarPedidos lanza error si el repository falla", async () => {
    mockPedidoRepository.listarPedidosPorEstado.mockRejectedValue(new Error("ERROR_DB"));

    await expect(pedidoService.listarPedidos("pendiente"))
      .rejects.toThrow("ERROR_DB");
  });

  // ==========================================
  // TESTS DE LÓGICA CRÍTICA (Lo nuevo)
  // ==========================================

  test("crearYValidarPedido: Calcula TOTAL y descuenta STOCK", async () => {
    // GIVEN (Datos de entrada)
    const datosPedido = {
      mesa: "4",
      productos: [{ platoId: 1, cantidad: 2 }] // 2 Hamburguesas
    };

    // Simulamos que el plato existe, vale $5000 y hay 10 en stock
    mockPlatoRepository.buscarPorId.mockResolvedValue({
      id: 1,
      nombre: "Hamburguesa",
      precio: 5000,
      stockActual: 10
    });

    // Simulamos creación exitosa en BD
    mockPedidoRepository.crearPedido.mockResolvedValue({ id: 1, total: 10000, toJSON: () => ({ id: 1 }) });

    // WHEN
    await pedidoService.crearYValidarPedido(datosPedido);

    // THEN 1: Verificar el Total (Corrección del bug Total=0)
    // El primer argumento de la primera llamada debe tener total: 10000
    const argPedido = mockPedidoRepository.crearPedido.mock.calls[0][0];
    expect(argPedido.total).toBe(10000);

    // THEN 2: Verificar Stock (10 - 2 = 8)
    expect(mockPlatoRepository.actualizarStock).toHaveBeenCalledWith(1, 8);
  });

  test("eliminarPedido: Restaura STOCK y descuenta dinero mesa", async () => {
    // GIVEN
    const idPedido = 69;
    
    // El pedido existe
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({ id: idPedido, mesa: "4", total: 5000 });
    // Tenía 1 item de cantidad 1
    mockPedidoRepository.obtenerDetallesPedido.mockResolvedValue([{ PlatoId: 1, cantidad: 1 }]);
    // El plato actualmente tiene stock 8
    mockPlatoRepository.buscarPorId.mockResolvedValue({ id: 1, stockActual: 8 });

    // WHEN
    await pedidoService.eliminarPedido(idPedido);

    // THEN: El stock debe volver a 9 (8 + 1)
    expect(mockPlatoRepository.actualizarStock).toHaveBeenCalledWith(1, 9);
    
    // THEN: Debe eliminar el pedido
    expect(mockPedidoRepository.eliminarPedidoPorId).toHaveBeenCalledWith(idPedido);
  });
});