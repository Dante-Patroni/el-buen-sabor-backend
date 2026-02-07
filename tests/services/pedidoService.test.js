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
  buscarPedidosPorMesa: jest.fn(),
  buscarPedidoAbiertosPorMesa: jest.fn(),
  marcarPedidosComoPagados: jest.fn(),
  cerrarMesa: jest.fn(),

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

  //=============================================================================================
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

  //=============================================================================================
  test("eliminarPedido: restaura stock, actualiza mesa y elimina pedido", async () => {
    const idPedido = 69;

    mockPedidoRepository.buscarPedidoPorId
      .mockResolvedValue({ id: idPedido, mesa: "4", total: 5000 });

    mockPedidoRepository.obtenerDetallesPedido
      .mockResolvedValue([{ PlatoId: 1, cantidad: 1 }]);

    mockPlatoRepository.buscarPorId
      .mockResolvedValue({ id: 1, stockActual: 8 });

    mockPedidoRepository.buscarMesaPorId
      .mockResolvedValue({ id: "4", totalActual: 5000, estado: "ocupada" });

    await pedidoService.eliminarPedido(idPedido);

    // Stock restaurado
    expect(mockPlatoRepository.actualizarStock)
      .toHaveBeenCalledWith(1, 9);

    // Mesa actualizada
    expect(mockPedidoRepository.actualizarMesa)
      .toHaveBeenCalled();

    // Pedido eliminado
    expect(mockPedidoRepository.eliminarPedidoPorId)
      .toHaveBeenCalledWith(idPedido);
  });
  //=============================================================================================
  test("eliminarPedido: lanza error si el pedido no existe", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue(null);

    await expect(
      pedidoService.eliminarPedido(999)
    ).rejects.toThrow("PEDIDO_NO_ENCONTRADO");
  });


  //=============================================================================================
  // TEST EXTRA: Buscar pedidos por mesa (GET /api/pedidos/mesa/:mesa)
  //=============================================================================================

  //Test 1️⃣ – Caso feliz: devuelve pedidos de una mesa
  test("buscarPedidosPorMesa: delega al repository y devuelve pedidos", async () => {
    // GIVEN
    const mesa = 4;
    const fakePedidos = [
      { id: 1, mesa: "4", total: 5000 },
      { id: 2, mesa: "4", total: 3000 }
    ];

    mockPedidoRepository.buscarPedidosPorMesa.mockResolvedValue(fakePedidos);

    // WHEN
    const resultado = await pedidoService.buscarPedidosPorMesa(mesa);

    // THEN
    expect(mockPedidoRepository.buscarPedidosPorMesa)
      .toHaveBeenCalledWith(mesa);

    expect(resultado).toEqual(fakePedidos);
  });

  //Test 2️⃣ – Mesa sin pedidos → array vacío
  test("buscarPedidosPorMesa: devuelve array vacío si no hay pedidos", async () => {
    // GIVEN
    const mesa = 10;

    mockPedidoRepository.buscarPedidosPorMesa.mockResolvedValue([]);

    // WHEN
    const resultado = await pedidoService.buscarPedidosPorMesa(mesa);

    // THEN
    expect(resultado).toEqual([]);
  });

  //Test 3️⃣ – Error del repository → lanza error
  test("buscarPedidosPorMesa: lanza error si el repository falla", async () => {
    // GIVEN
    mockPedidoRepository.buscarPedidosPorMesa
      .mockRejectedValue(new Error("ERROR_DB"));

    // THEN
    await expect(
      pedidoService.buscarPedidosPorMesa(4)
    ).rejects.toThrow("ERROR_DB");
  });


  //=============================================================================================
  // TEST Cerrar mesa (POST /api/pedidos/cerrar-mesa)
  //=============================================================================================
  //TEST 1️⃣ – Caso feliz: cierra mesa correctamente
  test("cerrarMesa: cierra la mesa, cobra total y marca pedidos como pagados", async () => {
    // GIVEN
    const mesaId = 4;

    mockPedidoRepository.buscarMesaPorId.mockResolvedValue({
      id: mesaId,
      estado: "ocupada",
      totalActual: 15000,
      mozo_id: 2
    });

    mockPedidoRepository.buscarPedidoAbiertosPorMesa.mockResolvedValue([
      { id: 1 },
      { id: 2 }
    ]);

    // WHEN
    const resultado = await pedidoService.cerrarMesa(mesaId);

    // THEN
    expect(mockPedidoRepository.marcarPedidosComoPagados)
      .toHaveBeenCalledWith(mesaId);

    expect(mockPedidoRepository.cerrarMesa)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          estado: "libre",
          totalActual: 0,
          mozo_id: null
        })
      );

    expect(resultado).toEqual({
      mesaId: mesaId,
      totalCobrado: 15000,
      pedidosCerrados: 2
    });
  });

  //TEST 2️⃣ – Error: mesa no existe
  test("cerrarMesa: lanza error si la mesa no existe", async () => {
    mockPedidoRepository.buscarMesaPorId.mockResolvedValue(null);

    await expect(
      pedidoService.cerrarMesa(99)
    ).rejects.toThrow("MESA_NO_ENCONTRADA");

  });
  //TEST 3️⃣ – Error: mesa sin pedidos abiertos
  test("cerrarMesa: lanza error si no hay pedidos pendientes", async () => {
    const mesaId = 5;

    mockPedidoRepository.buscarMesaPorId.mockResolvedValue({
      id: mesaId,
      estado: "ocupada",
      totalActual: 0
    });

    mockPedidoRepository.buscarPedidoAbiertosPorMesa.mockResolvedValue([]);

    await expect(
      pedidoService.cerrarMesa(mesaId)
    ).rejects.toThrow("NO_HAY_PEDIDOS_ABIERTOS");
  }); // 👈 ESTE ERA EL QUE FALTABA


  //TEST 4️⃣ – Mesa con total 0 (edge case válido)
  test("cerrarMesa: permite cerrar mesa con total 0", async () => {
    const mesaId = 6;

    mockPedidoRepository.buscarMesaPorId.mockResolvedValue({
      id: mesaId,
      estado: "ocupada",
      totalActual: 0
    });

    mockPedidoRepository.buscarPedidoAbiertosPorMesa.mockResolvedValue([
      { id: 1 }
    ]);

    const resultado = await pedidoService.cerrarMesa(mesaId);

    expect(resultado.totalCobrado).toBe(0);
  });
});