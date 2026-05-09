const PedidoService = require("../../src/services/pedidoService");

describe("PedidoService", () => {
  let pedidoRepositoryMock;
  let platoServiceMock;
  let mesaServiceMock;
  let pedidoEmitterMock;
  let pedidoService;

  beforeEach(() => {
    const transactionFake = { id: "tx_123" };

    pedidoRepositoryMock = {
      inTransaction: jest.fn(async (callback) => await callback(transactionFake)),
      crearPedido: jest.fn(),
      crearDetalles: jest.fn(),
      listarPedidosPorEstado: jest.fn(),
      buscarPedidosPorMesa: jest.fn(),
      buscarPedidoPorId: jest.fn(),
      obtenerDetallesPedido: jest.fn(),
      eliminarDetallesPedido: jest.fn(),
      eliminarPedidoPorId: jest.fn(),
      actualizarEstadoPedido: jest.fn(),
      calcularTotalMesa: jest.fn(),
    };

    platoServiceMock = {
      buscarPorId: jest.fn(),
      descontarStock: jest.fn(),
      restaurarStock: jest.fn(),
    };

    mesaServiceMock = {
      obtenerPorId: jest.fn(),
    };

    pedidoEmitterMock = {
      emit: jest.fn(),
    };

    pedidoService = new PedidoService(
      pedidoRepositoryMock,
      platoServiceMock,
      mesaServiceMock,
      pedidoEmitterMock
    );
  });

  // --------------------------------------------------
// TEST: CREAR Y VALIDAR PEDIDO
// --------------------------------------------------
describe("crearYValidarPedido", () => {
  test("crea pedido exitosamente sin persistir total", async () => {
    const datosPedido = {
      mesa: 5,
      productos: [
        { platoId: 1, cantidad: 2, aclaracion: "Sin cebolla" },
        { platoId: 2, cantidad: 1 },
      ],
      cliente: "Juan Pérez",
    };

    const mesaMock = { id: 5, estado: "ocupada" };

    const plato1Mock = {
      id: 1,
      nombre: "Pizza",
      precio: 1000,
      esActivo: true,
    };

    const plato2Mock = {
      id: 2,
      nombre: "Coca",
      precio: 500,
      esActivo: true,
    };

    const pedidoCreadoMock = {
      id: 123,
      mesaId: 5,
      cliente: "Juan Pérez",
      estado: "pendiente",
      toJSON: () => ({
        id: 123,
        mesaId: 5,
        cliente: "Juan Pérez",
        estado: "pendiente",
      }),
    };

    mesaServiceMock.obtenerPorId.mockResolvedValue(mesaMock);

    platoServiceMock.buscarPorId
      .mockResolvedValueOnce(plato1Mock)
      .mockResolvedValueOnce(plato2Mock);

    platoServiceMock.descontarStock.mockResolvedValue(1);

    pedidoRepositoryMock.crearPedido.mockResolvedValue(pedidoCreadoMock);

    pedidoRepositoryMock.crearDetalles.mockResolvedValue(true);

    const resultado =
      await pedidoService.crearYValidarPedido(datosPedido);

    expect(pedidoRepositoryMock.crearPedido).toHaveBeenCalledWith(
      {
        mesaId: 5,
        cliente: "Juan Pérez",
        estado: "pendiente",
      },
      expect.anything()
    );

    expect(pedidoRepositoryMock.crearDetalles).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          pedidoId: 123,
          platoId: 1,
          cantidad: 2,
          precioUnitario: 1000,
          subtotal: 2000,
          aclaracion: "Sin cebolla",
        }),
        expect.objectContaining({
          pedidoId: 123,
          platoId: 2,
          cantidad: 1,
          precioUnitario: 500,
          subtotal: 500,
          aclaracion: "",
        }),
      ]),
      expect.anything()
    );

    expect(pedidoEmitterMock.emit).toHaveBeenCalledWith(
      "pedido-creado",
      expect.objectContaining({
        pedido: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              platoId: 1,
              cantidad: 2,
            }),
            expect.objectContaining({
              platoId: 2,
              cantidad: 1,
            }),
          ]),
        }),
      })
    );

    expect(resultado).toEqual(pedidoCreadoMock);
  });
});

  // --------------------------------------------------
