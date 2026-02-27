const MesaController = require("../../src/controllers/mesaController");

describe("MesaController", () => {
  let mesaServiceMock;
  let mesaController;
  let req;
  let res;

  beforeEach(() => {
    mesaServiceMock = {
      listar: jest.fn(),
      abrirMesa: jest.fn(),
      cerrarMesa: jest.fn(),
    };

    mesaController = new MesaController(mesaServiceMock);

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

  test("listar: responde 200 y formatea campos de salida", async () => {
    mesaServiceMock.listar.mockResolvedValue([
      {
        id: 4,
        nombre: null,
        numero: null,
        estado: "ocupada",
        mozo: { id: 7, nombre: "Ana" },
        totalActual: "1500.50",
      },
      {
        id: 5,
        nombre: "Patio",
        numero: "P5",
        estado: "libre",
        mozo: null,
        totalActual: null,
      },
    ]);

    await mesaController.listar(req, res);

    expect(mesaServiceMock.listar).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 4,
        nombre: "Mesa 4",
        numero: "4",
        estado: "ocupada",
        mozo: { id: 7, nombre: "Ana" },
        itemsPendientes: 1,
        totalActual: 1500.5,
      },
      {
        id: 5,
        nombre: "Patio",
        numero: "P5",
        estado: "libre",
        mozo: null,
        itemsPendientes: 0,
        totalActual: 0,
      },
    ]);
  });

  test("abrirMesa: responde 200 en caso feliz", async () => {
    req.params = { id: "4" };
    req.body = { idMozo: 7 };
    mesaServiceMock.abrirMesa.mockResolvedValue({ mensaje: "Mesa abierta correctamente" });

    await mesaController.abrirMesa(req, res);

    expect(mesaServiceMock.abrirMesa).toHaveBeenCalledWith("4", 7);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Mesa abierta correctamente" });
  });

  test("abrirMesa: responde 400 si falta idMozo", async () => {
    req.params = { id: "4" };
    req.body = {};

    await mesaController.abrirMesa(req, res);

    expect(mesaServiceMock.abrirMesa).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "MOZO_REQUERIDO" });
  });

  test("abrirMesa: mapea error de dominio MESA_YA_OCUPADA", async () => {
    req.params = { id: "4" };
    req.body = { idMozo: 7 };
    mesaServiceMock.abrirMesa.mockRejectedValue(new Error("MESA_YA_OCUPADA"));

    await mesaController.abrirMesa(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "MESA_YA_OCUPADA" });
  });

  test("cerrarMesa: responde 200 con mensaje y totales", async () => {
    req.params = { id: "4" };
    mesaServiceMock.cerrarMesa.mockResolvedValue({ mesaId: 4, totalCobrado: 5000 });

    await mesaController.cerrarMesa(req, res);

    expect(mesaServiceMock.cerrarMesa).toHaveBeenCalledWith("4");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Mesa cerrada y cobrada exitosamente",
      mesaId: 4,
      totalCobrado: 5000,
    });
  });

  test("cerrarMesa: mapea error de dominio MESA_NO_ENCONTRADA", async () => {
    req.params = { id: "99" };
    mesaServiceMock.cerrarMesa.mockRejectedValue(new Error("MESA_NO_ENCONTRADA"));

    await mesaController.cerrarMesa(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "MESA_NO_ENCONTRADA" });
  });

  test("cerrarMesa: responde 500 para error no controlado", async () => {
    req.params = { id: "4" };
    mesaServiceMock.cerrarMesa.mockRejectedValue(new Error("ERROR_RARO"));

    await mesaController.cerrarMesa(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});

