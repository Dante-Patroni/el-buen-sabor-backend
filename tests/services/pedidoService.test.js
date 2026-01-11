// Importamos el Service que queremos testear
const PedidoService = require("../../src/services/pedidoService");

test("listarPedidos delega la búsqueda al pedidoRepository", async () => {
  // ------------------------------------------------------
  // 1️⃣ Creamos un fake repository
  // Simula ser el PedidoRepository real
  // ------------------------------------------------------
  const fakePedidoRepository = {
    // Simulamos el método que el service va a usar
    listarPedidosPorEstado: async (estado) => {
      // Devolvemos datos falsos, controlados
      return [
        { id: 1, estado },
        { id: 2, estado}
      ];
    }
  };

  // ------------------------------------------------------
  // 2️⃣ Inyectamos el fake repository en el Service
  // ------------------------------------------------------
  const pedidoService = new PedidoService(fakePedidoRepository);

  // ------------------------------------------------------
  // 3️⃣ Ejecutamos el método del Service
  // ------------------------------------------------------
  const resultado = await pedidoService.listarPedidos("pendiente");

  // ------------------------------------------------------
  // 4️⃣ Verificamos el resultado
  // El service devuelve lo que el repository devuelve
  // ------------------------------------------------------
  expect(resultado).toHaveLength(2);
  expect(resultado[0].estado).toBe("pendiente");
});

test("listarPedidos lanza un error si el repository falla", async () => {
  // ------------------------------------------------------
  // 1️⃣ Fake repository que SIMULA un fallo
  // ------------------------------------------------------
  const fakePedidoRepository = {
    listarPedidosPorEstado: async () => {
      // Simulamos un error típico de infraestructura
      throw new Error("ERROR_DB");
    }
  };

  // ------------------------------------------------------
  // 2️⃣ Inyectamos el fake en el Service
  // ------------------------------------------------------
  const pedidoService = new PedidoService(fakePedidoRepository);

  // ------------------------------------------------------
  // 3️⃣ Ejecutamos y verificamos que el error se propaga
  // ------------------------------------------------------
  await expect(
    pedidoService.listarPedidos("pendiente")
  ).rejects.toThrow("ERROR_DB");
});