// TEST: ELIMINAR PEDIDO
// --------------------------------------------------
describe("eliminarPedido", () => {
  test("elimina pedido pendiente y restaura stock", async () => {
    const pedidoId = 123;

    const pedidoMock = {
      id: 123,
      estado: "pendiente",
    };

    const detallesMock = [
      { platoId: 1, cantidad: 2 },
      { platoId: 2, cantidad: 1 },
    ];

    pedidoRepositoryMock.buscarPedidoPorId.mockResolvedValue(
      pedidoMock
    );

    pedidoRepositoryMock.obtenerDetallesPedido.mockResolvedValue(
      detallesMock
    );

    platoServiceMock.restaurarStock.mockResolvedValue(true);

    pedidoRepositoryMock.eliminarDetallesPedido.mockResolvedValue(
      true
    );

    pedidoRepositoryMock.eliminarPedidoPorId.mockResolvedValue(
      true
    );

    const resultado =
      await pedidoService.eliminarPedido(pedidoId);

    expect(platoServiceMock.restaurarStock)
      .toHaveBeenCalledTimes(2);

    expect(platoServiceMock.restaurarStock)
      .toHaveBeenCalledWith(
        1,
        2,
        expect.anything()
      );

    expect(platoServiceMock.restaurarStock)
      .toHaveBeenCalledWith(
        2,
        1,
        expect.anything()
      );

    expect(
      pedidoRepositoryMock.eliminarDetallesPedido
    ).toHaveBeenCalledWith(
      pedidoId,
      expect.anything()
    );

    expect(
      pedidoRepositoryMock.eliminarPedidoPorId
    ).toHaveBeenCalledWith(
      pedidoId,
      expect.anything()
    );

    expect(
      mesaServiceMock.actualizarTotalMesa
    ).toBeUndefined();

    expect(resultado).toBe(true);
  });
});

 // --------------------------------------------------
// TEST: MODIFICAR PEDIDO
// --------------------------------------------------
describe("modificarPedido", () => {
  test("modifica pedido pendiente actualizando stock y detalles", async () => {
    const datosModificacion = {
      id: 123,
      productos: [
        { platoId: 1, cantidad: 3 },
        { platoId: 3, cantidad: 2 },
      ],
    };

    const pedidoMock = {
      id: 123,
      estado: "pendiente",
      mesa: 5,
    };

    const detallesActualesMock = [
      { platoId: 1, cantidad: 2 },
      { platoId: 2, cantidad: 1 },
    ];

    const plato1Mock = {
      id: 1,
      nombre: "Pizza",
      precio: 1000,
      esActivo: true,
    };

    const plato3Mock = {
      id: 3,
      nombre: "Empanadas",
      precio: 800,
      esActivo: true,
    };

    pedidoRepositoryMock.buscarPedidoPorId
      .mockResolvedValueOnce(pedidoMock);

    pedidoRepositoryMock.obtenerDetallesPedido
      .mockResolvedValue(detallesActualesMock);

    platoServiceMock.restaurarStock
      .mockResolvedValue(true);

    pedidoRepositoryMock.eliminarDetallesPedido
      .mockResolvedValue(true);

    platoServiceMock.buscarPorId
      .mockResolvedValueOnce(plato1Mock)
      .mockResolvedValueOnce(plato3Mock);

    platoServiceMock.descontarStock
      .mockResolvedValue(1);

    pedidoRepositoryMock.crearDetalles
      .mockResolvedValue(true);

    pedidoRepositoryMock.buscarPedidoPorId
      .mockResolvedValueOnce(pedidoMock);

    const resultado =
      await pedidoService.modificarPedido(
        datosModificacion
      );

    expect(platoServiceMock.restaurarStock)
      .toHaveBeenCalledWith(
        1,
        2,
        expect.anything()
      );

    expect(platoServiceMock.restaurarStock)
      .toHaveBeenCalledWith(
        2,
        1,
        expect.anything()
      );

    expect(pedidoRepositoryMock.crearDetalles)
      .toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            pedidoId: 123,
            platoId: 1,
            cantidad: 3,
            precioUnitario: 1000,
            subtotal: 3000,
          }),
          expect.objectContaining({
            pedidoId: 123,
            platoId: 3,
            cantidad: 2,
            precioUnitario: 800,
            subtotal: 1600,
          }),
        ]),
        expect.anything()
      );

    expect(pedidoEmitterMock.emit)
      .toHaveBeenCalledWith(
        "pedido-modificado",
        expect.objectContaining({
          mesa: 5,
          pedido: expect.any(Object),
        })
      );

    expect(resultado).toEqual(pedidoMock);
  });
});

  // --------------------------------------------------
  // TEST: OBTENER TOTAL POR MESA
  // --------------------------------------------------
  describe("obtenerTotalPorMesa", () => {
    test("calcula total dinámicamente sumando subtotales de detalles", async () => {
      const mesaId = 5;

      const totalCalculado = 12500.5;

      pedidoRepositoryMock.calcularTotalMesa
        .mockResolvedValue(totalCalculado);

      const resultado =
        await pedidoService.obtenerTotalPorMesa(mesaId);

      expect(
        pedidoRepositoryMock.calcularTotalMesa
      ).toHaveBeenCalledWith(
        mesaId,
        null
      );

      expect(resultado).toBe(totalCalculado);
    });

    test("retorna 0 si la mesa no tiene pedidos", async () => {
      const mesaId = 99;

      pedidoRepositoryMock.calcularTotalMesa
        .mockResolvedValue(0);

      const resultado =
        await pedidoService.obtenerTotalPorMesa(mesaId);

      expect(resultado).toBe(0);
    });

    test("acepta transacción opcional", async () => {
      const mesaId = 5;

      const transactionMock = {
        id: "custom_tx",
      };

      pedidoRepositoryMock.calcularTotalMesa
        .mockResolvedValue(5000);

      const resultado =
        await pedidoService.obtenerTotalPorMesa(
          mesaId,
          transactionMock
        );

      expect(
        pedidoRepositoryMock.calcularTotalMesa
      ).toHaveBeenCalledWith(
        mesaId,
        transactionMock
      );

      expect(resultado).toBe(5000);
    });
  });

  // --------------------------------------------------
