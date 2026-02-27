const {
  validarPedido,
  validarMesaParam,
  validarCerrarMesa,
} = require("../../src/middlewares/pedidoValidator");

async function ejecutarMiddlewares(middlewares, req, res) {
  for (const middleware of middlewares) {
    let nextCalled = false;

    await new Promise((resolve, reject) => {
      const next = (error) => {
        nextCalled = true;
        if (error) reject(error);
        else resolve();
      };

      try {
        const result = middleware(req, res, next);

        if (result && typeof result.then === "function") {
          result
            .then(() => {
              if (!nextCalled) resolve();
            })
            .catch(reject);
        } else if (!nextCalled) {
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });

    if (res.status.mock.calls.length > 0) {
      break;
    }
  }
}

describe("pedidoValidator", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("validarPedido: payload valido no responde error", async () => {
    const req = {
      body: {
        mesa: "4",
        cliente: "Juan",
        productos: [{ platoId: 1, cantidad: 2, aclaracion: "sin sal" }],
      },
      params: {},
      query: {},
    };

    await ejecutarMiddlewares(validarPedido, req, res);

    expect(res.status).not.toHaveBeenCalled();
  });

  test("validarPedido: payload invalido responde DATOS_INVALIDOS", async () => {
    const req = {
      body: {
        mesa: "4",
        productos: [],
      },
      params: {},
      query: {},
    };

    await ejecutarMiddlewares(validarPedido, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe("DATOS_INVALIDOS");
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.length).toBeGreaterThan(0);
  });

  test("validarMesaParam: param invalido responde DATOS_INVALIDOS", async () => {
    const req = {
      body: {},
      params: { mesa: "abc" },
      query: {},
    };

    await ejecutarMiddlewares(validarMesaParam, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "DATOS_INVALIDOS",
        details: expect.any(Array),
      })
    );
  });

  test("validarMesaParam: param valido no responde error y convierte a int", async () => {
    const req = {
      body: {},
      params: { mesa: "4" },
      query: {},
    };

    await ejecutarMiddlewares(validarMesaParam, req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(req.params.mesa).toBe(4);
  });

  test("validarCerrarMesa: body invalido responde DATOS_INVALIDOS", async () => {
    const req = {
      body: { mesaId: 0 },
      params: {},
      query: {},
    };

    await ejecutarMiddlewares(validarCerrarMesa, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "DATOS_INVALIDOS",
        details: expect.any(Array),
      })
    );
  });

  test("validarCerrarMesa: body valido no responde error", async () => {
    const req = {
      body: { mesaId: 4 },
      params: {},
      query: {},
    };

    await ejecutarMiddlewares(validarCerrarMesa, req, res);

    expect(res.status).not.toHaveBeenCalled();
  });
});

