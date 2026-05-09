const CocinaController = require("../../src/controllers/cocinaController");

describe("CocinaController", () => {
  let pedidoServiceMock;
  let cocinaController;
  let req;
  let res;

  beforeEach(() => {
    pedidoServiceMock = {
      obtenerPedidosParaCocina: jest.fn(),
    };

    cocinaController = new CocinaController(pedidoServiceMock);

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

  test("listarPendientes: responde 200 con pedidos formateados para cocina", async () => {
    const pedidosCocina = [
      {
        id: 12,
        mesa: 4,
        cliente: "Juan Pérez",
        estado: "pendiente",
        hora: "14:30:25",
        items: [
          {
            nombre: "Hamburguesa completa",
            cantidad: 2,
            aclaracion: "Sin cebolla"
          },
          {
            nombre: "Papas fritas",
            cantidad: 1,
            aclaracion: ""
          }
        ]
      },
      {
        id: 13,
        mesa: 5,
        cliente: "María López",
        estado: "pendiente",
        hora: "14:35:12",
        items: [
          {
            nombre: "Milanesa napolitana",
            cantidad: 1,
            aclaracion: "Bien cocida"
          }
        ]
      }
    ];

    pedidoServiceMock.obtenerPedidosParaCocina.mockResolvedValue(pedidosCocina);

    await cocinaController.listarPendientes(req, res);

    expect(pedidoServiceMock.obtenerPedidosParaCocina).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      cantidad: 2,
      data: pedidosCocina,
    });
  });

  test("listarPendientes: responde 200 con array vacío cuando no hay pedidos", async () => {
    pedidoServiceMock.obtenerPedidosParaCocina.mockResolvedValue([]);

    await cocinaController.listarPendientes(req, res);

    expect(pedidoServiceMock.obtenerPedidosParaCocina).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      cantidad: 0,
      data: [],
    });
  });

  test("listarPendientes: responde 500 para error no controlado", async () => {
    pedidoServiceMock.obtenerPedidosParaCocina.mockRejectedValue(
      new Error("ERROR_INTERNO_SERVICIO")
    );

    await cocinaController.listarPendientes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });

  test("listarPendientes: formatea correctamente pedidos con múltiples items", async () => {
    const pedidoComplejo = [
      {
        id: 15,
        mesa: 7,
        cliente: "Pedro García",
        estado: "pendiente",
        hora: "15:20:45",
        items: [
          { nombre: "Ensalada césar", cantidad: 1, aclaracion: "Sin anchoas" },
          { nombre: "Bife de chorizo", cantidad: 2, aclaracion: "A punto" },
          { nombre: "Agua mineral", cantidad: 3, aclaracion: "" },
          { nombre: "Postre del día", cantidad: 2, aclaracion: "Sin azúcar" }
        ]
      }
    ];

    pedidoServiceMock.obtenerPedidosParaCocina.mockResolvedValue(pedidoComplejo);

    await cocinaController.listarPendientes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    
    const response = res.json.mock.calls[0][0];
    expect(response.cantidad).toBe(1);
    expect(response.data[0].items).toHaveLength(4);
    expect(response.data[0].items[1]).toEqual({
      nombre: "Bife de chorizo",
      cantidad: 2,
      aclaracion: "A punto"
    });
  });
});