// TEST: PEDIDOS PARA COCINA
// --------------------------------------------------
describe("obtenerPedidosParaCocina", () => {
  test("formatea pedidos pendientes correctamente", async () => {
    const pedidosMock = [
  {
    id: 1,
    mesaId: 5,
    cliente: "Juan",
    estado: "pendiente",
    createdAt: new Date(),
    detalles: [
      {
        plato: {
          nombre: "Pizza",
        },
        cantidad: 2,
        aclaracion: "Sin cebolla",
      },
      {
        plato: {
          nombre: "Coca",
        },
        cantidad: 1,
        aclaracion: "",
      },
    ],
  },
];
    pedidoRepositoryMock.listarPedidosPorEstado
      .mockResolvedValue(pedidosMock);

    const resultado =
      await pedidoService.obtenerPedidosParaCocina();

    expect(resultado).toHaveLength(1);

    expect(resultado[0]).toMatchObject({
      id: 1,
      mesaId: 5,
      cliente: "Juan",
      estado: "pendiente",
      items: [
        {
          nombre: "Pizza",
          cantidad: 2,
          aclaracion: "Sin cebolla",
        },
        {
          nombre: "Coca",
          cantidad: 1,
          aclaracion: "",
        },
      ],
    });
  });
});

  // --------------------------------------------------
  // TEST: ACTUALIZAR ESTADO
  // --------------------------------------------------
  describe("actualizarEstadoPedido", () => {
    test("actualiza estado de pendiente a en_preparacion", async () => {
      const pedidoId = 123;

      const pedidoMock = {
        id: 123,
        estado: "pendiente",
      };

      pedidoRepositoryMock.buscarPedidoPorId
        .mockResolvedValue(pedidoMock);

      pedidoRepositoryMock.actualizarEstadoPedido
        .mockResolvedValue(true);

      const resultado =
        await pedidoService.actualizarEstadoPedido(
          pedidoId,
          "en_preparacion"
        );

      expect(
        pedidoRepositoryMock.actualizarEstadoPedido
      ).toHaveBeenCalledWith(
        pedidoId,
        "en_preparacion",
        expect.anything()
      );

      expect(pedidoEmitterMock.emit)
        .toHaveBeenCalledWith(
          "pedido-estado-actualizado",
          {
            pedidoId,
            estado: "en_preparacion",
          }
        );

      expect(resultado).toBe(true);
    });

    test("impide actualizar a pagado directamente", async () => {
      const pedidoId = 123;

      const pedidoMock = {
        id: 123,
        estado: "pendiente",
      };

      pedidoRepositoryMock.buscarPedidoPorId
        .mockResolvedValue(pedidoMock);

      await expect(
        pedidoService.actualizarEstadoPedido(
          pedidoId,
          "pagado"
        )
      ).rejects.toThrow(
        "ESTADO_PAGADO_SOLO_DESDE_CIERRE_DE_MESA"
      );
    });
  });
});