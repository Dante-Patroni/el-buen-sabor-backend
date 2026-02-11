const PedidoService = require("../../src/services/pedidoService");

// ------------------------------------------------------
// 1️⃣ MOCKS GLOBALES
// ------------------------------------------------------
const mockPedidoRepository = {
  listarPedidosPorEstado: jest.fn(),
  crearPedido: jest.fn(),
  crearDetalles: jest.fn(),
  buscarPedidoPorId: jest.fn(),
  obtenerDetallesPedido: jest.fn(),
  eliminarDetallesPedido: jest.fn(),
  eliminarPedidoPorId: jest.fn(),
  buscarPedidosPorMesa: jest.fn(),
};

const mockPlatoRepository = {
  buscarPorId: jest.fn(),
  actualizarStock: jest.fn(),
};

const mockPedidoEmitter = {
  emit: jest.fn(),
};

const mockMesaService = {
  sumarTotal: jest.fn(),
  restarTotal: jest.fn(),
  cerrarMesa: jest.fn()
};


// ------------------------------------------------------
// 2️⃣ SETUP DEL SERVICE
// ------------------------------------------------------
const pedidoService = new PedidoService(
  mockPedidoRepository,
  mockPlatoRepository,
  mockMesaService,   // 👈 tercero
  mockPedidoEmitter  // 👈 cuarto
);


describe("PedidoService - Test Suite Completa", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TESTS DE LECTURA
  // ==========================================

  test("listarPedidos delega la búsqueda al repository", async () => {
    const estado = "pendiente";
    const fakePedidos = [{ id: 1 }, { id: 2 }];

    mockPedidoRepository.listarPedidosPorEstado.mockResolvedValue(fakePedidos);

    const resultado = await pedidoService.listarPedidos(estado);

    expect(resultado).toHaveLength(2);
    expect(mockPedidoRepository.listarPedidosPorEstado)
      .toHaveBeenCalledWith(estado);
  });

  test("listarPedidos lanza error si el repository falla", async () => {
    mockPedidoRepository.listarPedidosPorEstado
      .mockRejectedValue(new Error("ERROR_DB"));

    await expect(
      pedidoService.listarPedidos("pendiente")
    ).rejects.toThrow("ERROR_DB");
  });

  // ==========================================
  // TESTS DE LÓGICA CRÍTICA
  // ==========================================

  test("crearYValidarPedido: calcula TOTAL, descuenta STOCK y suma a mesa", async () => {
    const datosPedido = {
      mesa: "4",
      productos: [{ platoId: 1, cantidad: 2 }]
    };

    mockPlatoRepository.buscarPorId.mockResolvedValue({
      id: 1,
      precio: 5000,
      stockActual: 10
    });

    mockPedidoRepository.crearPedido.mockResolvedValue({
      id: 1,
      toJSON: () => ({ id: 1 })
    });

    mockMesaService.sumarTotal.mockResolvedValue({});

    await pedidoService.crearYValidarPedido(datosPedido);

    // TOTAL correcto
    const pedidoCreado = mockPedidoRepository.crearPedido.mock.calls[0][0];
    expect(pedidoCreado.total).toBe(10000);

    // Stock actualizado
    expect(mockPlatoRepository.actualizarStock)
      .toHaveBeenCalledWith(1, 8);

    // Mesa actualizada vía MesaService
    expect(mockMesaService.sumarTotal)
      .toHaveBeenCalledWith("4", 10000);
  });

  test("eliminarPedido: restaura stock, resta total de mesa y elimina pedido", async () => {
    const idPedido = 69;

    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: idPedido,
      mesa: "4",
      total: 5000
    });

    mockPedidoRepository.obtenerDetallesPedido
      .mockResolvedValue([{ PlatoId: 1, cantidad: 1 }]);

    mockPlatoRepository.buscarPorId
      .mockResolvedValue({ id: 1, stockActual: 8 });

    mockMesaService.restarTotal.mockResolvedValue({});

    await pedidoService.eliminarPedido(idPedido);

    // Stock restaurado
    expect(mockPlatoRepository.actualizarStock)
      .toHaveBeenCalledWith(1, 9);

    // Mesa actualizada vía MesaService
    expect(mockMesaService.restarTotal)
      .toHaveBeenCalledWith("4", 5000);

    // Pedido eliminado
    expect(mockPedidoRepository.eliminarPedidoPorId)
      .toHaveBeenCalledWith(idPedido);
  });

  test("eliminarPedido: lanza error si el pedido no existe", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue(null);

    await expect(
      pedidoService.eliminarPedido(999)
    ).rejects.toThrow("PEDIDO_NO_ENCONTRADO");
  });

  // ==========================================
  // BUSCAR PEDIDOS POR MESA
  // ==========================================

  test("buscarPedidosPorMesa: delega al repository", async () => {
    const fakePedidos = [{ id: 1 }, { id: 2 }];

    mockPedidoRepository.buscarPedidosPorMesa
      .mockResolvedValue(fakePedidos);

    const resultado = await pedidoService.buscarPedidosPorMesa(4);

    expect(resultado).toEqual(fakePedidos);
    expect(mockPedidoRepository.buscarPedidosPorMesa)
      .toHaveBeenCalledWith(4);
  });

  test("buscarPedidosPorMesa: devuelve array vacío", async () => {
    mockPedidoRepository.buscarPedidosPorMesa
      .mockResolvedValue([]);

    const resultado = await pedidoService.buscarPedidosPorMesa(10);

    expect(resultado).toEqual([]);
  });

  test("buscarPedidosPorMesa: lanza error si falla el repository", async () => {
    mockPedidoRepository.buscarPedidosPorMesa
      .mockRejectedValue(new Error("ERROR_DB"));

    await expect(
      pedidoService.buscarPedidosPorMesa(4)
    ).rejects.toThrow("ERROR_DB");
  });

});
