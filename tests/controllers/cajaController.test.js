const CajaController = require("../../src/controllers/cajaController");

describe("CajaController", () => {
  let cajaServiceMock;
  let cajaController;
  let req;
  let res;

  beforeEach(() => {
    cajaServiceMock = {
      listarMesasAbiertas: jest.fn(),
      obtenerMesaPorId: jest.fn(),
      obtenerTicketCierre: jest.fn(),
      cobrarMesa: jest.fn(),
    };

    cajaController = new CajaController(cajaServiceMock);

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("listarMesas: responde 200 con lista de mesas", async () => {
    cajaServiceMock.listarMesasAbiertas.mockResolvedValue([{ id: 1, nombre: "Mesa 1" }]);

    await cajaController.listarMesas(req, res);

    expect(cajaServiceMock.listarMesasAbiertas).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: "Mesa 1" }]);
  });

  test("obtenerMesa: responde 200 con datos de mesa", async () => {
    req.params.id = "4";
    cajaServiceMock.obtenerMesaPorId.mockResolvedValue({ id: 4, totalActual: 1200 });

    await cajaController.obtenerMesa(req, res);

    expect(cajaServiceMock.obtenerMesaPorId).toHaveBeenCalledWith("4");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 4, totalActual: 1200 });
  });

  test("obtenerTicket: responde 200 con ticket de cierre", async () => {
    req.params.id = "5";
    const ticket = { mesaId: 5, totalFinal: 2300 };
    cajaServiceMock.obtenerTicketCierre.mockResolvedValue(ticket);

    await cajaController.obtenerTicket(req, res);

    expect(cajaServiceMock.obtenerTicketCierre).toHaveBeenCalledWith("5");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(ticket);
  });

  test("cobrarMesa: responde 200 con mensaje y resultado de cierre", async () => {
    req.params.id = "8";
    cajaServiceMock.cobrarMesa.mockResolvedValue({ mesaId: 8, totalCobrado: 8500 });

    await cajaController.cobrarMesa(req, res);

    expect(cajaServiceMock.cobrarMesa).toHaveBeenCalledWith("8");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Mesa cobrada y cerrada correctamente",
      mesaId: 8,
      totalCobrado: 8500,
    });
  });

  test("listarMesas: responde 500 cuando hay error no controlado", async () => {
    cajaServiceMock.listarMesasAbiertas.mockRejectedValue(new Error("FALLA_RARA"));

    await cajaController.listarMesas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});
