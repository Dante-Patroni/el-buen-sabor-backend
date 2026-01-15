const UsuarioService = require("../../src/services/usuarioService");

describe("UsuarioService - login", () => {

    let usuarioRepositoryMock;
    let usuarioService;

    beforeEach(() => {
        // Mock del repositorio
        usuarioRepositoryMock = {
            buscarUsuarioPorId: jest.fn(),
            compararPassword: jest.fn(),
        };

        // Inyectamos el mock en el service
        usuarioService = new UsuarioService(usuarioRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("❌ Usuario no encontrado", async () => {
        // Arrange
        usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue(null);

        // Act
        const resultado = await usuarioService.login("9999", "1234");

        // Assert
        expect(resultado.status).toBe(404);
        expect(resultado.body.mensaje).toBe("Usuario no encontrado");

    });

    test("❌ Contraseña incorrecta", async () => {
        // Arrange
        const usuarioMock = {
            id: 1,
            nombre: "Dante",
            apellido: "Patroni",
            rol: "admin",
            password: "hash-password",
        };

        usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue(usuarioMock);
        usuarioRepositoryMock.compararPassword.mockResolvedValue(false);

        // Act
        const resultado = await usuarioService.login("1001", "passwordIncorrecta");

        // Assert
        expect(resultado.status).toBe(401);
        expect(resultado.body.mensaje).toBe("Contraseña incorrecta");
    });

    test("✅ Login exitoso", async () => {
        // Arrange
        const usuarioMock = {
            id: 1,
            nombre: "Dante",
            apellido: "Patroni",
            rol: "admin",
            password: "hash-password",
        };

        usuarioRepositoryMock.buscarUsuarioPorId.mockResolvedValue(usuarioMock);
        usuarioRepositoryMock.compararPassword.mockResolvedValue(true);

        // Act
        const resultado = await usuarioService.login("1001", "1234");

        // Assert
        expect(resultado.status).toBe(200);
        expect(resultado.body.token).toBeDefined();
        expect(resultado.body.usuario).toEqual({
            id: 1,
            nombre: "Dante",
            apellido: "Patroni",
            rol: "admin"
        });

    });

});
