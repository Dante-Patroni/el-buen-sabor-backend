const RubroController = require("../../src/controllers/rubroController");

describe("RubroController", () => {
  let rubroServiceMock;
  let rubroController;
  let req;
  let res;

  beforeEach(() => {
    rubroServiceMock = {
      obtenerJerarquiaCompleta: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };

    rubroController = new RubroController(rubroServiceMock);

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

  test("listarJerarquia: responde 200", async () => {
    const rubros = [
      { id: 1, denominacion: "Bebidas", subrubros: [{ id: 2, denominacion: "Gaseosas" }] },
    ];
    rubroServiceMock.obtenerJerarquiaCompleta.mockResolvedValue(rubros);

    await rubroController.listarJerarquia(req, res);

    expect(rubroServiceMock.obtenerJerarquiaCompleta).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rubros);
  });

  test("listarJerarquia: responde 500 para error no controlado", async () => {
    rubroServiceMock.obtenerJerarquiaCompleta.mockRejectedValue(new Error("ERROR_RARO"));

    await rubroController.listarJerarquia(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });

  test("crear: responde 201", async () => {
    req.body = { denominacion: "Postres", padreId: null };
    rubroServiceMock.crear.mockResolvedValue({ id: 9, denominacion: "Postres" });

    await rubroController.crear(req, res);

    expect(rubroServiceMock.crear).toHaveBeenCalledWith({
      denominacion: "Postres",
      padreId: null,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 9, denominacion: "Postres" });
  });

  test("crear: mapea RUBRO_YA_EXISTE a 409", async () => {
    req.body = { denominacion: "Bebidas" };
    rubroServiceMock.crear.mockRejectedValue(new Error("RUBRO_YA_EXISTE"));

    await rubroController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "RUBRO_YA_EXISTE" });
  });

  test("crear: mapea DENOMINACION_REQUERIDA a 400", async () => {
    req.body = {};
    rubroServiceMock.crear.mockRejectedValue(new Error("DENOMINACION_REQUERIDA"));

    await rubroController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "DENOMINACION_REQUERIDA" });
  });

  test("actualizar: responde 200", async () => {
    req.params = { id: "7" };
    req.body = { denominacion: "Bebidas Frias", padreId: 1 };
    rubroServiceMock.actualizar.mockResolvedValue(undefined);

    await rubroController.actualizar(req, res);

    expect(rubroServiceMock.actualizar).toHaveBeenCalledWith(7, {
      denominacion: "Bebidas Frias",
      padreId: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Rubro actualizado correctamente",
    });
  });

  test("actualizar: mapea RUBRO_NO_EXISTE a 404", async () => {
    req.params = { id: "99" };
    req.body = { denominacion: "X" };
    rubroServiceMock.actualizar.mockRejectedValue(new Error("RUBRO_NO_EXISTE"));

    await rubroController.actualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "RUBRO_NO_EXISTE" });
  });

  test("eliminar: responde 204", async () => {
    req.params = { id: "5" };
    rubroServiceMock.eliminar.mockResolvedValue(undefined);

    await rubroController.eliminar(req, res);

    expect(rubroServiceMock.eliminar).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("eliminar: mapea RUBRO_TIENE_SUBRUBROS a 400", async () => {
    req.params = { id: "5" };
    rubroServiceMock.eliminar.mockRejectedValue(new Error("RUBRO_TIENE_SUBRUBROS"));

    await rubroController.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "RUBRO_TIENE_SUBRUBROS" });
  });

  test("eliminar: responde 500 para error no controlado", async () => {
    req.params = { id: "5" };
    rubroServiceMock.eliminar.mockRejectedValue(new Error("ERROR_RARO"));

    await rubroController.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});

