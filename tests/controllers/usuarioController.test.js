const UsuarioController = require("../../src/controllers/usuarioController");

describe("UsuarioController - login", () => {
  let usuarioServiceMock;
  let usuarioController;
  let req;
  let res;

  beforeEach(() => {
    usuarioServiceMock = {
      login: jest.fn(),
    };

    usuarioController = new UsuarioController(usuarioServiceMock);

    req = {
      body: {
        legajo: "1001",
        password: "1234",
      },
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

  test("debe responder 200 en login exitoso", async () => {
    usuarioServiceMock.login.mockResolvedValue({
      status: 200,
      body: {
        mensaje: "Login exitoso",
        token: "token-mock",
        usuario: {
          id: 1,
          nombre: "Dante",
          apellido: "Patroni",
          rol: "admin",
        },
      },
    });

    await usuarioController.login(req, res);

    expect(usuarioServiceMock.login).toHaveBeenCalledWith("1001", "1234");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensaje: "Login exitoso",
      })
    );
  });

  test("debe responder 400 si service lanza DATOS_INVALIDOS", async () => {
    usuarioServiceMock.login.mockRejectedValue(new Error("DATOS_INVALIDOS"));

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "DATOS_INVALIDOS" });
  });

  test("debe responder 401 si service lanza PASSWORD_INCORRECTA", async () => {
    usuarioServiceMock.login.mockRejectedValue(new Error("PASSWORD_INCORRECTA"));

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "PASSWORD_INCORRECTA" });
  });

  test("debe responder 403 si service lanza USUARIO_INACTIVO", async () => {
    usuarioServiceMock.login.mockRejectedValue(new Error("USUARIO_INACTIVO"));

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "USUARIO_INACTIVO" });
  });

  test("debe responder 404 si service lanza USUARIO_NO_ENCONTRADO", async () => {
    usuarioServiceMock.login.mockRejectedValue(
      new Error("USUARIO_NO_ENCONTRADO")
    );

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "USUARIO_NO_ENCONTRADO" });
  });

  test("debe responder 500 para error no controlado", async () => {
    usuarioServiceMock.login.mockRejectedValue(new Error("ERROR_DESCONOCIDO"));

    await usuarioController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});
