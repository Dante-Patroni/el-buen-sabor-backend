const PlatoController = require("../../src/controllers/platoController");

describe("PlatoController", () => {
  let platoServiceMock;
  let platoController;
  let req;
  let res;

  beforeEach(() => {
    platoServiceMock = {
      listarMenuCompleto: jest.fn(),
      crearNuevoProducto: jest.fn(),
      modificarProducto: jest.fn(),
      eliminarProducto: jest.fn(),
      cargarImagenProducto: jest.fn(),
    };

    platoController = new PlatoController(platoServiceMock);

    req = { body: {}, params: {}, query: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  // tests aquí
  test("listarMenuCompleto: responde 200", async () => {
  const menu = [{ id: 1, nombre: "Milanesa" }];
  platoServiceMock.listarMenuCompleto.mockResolvedValue(menu);

  await platoController.listarMenuCompleto(req, res);

  expect(platoServiceMock.listarMenuCompleto).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(menu);
});

test("crearNuevoProducto: responde 201", async () => {
  req.body = { nombre: "Pizza", precio: 1000, rubroId: 1, stockActual: 10 };
  platoServiceMock.crearNuevoProducto.mockResolvedValue({ id: 5 });

  await platoController.crearNuevoProducto(req, res);

  expect(platoServiceMock.crearNuevoProducto).toHaveBeenCalledWith(req.body);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ id: 5 });
});

test("crearNuevoProducto: mapea PRODUCTO_YA_EXISTE a 409", async () => {
  req.body = { nombre: "Pizza" };
  platoServiceMock.crearNuevoProducto.mockRejectedValue(new Error("PRODUCTO_YA_EXISTE"));

  await platoController.crearNuevoProducto(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith({ error: "PRODUCTO_YA_EXISTE" });
});

test("modificarProducto: responde 200", async () => {
  req.params = { id: "7" };
  req.body = { precio: 1200 };
  platoServiceMock.modificarProducto.mockResolvedValue({ id: 7, precio: 1200 });

  await platoController.modificarProducto(req, res);

  expect(platoServiceMock.modificarProducto).toHaveBeenCalledWith("7", { precio: 1200 });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ id: 7, precio: 1200 });
});

test("modificarProducto: mapea PLATO_NO_ENCONTRADO a 404", async () => {
  req.params = { id: "99" };
  req.body = { precio: 1200 };
  platoServiceMock.modificarProducto.mockRejectedValue(new Error("PLATO_NO_ENCONTRADO"));

  await platoController.modificarProducto(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "PLATO_NO_ENCONTRADO" });
});

test("eliminarProducto: responde 200 y mensaje", async () => {
  req.params = { id: "7" };
  platoServiceMock.eliminarProducto.mockResolvedValue(true);

  await platoController.eliminarProducto(req, res);

  expect(platoServiceMock.eliminarProducto).toHaveBeenCalledWith("7");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ mensaje: "PLATO_ELIMINADO_CORRECTAMENTE" });
});

test("cargarImagenProducto: responde 200 cuando sube imagen", async () => {
  req.params = { id: "7" };
  req.file = { filename: "foto.jpg" };
  platoServiceMock.cargarImagenProducto.mockResolvedValue({ id: 7, imagenPath: "/uploads/foto.jpg" });

  await platoController.cargarImagenProducto(req, res);

  expect(platoServiceMock.cargarImagenProducto).toHaveBeenCalledWith("7", "foto.jpg");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    mensaje: "Imagen subida correctamente",
    plato: { id: 7, imagenPath: "/uploads/foto.jpg" },
  });
});

test("cargarImagenProducto: responde 400 si no se envio imagen", async () => {
  req.params = { id: "7" };
  req.file = undefined;

  await platoController.cargarImagenProducto(req, res);

  expect(platoServiceMock.cargarImagenProducto).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: "NO_SE_ENVIO_IMAGEN" });
});

test("cargarImagenProducto: responde 500 en error no controlado", async () => {
  req.params = { id: "7" };
  req.file = { filename: "foto.jpg" };
  platoServiceMock.cargarImagenProducto.mockRejectedValue(new Error("ERROR_RARO"));

  await platoController.cargarImagenProducto(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "ERROR_INTERNO" });
});

});
