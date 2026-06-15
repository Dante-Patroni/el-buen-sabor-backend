// JWT_SECRET debe existir ANTES de requerir el módulo que lo valida
process.env.JWT_SECRET = "test_secret_jest";

const UsuarioService = require("../../src/services/usuarioService");

describe("UsuarioService", () => {
  let usuarioRepositoryMock;
  let usuarioService;

  // ✅ Usuario con estructura actual (rolId + rol como objeto con nombre y permisos)
  const usuarioActivoMock = {
    id: 1,
    nombre: "Dante",
    apellido: "Patroni",
    legajo: "1001",
    rolId: 2,
    rol: { nombre: "admin", permisos: [{ codigo: "VER_PEDIDOS" }, { codigo: "CERRAR_MESA" }] },
    password: "hash-password",
    activo: true,
  };

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

  // --------------------------------------------------
  // login()
  // --------------------------------------------------
  describe("login()", () => {
    test("debe lanzar DATOS_INVALIDOS si falta legajo", async () => {
      await expect(usuarioService.login(undefined, "1234")).rejects.toThrow(
        "DATOS_INVALIDOS"
      );

      expect(usuarioRepositoryMock.buscarPorLegajo).not.toHaveBeenCalled();
      expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
    });

    test("debe lanzar CREDENCIALES_INVALIDAS si el usuario no existe", async () => {
      // ✅ ACTUALIZADO: el service usa CREDENCIALES_INVALIDAS (no USUARIO_NO_ENCONTRADO)
      // para no revelar qué campo falló
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(null);

      await expect(usuarioService.login("9999", "1234")).rejects.toThrow(
        "CREDENCIALES_INVALIDAS"
      );
    });

    test("debe lanzar CREDENCIALES_INVALIDAS si el usuario está inactivo", async () => {
      // ✅ ACTUALIZADO: el service unifica el error a CREDENCIALES_INVALIDAS
      // para no revelar que el usuario existe pero está inactivo
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({
        ...usuarioActivoMock,
        activo: false,
      });

      await expect(usuarioService.login("1001", "1234")).rejects.toThrow(
        "CREDENCIALES_INVALIDAS"
      );

      expect(usuarioRepositoryMock.compararPassword).not.toHaveBeenCalled();
    });

    test("debe lanzar PASSWORD_INCORRECTA si la contraseña no coincide", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(usuarioActivoMock);
      usuarioRepositoryMock.compararPassword.mockResolvedValue(false);

      await expect(
        usuarioService.login("1001", "passwordIncorrecta")
      ).rejects.toThrow("PASSWORD_INCORRECTA");
    });

    test("debe loguear correctamente y retornar token + usuario con estructura actual", async () => {
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(usuarioActivoMock);
      usuarioRepositoryMock.compararPassword.mockResolvedValue(true);

      const resultado = await usuarioService.login(" 1001 ", " 1234 ");

      expect(usuarioRepositoryMock.buscarPorLegajo).toHaveBeenCalledWith("1001");
      expect(usuarioRepositoryMock.compararPassword).toHaveBeenCalledWith(
        "1234",
        "hash-password"
      );
      expect(resultado.status).toBe(200);
      expect(resultado.body.token).toBeDefined();

      // ✅ ACTUALIZADO: _toPublicUser() ahora retorna rolId, rol (nombre), permisos
      expect(resultado.body.usuario).toEqual({
        id: 1,
        nombre: "Dante",
        apellido: "Patroni",
        legajo: "1001",
        rolId: 2,
        rol: "admin",
        permisos: ["VER_PEDIDOS", "CERRAR_MESA"],
        activo: true,
      });
    });
  });

  // --------------------------------------------------
  // crear()
  // --------------------------------------------------
  describe("crear()", () => {
    test("debe crear usuario válido con rolId entero", async () => {
      // ✅ ACTUALIZADO: ahora se pasa rolId (entero) en lugar de rol (string)
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue(null);
      usuarioRepositoryMock.crear.mockImplementation(async (datos) => ({
        id: 8,
        nombre: datos.nombre,
        apellido: datos.apellido,
        legajo: datos.legajo,
        rolId: datos.rolId,
        rol: { nombre: "mozo", permisos: [] },
        activo: datos.activo,
        password: datos.password,
      }));

      const resultado = await usuarioService.crear({
        nombre: "Juan",
        apellido: "Perez",
        legajo: "2001",
        password: "1234",
        rolId: 3,    // ✅ rolId en vez de rol
      });

      expect(usuarioRepositoryMock.crear).toHaveBeenCalled();
      expect(resultado).toMatchObject({
        id: 8,
        nombre: "Juan",
        apellido: "Perez",
        legajo: "2001",
        rolId: 3,
        rol: "mozo",
        activo: true,
      });
      // El DTO público nunca expone password
      expect(resultado.password).toBeUndefined();
    });

    test("debe lanzar ROL_INVALIDO si se pasa rol como string en lugar de rolId", async () => {
      // ✅ NUEVO: verifica que el nuevo contrato rechaza el formato antiguo
      await expect(
        usuarioService.crear({
          nombre: "Juan",
          apellido: "Perez",
          legajo: "2001",
          password: "1234",
          rol: "mozo",    // ❌ formato antiguo
        })
      ).rejects.toThrow("ROL_INVALIDO");
    });

    test("debe lanzar LEGAJO_YA_EXISTENTE cuando el legajo está tomado", async () => {
      // ✅ ACTUALIZADO: también usa rolId
      usuarioRepositoryMock.buscarPorLegajo.mockResolvedValue({ id: 1 });

      await expect(
        usuarioService.crear({
          nombre: "Juan",
          apellido: "Perez",
          legajo: "1001",
          password: "1234",
          rolId: 3,    // ✅ rolId
        })
      ).rejects.toThrow("LEGAJO_YA_EXISTENTE");
    });
  });

  // --------------------------------------------------
  // actualizar()
  // --------------------------------------------------
  describe("actualizar()", () => {
    test("debe actualizar usuario existente", async () => {
      const usuarioActualizadoMock = {
        ...usuarioActivoMock,
        nombre: "Dante",
      };

      usuarioRepositoryMock.buscarPorId
        .mockResolvedValueOnce({ id: 1, activo: true })
        .mockResolvedValueOnce(usuarioActualizadoMock);
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

  // --------------------------------------------------
  // eliminar()
  // --------------------------------------------------
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
