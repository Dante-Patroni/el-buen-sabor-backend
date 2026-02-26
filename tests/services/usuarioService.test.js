const UsuarioService = require("../../src/services/usuarioService");

describe("UsuarioService", () => {
  let usuarioRepositoryMock;
  let usuarioService;

  beforeEach(() => {
    usuarioRepositoryMock = {
      inTransaction: jest.fn(async (callback) => await callback(null)),
      listar: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorLegajo: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminarLogico: jest.fn(),
      compararPassword: jest.fn(),
    };

    usuarioService = new UsuarioService(usuarioRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login()", () => {
    test("debe lanzar DATOS_INVALIDOS si falta legajo", async () => {
      await expect(usuarioService.login(undefined, "1234")).rejects.toThrow(
        "DATOS_INVALIDOS"
      );

      expect(usuarioRepositoryMock.buscarPorLegajo).not.toHaveBeenCalled();
      expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
    });

    test("debe lanzar USUARIO_NO_ENCONTRADO", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(null);

      await expect(usuarioService.login("9999", "1234")).rejects.toThrow(
        "USUARIO_NO_ENCONTRADO"
      );
    });

    test("debe lanzar USUARIO_INACTIVO", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({
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
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({
        id: 1,
        nombre: "Dante",
        apellido: "Patroni",
        legajo: "1001",
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
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({
        id: 1,
        nombre: "Dante",
        apellido: "Patroni",
        legajo: "1001",
        rol: "admin",
        password: "hash-password",
        activo: true,
      });
      usuarioRepositoryMock.compararPassword.mockResolvedValue(true);

      const resultado = await usuarioService.login(" 1001 ", " 1234 ");

      expect(usuarioRepositoryMock.buscarPorLegajo).toHaveBeenCalledWith("1001");
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
        legajo: "1001",
        rol: "admin",
        activo: true,
      });
    });
  });

  describe("crear()", () => {
    test("debe crear usuario válido", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(null);
      usuarioRepositoryMock.crear.mockImplementation(async (datos) => ({
        id: 8,
        ...datos,
      }));

      const resultado = await usuarioService.crear({
        nombre: "Juan",
        apellido: "Perez",
        legajo: "2001",
        password: "1234",
        rol: "mozo",
      });

      expect(usuarioRepositoryMock.crear).toHaveBeenCalled();
      expect(resultado).toMatchObject({
        id: 8,
        nombre: "Juan",
        apellido: "Perez",
        legajo: "2001",
        rol: "mozo",
        activo: true,
      });
      expect(resultado.password).toBeUndefined();
    });

    test("debe lanzar LEGAJO_YA_EXISTENTE", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({ id: 1 });

      await expect(
        usuarioService.crear({
          nombre: "Juan",
          apellido: "Perez",
          legajo: "1001",
          password: "1234",
          rol: "mozo",
        })
      ).rejects.toThrow("LEGAJO_YA_EXISTENTE");
    });
  });

  describe("actualizar()", () => {
    test("debe actualizar usuario existente", async () => {
      usuarioRepositoryMock.buscarPorId
        .mockResolvedValueOnce({ id: 1, activo: true })
        .mockResolvedValueOnce({
          id: 1,
          nombre: "Dante",
          apellido: "Patroni",
          legajo: "1001",
          rol: "admin",
          activo: true,
        });
      usuarioRepositoryMock.actualizar.mockResolvedValue(1);

      const resultado = await usuarioService.actualizar(1, { nombre: "Dante" });

      expect(usuarioRepositoryMock.actualizar).toHaveBeenCalledWith(
        1,
        { nombre: "Dante" },
        null
      );
      expect(resultado.nombre).toBe("Dante");
    });

    test("debe lanzar USUARIO_NO_ENCONTRADO", async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(null);

      await expect(usuarioService.actualizar(123, { nombre: "X" })).rejects.toThrow(
        "USUARIO_NO_ENCONTRADO"
      );
    });
  });

  describe("eliminar()", () => {
    test("debe hacer baja lógica", async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true,
      });
      usuarioRepositoryMock.eliminarLogico.mockResolvedValue(1);

      const resultado = await usuarioService.eliminar(1);

      expect(usuarioRepositoryMock.eliminarLogico).toHaveBeenCalledWith(1, null);
      expect(resultado).toBe(true);
    });

    test("debe lanzar USUARIO_YA_INACTIVO", async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: false,
      });

      await expect(usuarioService.eliminar(1)).rejects.toThrow(
        "USUARIO_YA_INACTIVO"
      );
    });
  });
});
