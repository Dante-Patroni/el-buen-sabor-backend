const CajaService = require("../../src/services/cajaService");

describe("CajaService", () => {
  let mesaServiceMock;
  let pedidoServiceMock;
  let facturacionServiceMock;
  let cajaService;

  beforeEach(() => {
    mesaServiceMock = {
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      calcularTotalActual: jest.fn(),
      cerrarMesa: jest.fn(),
    };

    pedidoServiceMock = {
      buscarPedidosPorMesa: jest.fn(),
    };

    facturacionServiceMock = {
      generarResumenCierre: jest.fn(),
    };

    cajaService = new CajaService(mesaServiceMock, pedidoServiceMock, facturacionServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------
  // listarMesasAbiertas
  // --------------------------------------------------
  describe("listarMesasAbiertas", () => {
    test("retorna solo las mesas en estado esperando_cobro", async () => {
      mesaServiceMock.listar.mockResolvedValue([
        { id: 1, estado: "libre" },
        { id: 2, estado: "ocupada" },
        { id: 3, estado: "esperando_cobro" },
        { id: 4, estado: "Esperando_Cobro" },
      ]);

      const resultado = await cajaService.listarMesasAbiertas();

      expect(mesaServiceMock.listar).toHaveBeenCalledTimes(1);
      // El filtro usa .toLowerCase(), por lo que ambas deben aparecer
      expect(resultado).toHaveLength(2);
      expect(resultado.map((m) => m.id)).toEqual([3, 4]);
    });

    test("retorna array vacío si no hay mesas esperando cobro", async () => {
      mesaServiceMock.listar.mockResolvedValue([
        { id: 1, estado: "libre" },
        { id: 2, estado: "ocupada" },
      ]);

      const resultado = await cajaService.listarMesasAbiertas();

      expect(resultado).toHaveLength(0);
    });
  });

  // --------------------------------------------------
  // obtenerMesaPorId
  // --------------------------------------------------
  describe("obtenerMesaPorId", () => {
    test("retorna datos completos de mesa con total y pedidos", async () => {
      const mesaMock = {
        id: 5,
        estado: "esperando_cobro",
        toJSON: () => ({ id: 5, estado: "esperando_cobro" }),
      };
      const pedidosMock = [{ id: 10, estado: "entregado" }];

      mesaServiceMock.obtenerPorId.mockResolvedValue(mesaMock);
      mesaServiceMock.calcularTotalActual.mockResolvedValue(8500);
      pedidoServiceMock.buscarPedidosPorMesa.mockResolvedValue(pedidosMock);

      const resultado = await cajaService.obtenerMesaPorId(5);

      expect(mesaServiceMock.obtenerPorId).toHaveBeenCalledWith(5);
      expect(mesaServiceMock.calcularTotalActual).toHaveBeenCalledWith(5);
      expect(pedidoServiceMock.buscarPedidosPorMesa).toHaveBeenCalledWith(5);

      expect(resultado).toEqual({
        id: 5,
        estado: "esperando_cobro",
        totalActual: 8500,
        pedidos: pedidosMock,
      });
    });

    test("funciona con mesa que no tiene método toJSON", async () => {
      const mesaMock = { id: 3, estado: "esperando_cobro" };

      mesaServiceMock.obtenerPorId.mockResolvedValue(mesaMock);
      mesaServiceMock.calcularTotalActual.mockResolvedValue(0);
      pedidoServiceMock.buscarPedidosPorMesa.mockResolvedValue([]);

      const resultado = await cajaService.obtenerMesaPorId(3);

      expect(resultado.id).toBe(3);
      expect(resultado.totalActual).toBe(0);
      expect(resultado.pedidos).toEqual([]);
    });

    test("propaga MESA_NO_ENCONTRADA si el servicio la lanza", async () => {
      mesaServiceMock.obtenerPorId.mockRejectedValue(new Error("MESA_NO_ENCONTRADA"));

      await expect(cajaService.obtenerMesaPorId(99)).rejects.toThrow("MESA_NO_ENCONTRADA");
    });
  });

  // --------------------------------------------------
  // obtenerTicketCierre
  // --------------------------------------------------
  describe("obtenerTicketCierre", () => {
    test("delega al facturacionService y retorna el resumen", async () => {
      const ticketMock = {
        mesaId: 5,
        subtotal: 10000,
        totalFinal: 12100,
      };
      facturacionServiceMock.generarResumenCierre.mockResolvedValue(ticketMock);

      const resultado = await cajaService.obtenerTicketCierre(5);

      expect(facturacionServiceMock.generarResumenCierre).toHaveBeenCalledWith(5);
      expect(resultado).toEqual(ticketMock);
    });
  });

  // --------------------------------------------------
  // cobrarMesa
  // --------------------------------------------------
  describe("cobrarMesa", () => {
    test("delega al mesaService.cerrarMesa y retorna el resultado", async () => {
      const cierreMock = {
        mesaId: 4,
        totalCobrado: 15000,
        facturacion: { pedidos: [] },
      };
      mesaServiceMock.cerrarMesa.mockResolvedValue(cierreMock);

      const resultado = await cajaService.cobrarMesa(4);

      expect(mesaServiceMock.cerrarMesa).toHaveBeenCalledWith(4);
      expect(resultado).toEqual(cierreMock);
    });

    test("propaga MESA_NO_SOLICITO_COBRO si la mesa no estaba esperando cobro", async () => {
      mesaServiceMock.cerrarMesa.mockRejectedValue(new Error("MESA_NO_SOLICITO_COBRO"));

      await expect(cajaService.cobrarMesa(2)).rejects.toThrow("MESA_NO_SOLICITO_COBRO");
    });

    test("propaga MESA_YA_LIBRE si la mesa ya fue cerrada", async () => {
      mesaServiceMock.cerrarMesa.mockRejectedValue(new Error("MESA_YA_LIBRE"));

      await expect(cajaService.cobrarMesa(7)).rejects.toThrow("MESA_YA_LIBRE");
    });
  });
});
