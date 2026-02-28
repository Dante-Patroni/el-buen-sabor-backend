const PedidoService = require("../../src/services/pedidoService");

describe("PedidoService", () => {
  let mockPedidoRepository;
  let mockPlatoService;
  let mockMesaService;
  let mockPedidoEmitter;
  let pedidoService;

  beforeEach(() => {
    mockPedidoRepository = {
      inTransaction: jest.fn(async (callback) => await callback({ id: "tx_999" })),
      crearPedido: jest.fn(),
      crearDetalles: jest.fn(),
      listarPedidosPorEstado: jest.fn(),
      buscarPedidosPorMesa: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      obtenerDetallesPedido: jest.fn(),
      eliminarDetallesPedido: jest.fn(),
      eliminarPedidoPorId: jest.fn(),
      actualizarTotalPedido: jest.fn(),
      actualizarEstadoPedido: jest.fn(),
    };

    mockPlatoService = {
      buscarPorId: jest.fn(),
      descontarStock: jest.fn(),
      restaurarStock: jest.fn(),
    };

    mockMesaService = {
      obtenerPorId: jest.fn(),
      sumarTotal: jest.fn(),
      restarTotal: jest.fn(),
      ajustarTotal: jest.fn(),
    };

    mockPedidoEmitter = {
      emit: jest.fn(),
    };

    pedidoService = new PedidoService(
      mockPedidoRepository,
      mockPlatoService,
      mockMesaService,
      mockPedidoEmitter
    );
  });

  test("crearYValidarPedido: crea pedido, detalles, suma mesa y emite evento", async () => {
    const pedidoData = {
      mesa: 4,
      productos: [{ platoId: 1, cantidad: 2 }],
      cliente: "Juan",
    };

    mockMesaService.obtenerPorId.mockResolvedValue({
      id: 4,
      estado: "ocupada",
      totalActual: 0,
    });

    jest.spyOn(pedidoService, "_procesarProductos").mockResolvedValue({
      total: 10000,
      detalles: [{ PlatoId: 1, cantidad: 2, subtotal: 10000, aclaracion: "" }],
      comandaItems: [{ platoId: 1, plato: "Milanesa", cantidad: 2, aclaracion: "" }],
    });

    const pedidoCreado = {
      id: 101,
      mesa: 4,
      total: 10000,
      toJSON: () => ({ id: 101, mesa: 4, total: 10000 }),
    };

    mockPedidoRepository.crearPedido.mockResolvedValue(pedidoCreado);
    mockPedidoRepository.crearDetalles.mockResolvedValue(true);
    mockMesaService.sumarTotal.mockResolvedValue(true);

    const resultado = await pedidoService.crearYValidarPedido(pedidoData);

    expect(mockMesaService.obtenerPorId).toHaveBeenCalledWith(4, expect.any(Object));
    expect(mockPedidoRepository.crearPedido).toHaveBeenCalledWith(
      expect.objectContaining({ mesa: 4, estado: "pendiente", total: 10000 }),
      expect.any(Object)
    );
    expect(mockPedidoRepository.crearDetalles).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ PedidoId: 101, PlatoId: 1 })]),
      expect.any(Object)
    );
    expect(mockMesaService.sumarTotal).toHaveBeenCalledWith(4, 10000, expect.any(Object));
    expect(mockPedidoEmitter.emit).toHaveBeenCalledWith(
      "pedido-creado",
      expect.objectContaining({
        pedido: expect.objectContaining({
          id: 101,
          items: expect.arrayContaining([
            expect.objectContaining({
              platoId: 1,
              cantidad: 2,
            }),
          ]),
        }),
      })
    );
    expect(resultado.id).toBe(101);
  });

  test("crearYValidarPedido: lanza MESA_NO_PROPORCIONADA", async () => {
    await expect(
      pedidoService.crearYValidarPedido({ productos: [{ platoId: 1, cantidad: 1 }] })
    ).rejects.toThrow("MESA_NO_PROPORCIONADA");
  });

  test("crearYValidarPedido: lanza PRODUCTOS_INVALIDOS", async () => {
    await expect(
      pedidoService.crearYValidarPedido({ mesa: 4, productos: [] })
    ).rejects.toThrow("PRODUCTOS_INVALIDOS");
  });

  test("crearYValidarPedido: lanza NO_SE_PUEDE_CREAR_PEDIDO_EN_MESA_LIBRE", async () => {
    mockMesaService.obtenerPorId.mockResolvedValue({ id: 4, estado: "libre" });

    await expect(
      pedidoService.crearYValidarPedido({ mesa: 4, productos: [{ platoId: 1, cantidad: 1 }] })
    ).rejects.toThrow("NO_SE_PUEDE_CREAR_PEDIDO_EN_MESA_LIBRE");
  });

  test("listarPedidos: delega al repository", async () => {
    mockPedidoRepository.listarPedidosPorEstado.mockResolvedValue([{ id: 1 }]);

    const resultado = await pedidoService.listarPedidos("pendiente");

    expect(mockPedidoRepository.listarPedidosPorEstado).toHaveBeenCalledWith("pendiente");
    expect(resultado).toEqual([{ id: 1 }]);
  });

  test("buscarPedidosPorMesa: lanza MESA_NO_PROPORCIONADA cuando no viene mesa", async () => {
    await expect(pedidoService.buscarPedidosPorMesa(undefined)).rejects.toThrow(
      "MESA_NO_PROPORCIONADA"
    );
  });

  test("buscarPedidosPorMesa: delega al repository", async () => {
    mockPedidoRepository.buscarPedidosPorMesa.mockResolvedValue([{ id: 5 }]);

    const resultado = await pedidoService.buscarPedidosPorMesa(4);

    expect(mockPedidoRepository.buscarPedidosPorMesa).toHaveBeenCalledWith(4);
    expect(resultado).toEqual([{ id: 5 }]);
  });

  test("eliminarPedido: elimina pendiente, resta total y restaura stock", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 10,
      estado: "pendiente",
      mesa: 4,
      total: 5000,
    });
    mockPedidoRepository.obtenerDetallesPedido.mockResolvedValue([
      { PlatoId: 1, cantidad: 2 },
    ]);

    jest.spyOn(pedidoService, "_restaurarStock").mockResolvedValue();
    jest.spyOn(pedidoService, "_eliminarPedidoFisico").mockResolvedValue();
    mockMesaService.restarTotal.mockResolvedValue(true);

    const resultado = await pedidoService.eliminarPedido(10);

    expect(mockPedidoRepository.buscarPedidoPorId).toHaveBeenCalledWith(10, expect.any(Object));
    expect(pedidoService._restaurarStock).toHaveBeenCalledWith(
      [{ PlatoId: 1, cantidad: 2 }],
      expect.any(Object)
    );
    expect(mockMesaService.restarTotal).toHaveBeenCalledWith(4, 5000, expect.any(Object));
    expect(pedidoService._eliminarPedidoFisico).toHaveBeenCalledWith(10, expect.any(Object));
    expect(resultado).toBe(true);
  });

  test("eliminarPedido: lanza PEDIDO_NO_ENCONTRADO", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue(null);

    await expect(pedidoService.eliminarPedido(99)).rejects.toThrow("PEDIDO_NO_ENCONTRADO");
  });

  test("eliminarPedido: lanza SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 10,
      estado: "entregado",
      mesa: 4,
      total: 100,
    });

    await expect(pedidoService.eliminarPedido(10)).rejects.toThrow(
      "SOLO_SE_PUEDEN_ELIMINAR_PEDIDOS_PENDIENTES"
    );
  });

  test("modificarPedido: caso feliz, ajusta total y emite evento", async () => {
    const pedidoActual = { id: 20, estado: "pendiente", total: 1000, mesa: 4 };
    const pedidoActualizado = { id: 20, estado: "pendiente", total: 1200, mesa: 4 };

    mockPedidoRepository.buscarPedidoPorId
      .mockResolvedValueOnce(pedidoActual)
      .mockResolvedValueOnce(pedidoActualizado);
    mockPedidoRepository.obtenerDetallesPedido.mockResolvedValue([{ PlatoId: 1, cantidad: 1 }]);
    mockPedidoRepository.eliminarDetallesPedido.mockResolvedValue(true);
    mockPedidoRepository.crearDetalles.mockResolvedValue(true);
    mockPedidoRepository.actualizarTotalPedido.mockResolvedValue(true);
    mockMesaService.ajustarTotal.mockResolvedValue(true);

    jest.spyOn(pedidoService, "_restaurarStock").mockResolvedValue();
    jest.spyOn(pedidoService, "_procesarProductos").mockResolvedValue({
      total: 1200,
      detalles: [{ PlatoId: 2, cantidad: 1, subtotal: 1200, aclaracion: "" }],
    });

    const resultado = await pedidoService.modificarPedido({
      id: 20,
      mesa: 4,
      productos: [{ platoId: 2, cantidad: 1 }],
    });

    expect(mockPedidoRepository.actualizarTotalPedido).toHaveBeenCalledWith(
      20,
      1200,
      expect.any(Object)
    );
    expect(mockMesaService.ajustarTotal).toHaveBeenCalledWith(4, 200, expect.any(Object));
    expect(mockPedidoEmitter.emit).toHaveBeenCalledWith(
      "pedido-modificado",
      expect.objectContaining({ mesa: 4, pedido: pedidoActualizado })
    );
    expect(resultado).toEqual(pedidoActualizado);
  });

  test("modificarPedido: lanza PEDIDO_ID_INVALIDO", async () => {
    await expect(
      pedidoService.modificarPedido({ productos: [{ platoId: 1, cantidad: 1 }], mesa: 4 })
    ).rejects.toThrow("PEDIDO_ID_INVALIDO");
  });

  test("modificarPedido: lanza PRODUCTOS_INVALIDOS", async () => {
    await expect(
      pedidoService.modificarPedido({ id: 1, productos: [], mesa: 4 })
    ).rejects.toThrow("PRODUCTOS_INVALIDOS");
  });

  test("modificarPedido: lanza SOLO_SE_PUEDEN_MODIFICAR_PEDIDOS_PENDIENTES", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 1,
      estado: "entregado",
      total: 100,
      mesa: 4,
    });

    await expect(
      pedidoService.modificarPedido({
        id: 1,
        mesa: 4,
        productos: [{ platoId: 1, cantidad: 1 }],
      })
    ).rejects.toThrow("SOLO_SE_PUEDEN_MODIFICAR_PEDIDOS_PENDIENTES");
  });

  test("actualizarEstadoPedido: caso feliz y emite evento", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 3,
      estado: "pendiente",
    });
    mockPedidoRepository.actualizarEstadoPedido.mockResolvedValue(true);

    const resultado = await pedidoService.actualizarEstadoPedido(3, "en_preparacion");

    expect(mockPedidoRepository.actualizarEstadoPedido).toHaveBeenCalledWith(
      3,
      "en_preparacion",
      expect.any(Object)
    );
    expect(mockPedidoEmitter.emit).toHaveBeenCalledWith(
      "pedido-estado-actualizado",
      { pedidoId: 3, estado: "en_preparacion" }
    );
    expect(resultado).toBe(true);
  });

  test("actualizarEstadoPedido: lanza TRANSICION_ESTADO_INVALIDA", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 3,
      estado: "pendiente",
    });

    await expect(pedidoService.actualizarEstadoPedido(3, "entregado")).rejects.toThrow(
      "TRANSICION_ESTADO_INVALIDA"
    );
  });

  test("actualizarEstadoPedido: lanza NO_SE_PUEDE_MODIFICAR_PEDIDO_PAGADO", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 3,
      estado: "pagado",
    });

    await expect(pedidoService.actualizarEstadoPedido(3, "en_preparacion")).rejects.toThrow(
      "NO_SE_PUEDE_MODIFICAR_PEDIDO_PAGADO"
    );
  });

  test("actualizarEstadoPedido: lanza ESTADO_PAGADO_SOLO_DESDE_CIERRE_DE_MESA", async () => {
    mockPedidoRepository.buscarPedidoPorId.mockResolvedValue({
      id: 3,
      estado: "entregado",
    });

    await expect(pedidoService.actualizarEstadoPedido(3, "pagado")).rejects.toThrow(
      "ESTADO_PAGADO_SOLO_DESDE_CIERRE_DE_MESA"
    );
  });

  test("_procesarProductos: calcula total y arma detalles", async () => {
    mockPlatoService.buscarPorId.mockResolvedValue({
      id: 1,
      precio: 500,
      stockActual: 10,
    });
    mockPlatoService.descontarStock.mockResolvedValue(true);

    const { total, detalles } = await pedidoService._procesarProductos(
      [{ platoId: 1, cantidad: 2, aclaracion: "sin sal" }],
      { id: "tx_1" }
    );

    expect(total).toBe(1000);
    expect(detalles).toEqual([
      { PlatoId: 1, cantidad: 2, subtotal: 1000, aclaracion: "sin sal" },
    ]);
    expect(mockPlatoService.descontarStock).toHaveBeenCalledWith(1, 2, { id: "tx_1" });
  });

  test("_procesarProductos: lanza PLATO_ID_INVALIDO", async () => {
    await expect(
      pedidoService._procesarProductos([{ platoId: 0, cantidad: 1 }], null)
    ).rejects.toThrow("PLATO_ID_INVALIDO");
  });

  test("_procesarProductos: lanza CANTIDAD_INVALIDA", async () => {
    await expect(
      pedidoService._procesarProductos([{ platoId: 1, cantidad: 0 }], null)
    ).rejects.toThrow("CANTIDAD_INVALIDA");
  });

  test("_procesarProductos: lanza PLATO_NO_ENCONTRADO", async () => {
    mockPlatoService.buscarPorId.mockResolvedValue(null);

    await expect(
      pedidoService._procesarProductos([{ platoId: 1, cantidad: 1 }], null)
    ).rejects.toThrow("PLATO_NO_ENCONTRADO");
  });

  test("_procesarProductos: lanza STOCK_INSUFICIENTE", async () => {
    mockPlatoService.buscarPorId.mockResolvedValue({
      id: 1,
      precio: 500,
      stockActual: 1,
    });

    await expect(
      pedidoService._procesarProductos([{ platoId: 1, cantidad: 2 }], null)
    ).rejects.toThrow("STOCK_INSUFICIENTE");
  });

  test("_restaurarStock: restaura todos los platos", async () => {
    mockPlatoService.restaurarStock.mockResolvedValue(true);

    await pedidoService._restaurarStock(
      [
        { PlatoId: 1, cantidad: 2 },
        { PlatoId: 2, cantidad: 1 },
      ],
      { id: "tx_2" }
    );

    expect(mockPlatoService.restaurarStock).toHaveBeenCalledWith(1, 2, { id: "tx_2" });
    expect(mockPlatoService.restaurarStock).toHaveBeenCalledWith(2, 1, { id: "tx_2" });
  });

  test("_restaurarStock: lanza PLATO_ID_INVALIDO si detalle roto", async () => {
    await expect(
      pedidoService._restaurarStock([{ PlatoId: null, cantidad: 2 }], null)
    ).rejects.toThrow("PLATO_ID_INVALIDO");
  });
});

