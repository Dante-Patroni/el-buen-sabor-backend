const UsuarioController = require("../../src/controllers/usuarioController");

describe("UsuarioController", () => {
  let usuarioServiceMock;
  let usuarioController;
  let req;
  let res;

  beforeEach(() => {
    usuarioServiceMock = {
      login: jest.fn(),
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
    };

    usuarioController = new UsuarioController(usuarioServiceMock);

    req = {
      body: {},
      params: {},
      query: {},
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

  test("login: debe responder 200 en login exitoso", async () => {
    req.body = { legajo: "1001", password: "1234" };
    usuarioServiceMock.login.mockResolvedValue({
      status: 200,
      body: { mensaje: "Login exitoso" },
    });

    await usuarioController.login(req, res);

    expect(usuarioServiceMock.login).toHaveBeenCalledWith("1001", "1234");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ mensaje: "Login exitoso" });
  });

  test("listar: debe responder 200", async () => {
    usuarioServiceMock.listar.mockResolvedValue([{ id: 1 }]);

    await usuarioController.listar(req, res);

    expect(usuarioServiceMock.listar).toHaveBeenCalledWith(false);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("obtenerPorId: debe responder 200", async () => {
    req.params = { id: "7" };
    usuarioServiceMock.obtenerPorId.mockResolvedValue({ id: 7 });

    await usuarioController.obtenerPorId(req, res);

    expect(usuarioServiceMock.obtenerPorId).toHaveBeenCalledWith("7");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 7 });
  });

  test("crear: debe responder 201", async () => {
    req.body = {
      nombre: "Juan",
      apellido: "Perez",
      legajo: "2001",
      password: "1234",
      rol: "mozo",
    };
    usuarioServiceMock.crear.mockResolvedValue({ id: 5 });

    await usuarioController.crear(req, res);

    expect(usuarioServiceMock.crear).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 5 });
  });

  test("actualizar: debe responder 200", async () => {
    req.params = { id: "3" };
    req.body = { nombre: "Actualizado" };
    usuarioServiceMock.actualizar.mockResolvedValue({ id: 3, nombre: "Actualizado" });

    await usuarioController.actualizar(req, res);

    expect(usuarioServiceMock.actualizar).toHaveBeenCalledWith("3", {
      nombre: "Actualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 3, nombre: "Actualizado" });
  });

  test("eliminar: debe responder 204", async () => {
    req.params = { id: "10" };
    usuarioServiceMock.eliminar.mockResolvedValue(true);

    await usuarioController.eliminar(req, res);

    expect(usuarioServiceMock.eliminar).toHaveBeenCalledWith("10");
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("debe responder 409 en LEGAJO_YA_EXISTENTE", async () => {
    req.body = {};
    usuarioServiceMock.crear.mockRejectedValue(new Error("LEGAJO_YA_EXISTENTE"));

    await usuarioController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "LEGAJO_YA_EXISTENTE" });
  });

  test("debe responder 500 para error no controlado", async () => {
    req.body = {};
    usuarioServiceMock.crear.mockRejectedValue(new Error("ERROR_DESCONOCIDO"));

    await usuarioController.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});
