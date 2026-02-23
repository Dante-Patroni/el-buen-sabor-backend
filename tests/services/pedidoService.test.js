const PedidoService = require("../../src/services/pedidoService");

describe("PedidoService - Test Suite Completa", () => {
  let mockPedidoRepository;
  let mockPlatoService;
  let mockMesaService;
  let mockInsumoService;
  let mockPedidoEmitter;
  let pedidoService;

  beforeEach(() => {
    mockPedidoRepository = {
      crearPedido: jest.fn(),
      crearDetalles: jest.fn(),
      inTransaction: jest.fn(async (callback) => await callback({ id: 'tx_999' })),
    };

    mockPlatoService = {
      obtenerPorId: jest.fn(),
    };

    mockMesaService = {
      obtenerPorId: jest.fn(),
      sumarTotal: jest.fn(),
    };

    mockInsumoService = {
      descontarStock: jest.fn(),
    };

    // Creamos el mock para el emisor de eventos
    mockPedidoEmitter = {
      emit: jest.fn(),
    };

    pedidoService = new PedidoService(
      mockPedidoRepository,
      mockPlatoService,
      mockMesaService,
      mockInsumoService
    );

    // Inyectamos el emisor de eventos manualmente
    pedidoService.pedidoEmitter = mockPedidoEmitter;
    
    // Mock de _procesarProductos ya que es un método interno
    pedidoService._procesarProductos = jest.fn();
  });

  test("crearYValidarPedido: calcula TOTAL, descuenta STOCK y suma a mesa", async () => {
    // Arrange
    const pedidoData = {
      mesa: 4,
      productos: [{ platoId: 1, cantidad: 2 }],
      cliente: "Juan Topo"
    };

    // 1️⃣ Mock de MesaService.obtenerPorId
    mockMesaService.obtenerPorId.mockResolvedValue({
      id: 4,
      estado: "ocupada",
      totalActual: 0
    });

    // 2️⃣ Mock de _procesarProductos
    const mockDetalles = [{ platoId: 1, cantidad: 2, subtotal: 10000 }];
    pedidoService._procesarProductos.mockResolvedValue({
      total: 10000,
      detalles: mockDetalles
    });

    // 3️⃣ Mock de PedidoRepository.crearPedido
    const pedidoCreadoFake = {
      id: 100,
      mesa: 4,
      total: 10000,
      toJSON: () => ({ id: 100, mesa: 4, total: 10000 })
    };
    mockPedidoRepository.crearPedido.mockResolvedValue(pedidoCreadoFake);
    
    // 4️⃣ Mock de crearDetalles y sumarTotal
    mockPedidoRepository.crearDetalles.mockResolvedValue(true);
    mockMesaService.sumarTotal.mockResolvedValue(true);

    // Act
    const resultado = await pedidoService.crearYValidarPedido(pedidoData);

    // Assert
    expect(mockMesaService.obtenerPorId).toHaveBeenCalledWith(4, expect.anything());
    
    expect(mockPedidoRepository.crearPedido).toHaveBeenCalledWith(
      expect.objectContaining({
        mesa: 4,
        total: 10000
      }),
      expect.anything()
    );

    expect(mockMesaService.sumarTotal).toHaveBeenCalledWith(4, 10000, expect.anything());
    
    // Verificamos que se emitió el evento
    expect(mockPedidoEmitter.emit).toHaveBeenCalledWith(
      "pedido-creado",
      expect.objectContaining({
        pedido: expect.any(Object)
      })
    );

    expect(resultado.id).toBe(100);
  });
});