const UsuarioService = require("../../src/services/usuarioService");

describe("UsuarioService - login", () => {
  let usuarioRepositoryMock;
  let usuarioService;

  beforeEach(() => {
    usuarioRepositoryMock = {
      buscarUsuarioPorId: jest.fn(),
      compararPassword: jest.fn(),
    };

    usuarioService = new UsuarioService(usuarioRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe lanzar DATOS_INVALIDOS si falta legajo", async () => {
    await expect(usuarioService.login(undefined, "1234")).rejects.toThrow(
      "DATOS_INVALIDOS"
    );

    expect(usuarioRepositoryMock.buscarUsuarioPorId).not.toHaveBeenCalled();
    expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
  });

  test("debe lanzar DATOS_INVALIDOS si falta password", async () => {
    await expect(usuarioService.login("1001", "")).rejects.toThrow(
      "DATOS_INVALIDOS"
    );

    expect(usuarioRepositoryMock.buscarUsuarioPorId).not.toHaveBeenCalled();
    expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
  });

  test("debe lanzar USUARIO_NO_ENCONTRADO", async () => {
    usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue(null);

    await expect(usuarioService.login("9999", "1234")).rejects.toThrow(
      "USUARIO_NO_ENCONTRADO"
    );
  });

  test("debe lanzar USUARIO_INACTIVO", async () => {
    usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue({
      id: 1,
      nombre: "Dante",
      apellido: "Patroni",
      rol: "admin",
      password: "hash-password",
      activo: false,
    });

    await expect(usuarioService.login("1001", "1234")).rejects.toThrow(
      "USUARIO_INACTIVO"
    );

    expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
  });

  test("debe lanzar PASSWORD_INCORRECTA", async () => {
    usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue({
      id: 1,
      nombre: "Dante",
      apellido: "Patroni",
      rol: "admin",
      password: "hash-password",
      activo: true,
    });
    usuarioRepositoryMock.compararPassword.mockResolvedValue(false);

    await expect(
      usuarioService.login("1001", "passwordIncorrecta")
    ).rejects.toThrow("PASSWORD_INCORRECTA");
  });

  test("debe loguear correctamente", async () => {
    usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue({
      id: 1,
      nombre: "Dante",
      apellido: "Patroni",
      rol: "admin",
      password: "hash-password",
      activo: true,
    });
    usuarioRepositoryMock.compararPassword.mockResolvedValue(true);

    const resultado = await usuarioService.login(" 1001 ", " 1234 ");

    expect(usuarioRepositoryMock.buscarUsuarioPorId).toHaveBeenCalledWith(
      "1001"
    );
    expect(usuarioRepositoryMock.compararPassword).toHaveBeenCalledWith(
      "1234",
      "hash-password"
    );
    expect(resultado.status).toBe(200);
    expect(resultado.body.token).toBeDefined();
    expect(resultado.body.usuario).toEqual({
      id: 1,
      nombre: "Dante",
      apellido: "Patroni",
      rol: "admin",
    });
  });
});
