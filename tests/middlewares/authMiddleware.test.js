const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middlewares/authMiddleware");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("responde 401 NO_AUTORIZADO si falta Authorization", () => {
    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "NO_AUTORIZADO" });
  });

  test("valida token Bearer, setea req.usuario y llama next", () => {
    req.headers.authorization = "Bearer token_valido";
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 1, rol: "admin" });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(req.usuario).toEqual({ id: 1, rol: "admin" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("acepta token sin prefijo Bearer", () => {
    req.headers.authorization = "token_sin_prefijo";
    jest.spyOn(jwt, "verify").mockReturnValue({ id: 2 });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "token_sin_prefijo",
      process.env.JWT_SECRET || "ClaveSecretaDante123"
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("responde 401 TOKEN_INVALIDO si jwt.verify falla", () => {
    req.headers.authorization = "Bearer token_invalido";
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "TOKEN_INVALIDO" });
  });
});

