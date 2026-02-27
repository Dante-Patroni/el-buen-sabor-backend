const PedidoController = require("../../src/controllers/pedidoController");

describe("PedidoController", () => {
  let pedidoServiceMock;
  let pedidoController;
  let req;
  let res;

  beforeEach(() => {
    pedidoServiceMock = {
      crearYValidarPedido: jest.fn(),
      modificarPedido: jest.fn(),
      listarPedidos: jest.fn(),
      buscarPedidosPorMesa: jest.fn(),
      eliminarPedido: jest.fn(),
    };

    pedidoController = new PedidoController(pedidoServiceMock);

    req = {
      body: {},
      params: {},
      query: {},
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("crear: responde 201 con mensaje y data", async () => {
    req.body = { mesa: 4, productos: [{ platoId: 1, cantidad: 1 }] };
    pedidoServiceMock.crearYValidarPedido.mockResolvedValue({ id: 101, total: 1500 });

    await pedidoController.crear(req, res);

    expect(pedidoServiceMock.crearYValidarPedido).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Pedido creado con éxito",
      data: { id: 101, total: 1500 },
    });
  });

  test("crear: mapea PRODUCTOS_INVALIDOS a 400", async () => {
    req.body = { mesa: 4, productos: [] };
    pedidoServiceMock.crearYValidarPedido.mockRejectedValue(new Error("PRODUCTOS_INVALIDOS"));

    await pedidoController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "PRODUCTOS_INVALIDOS" });
  });

  test("crear: responde 500 para error no controlado", async () => {
    req.body = { mesa: 4, productos: [] };
    pedidoServiceMock.crearYValidarPedido.mockRejectedValue(new Error("ERROR_RARO"));

    await pedidoController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });

  test("modificar: responde 200 con mensaje y data", async () => {
    req.body = { id: 15, mesa: 4, productos: [{ platoId: 2, cantidad: 1 }] };
    pedidoServiceMock.modificarPedido.mockResolvedValue({ id: 15, total: 3000 });

    await pedidoController.modificar(req, res);

    expect(pedidoServiceMock.modificarPedido).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Pedido modificado con éxito",
      data: { id: 15, total: 3000 },
    });
  });

  test("modificar: mapea PEDIDO_NO_ENCONTRADO a 404", async () => {
    req.body = { id: 999, mesa: 4, productos: [{ platoId: 2, cantidad: 1 }] };
    pedidoServiceMock.modificarPedido.mockRejectedValue(new Error("PEDIDO_NO_ENCONTRADO"));

    await pedidoController.modificar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "PEDIDO_NO_ENCONTRADO" });
  });

  test("listar: responde 200 con cantidad y data", async () => {
    const pedidos = [{ id: 1 }, { id: 2 }];
    pedidoServiceMock.listarPedidos.mockResolvedValue(pedidos);

    await pedidoController.listar(req, res);

    expect(pedidoServiceMock.listarPedidos).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      cantidad: 2,
      data: pedidos,
    });
  });

  test("buscarPorMesa: responde 200 con pedidos", async () => {
    req.params = { mesa: "4" };
    pedidoServiceMock.buscarPedidosPorMesa.mockResolvedValue([{ id: 11 }]);

    await pedidoController.buscarPorMesa(req, res);

    expect(pedidoServiceMock.buscarPedidosPorMesa).toHaveBeenCalledWith("4");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 11 }]);
  });

  test("buscarPorMesa: mapea MESA_NO_PROPORCIONADA a 400", async () => {
    req.params = {};
    pedidoServiceMock.buscarPedidosPorMesa.mockRejectedValue(new Error("MESA_NO_PROPORCIONADA"));

    await pedidoController.buscarPorMesa(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "MESA_NO_PROPORCIONADA" });
  });

  test("eliminar: responde 200 con mensaje", async () => {
    req.params = { id: "20" };
    pedidoServiceMock.eliminarPedido.mockResolvedValue(true);

    await pedidoController.eliminar(req, res);

    expect(pedidoServiceMock.eliminarPedido).toHaveBeenCalledWith("20");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Pedido eliminado y stock restaurado correctamente",
    });
  });

  test("eliminar: mapea PEDIDO_NO_ENCONTRADO a 404", async () => {
    req.params = { id: "999" };
    pedidoServiceMock.eliminarPedido.mockRejectedValue(new Error("PEDIDO_NO_ENCONTRADO"));

    await pedidoController.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "PEDIDO_NO_ENCONTRADO" });
  });

  test("eliminar: responde 500 para error no controlado", async () => {
    req.params = { id: "20" };
    pedidoServiceMock.eliminarPedido.mockRejectedValue(new Error("ERROR_RARO"));

    await pedidoController.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});

