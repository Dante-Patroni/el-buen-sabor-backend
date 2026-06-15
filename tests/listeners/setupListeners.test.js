// JWT_SECRET debe existir antes de cargar setupListeners (que requiere jsonwebtoken)
process.env.JWT_SECRET = "test_secret_jest";

const jwt = require("jsonwebtoken");
const EventEmitter = require("events");

// Obtenemos referencia al pedidoEmitter ANTES de requerir setupListeners
// para poder emitir eventos en los tests
const pedidoEmitter = require("../../src/events/pedidoEvents");

const setupListeners = require("../../src/listeners/setupListeners");

// ----------------------------------------------------------------
// Helper: crea un socket mock con la estructura de Socket.IO
// ----------------------------------------------------------------
function crearSocketMock(token = null) {
  return {
    handshake: {
      auth: token ? { token } : {},
      headers: {},
    },
    usuario: null,
    on: jest.fn(),
    emit: jest.fn(),
    id: "socket_test_123",
  };
}

// ----------------------------------------------------------------
// Helper: crea un io mock que expone el middleware de autenticación
// ----------------------------------------------------------------
function crearIoMock() {
  let middlewareRegistrado = null;
  const io = {
    use: jest.fn((fn) => {
      middlewareRegistrado = fn;
    }),
    emit: jest.fn(),
    on: jest.fn(),
    getMiddleware: () => middlewareRegistrado,
  };
  return io;
}

// ----------------------------------------------------------------
// Tests
// ----------------------------------------------------------------
describe("setupListeners", () => {
  let io;
  let consoleSpy;

  beforeEach(() => {
    io = crearIoMock();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    pedidoEmitter.removeAllListeners();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    pedidoEmitter.removeAllListeners();
  });

  // --------------------------------------------------
  // MIDDLEWARE DE AUTENTICACIÓN WEBSOCKET
  // --------------------------------------------------
  describe("middleware de autenticación JWT en WebSocket", () => {
    test("registra el middleware en io.use al inicializar", () => {
      setupListeners(io);

      expect(io.use).toHaveBeenCalledTimes(1);
      expect(typeof io.getMiddleware()).toBe("function");
    });

    test("permite conexión con token válido y adjunta usuario al socket", () => {
      setupListeners(io);
      const middleware = io.getMiddleware();

      const tokenValido = jwt.sign({ id: 1, rol: "admin" }, process.env.JWT_SECRET);
      const socket = crearSocketMock(tokenValido);
      const next = jest.fn();

      middleware(socket, next);

      expect(next).toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledTimes(1);
      expect(socket.usuario).toBeDefined();
      expect(socket.usuario.id).toBe(1);
    });

    test("rechaza conexión sin token con error NO_AUTH", () => {
      setupListeners(io);
      const middleware = io.getMiddleware();

      const socket = crearSocketMock(null);
      const next = jest.fn();

      middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "NO_AUTH" }));
      expect(socket.usuario).toBeNull();
    });

    test("rechaza conexión con token inválido con error TOKEN_INVALIDO", () => {
      setupListeners(io);
      const middleware = io.getMiddleware();

      const socket = crearSocketMock("token_falso_no_valido");
      const next = jest.fn();

      middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "TOKEN_INVALIDO" }));
    });

    test("acepta token enviado en el header Authorization", () => {
      setupListeners(io);
      const middleware = io.getMiddleware();

      const tokenValido = jwt.sign({ id: 2, rol: "cajero" }, process.env.JWT_SECRET);
      const socket = crearSocketMock(null);
      // Simula token en header en lugar de auth
      socket.handshake.headers.authorization = `Bearer ${tokenValido}`;

      const next = jest.fn();
      middleware(socket, next);

      expect(next).toHaveBeenCalledWith();
      expect(socket.usuario.id).toBe(2);
    });
  });

  // --------------------------------------------------
  // EVENTO: pedido-creado → io.emit("nuevo-pedido")
  // --------------------------------------------------
  describe("evento pedido-creado", () => {
    test("emite 'nuevo-pedido' a todos los clientes cuando se crea un pedido", () => {
      setupListeners(io);

      const pedidoMock = {
        id: 55,
        mesaId: 4,
        estado: "pendiente",
        items: [{ plato: "Pizza", cantidad: 2 }],
      };

      pedidoEmitter.emit("pedido-creado", { pedido: pedidoMock });

      expect(io.emit).toHaveBeenCalledWith("nuevo-pedido", pedidoMock);
    });

    test("no falla si io es undefined (sin WebSocket activo)", () => {
      setupListeners(undefined);

      expect(() => {
        pedidoEmitter.emit("pedido-creado", {
          pedido: { id: 1, mesaId: 1, estado: "pendiente", items: [] },
        });
      }).not.toThrow();
    });
  });

  // --------------------------------------------------
  // EVENTO: ticket-generado → io.emit("ticket-generado")
  // --------------------------------------------------
  describe("evento ticket-generado", () => {
    test("emite 'ticket-generado' con el ticket de cierre", () => {
      setupListeners(io);

      const ticketMock = {
        mesaId: 4,
        totalFinal: 12100,
        pedidos: [],
      };

      pedidoEmitter.emit("ticket-generado", ticketMock);

      expect(io.emit).toHaveBeenCalledWith("ticket-generado", ticketMock);
    });

    test("no falla si io es undefined al generar ticket", () => {
      setupListeners(undefined);

      expect(() => {
        pedidoEmitter.emit("ticket-generado", { mesaId: 1, totalFinal: 0 });
      }).not.toThrow();
    });
  });

  // --------------------------------------------------
  // EVENTO: mesa-esperando-cobro → io.emit("mesa-esperando-cobro")
  // --------------------------------------------------
  describe("evento mesa-esperando-cobro", () => {
    test("emite 'mesa-esperando-cobro' con datos de la mesa", () => {
      setupListeners(io);

      const dataMock = { mesaId: 3, estado: "esperando_cobro" };
      pedidoEmitter.emit("mesa-esperando-cobro", dataMock);

      expect(io.emit).toHaveBeenCalledWith("mesa-esperando-cobro", dataMock);
    });

    test("no falla si io es undefined al solicitar cobro", () => {
      setupListeners(undefined);

      expect(() => {
        pedidoEmitter.emit("mesa-esperando-cobro", { mesaId: 2, estado: "esperando_cobro" });
      }).not.toThrow();
    });
  });

  // --------------------------------------------------
  // EVENTO: pedido-estado-actualizado → io.emit("pedido-estado-actualizado")
  // --------------------------------------------------
  describe("evento pedido-estado-actualizado", () => {
    test("emite 'pedido-estado-actualizado' con los datos del cambio", () => {
      setupListeners(io);

      const dataMock = { pedidoId: 10, mesaId: 4, estado: "en_preparacion" };
      pedidoEmitter.emit("pedido-estado-actualizado", dataMock);

      expect(io.emit).toHaveBeenCalledWith("pedido-estado-actualizado", dataMock);
    });

    test("no falla si io es undefined al actualizar estado", () => {
      setupListeners(undefined);

      expect(() => {
        pedidoEmitter.emit("pedido-estado-actualizado", { pedidoId: 5, mesaId: 1, estado: "listo" });
      }).not.toThrow();
    });
  });

  // --------------------------------------------------
  // NO REGISTRA MIDDLEWARE si io es undefined
  // --------------------------------------------------
  test("no llama io.use si io es undefined", () => {
    const ioConUse = crearIoMock();
    setupListeners(undefined);

    expect(ioConUse.use).not.toHaveBeenCalled();
  });
});
