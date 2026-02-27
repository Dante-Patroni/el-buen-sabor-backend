const multer = require("multer");
const { manejarErroresUpload } = require("../../src/middlewares/upload");

describe("manejarErroresUpload", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("llama next si no hay error", () => {
    manejarErroresUpload(null, req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("mapea LIMIT_FILE_SIZE a ARCHIVO_DEMASIADO_GRANDE (400)", () => {
    const error = new multer.MulterError("LIMIT_FILE_SIZE");

    manejarErroresUpload(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ARCHIVO_DEMASIADO_GRANDE" });
  });

  test("mapea TIPO_ARCHIVO_INVALIDO a 400", () => {
    const error = new Error("TIPO_ARCHIVO_INVALIDO");

    manejarErroresUpload(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "TIPO_ARCHIVO_INVALIDO" });
  });

  test("error desconocido cae en ERROR_INTERNO (500)", () => {
    const error = new Error("ERROR_RARO_UPLOAD");

    manejarErroresUpload(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
  });
});
