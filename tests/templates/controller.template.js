/**
 * Plantilla base para tests unitarios de Controller con Jest.
 *
 * Uso:
 * 1) Copiar este archivo a tests/controllers/<modulo>Controller.test.js
 * 2) Reemplazar placeholders (__X__)
 * 3) Completar casos de dominio del modulo
 *
 * Requisito obligatorio del proyecto:
 * - Cada funcion debe incluir un bloque JSDoc inmediatamente encima.
 * - Aplica a funciones publicas y privadas.
 * - Aplica a controllers, services, repositories, middlewares y utilidades.
 */

const __Controller__ = require("../../src/controllers/__controller__");

describe("__Controller__", () => {
  let serviceMock;
  let controller;
  let req;
  let res;

  beforeEach(() => {
    serviceMock = {
      // Completar metodos usados por el controller
      metodoA: jest.fn(),
      metodoB: jest.fn(),
    };

    controller = new __Controller__(serviceMock);

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

    // Evita ruido en consola al probar ramas de error.
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("__metodo__: caso feliz", async () => {
    serviceMock.metodoA.mockResolvedValue({ ok: true });

    await controller.__metodo__(req, res);

    expect(serviceMock.metodoA).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("__metodo__: error de dominio", async () => {
    serviceMock.metodoA.mockRejectedValue(new Error("__CODIGO_DOMINIO__"));

    await controller.__metodo__(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Ajustar segun mapper.
    expect(res.json).toHaveBeenCalledWith({ error: "__CODIGO_DOMINIO__" });
  });

  test("__metodo__: error no controlado", async () => {
    serviceMock.metodoA.mockRejectedValue(new Error("ERROR_RARO"));

    await controller.__metodo__(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});
