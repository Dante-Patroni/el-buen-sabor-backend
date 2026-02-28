const FacturacionService = require("../../src/services/facturacionService");

describe("FacturacionService", () => {
  let pedidoRepositoryMock;
  let facturacionService;

  beforeEach(() => {
    pedidoRepositoryMock = {
      buscarPedidosFacturablesPorMesa: jest.fn(),
    };

    facturacionService = new FacturacionService(pedidoRepositoryMock);
  });

  test("generarResumenCierre: arma resumen con pedidos, items y totales", async () => {
    pedidoRepositoryMock.buscarPedidosFacturablesPorMesa.mockResolvedValue([
      {
        id: 10,
        cliente: "Cliente App",
        DetallePedidos: [
          {
            PlatoId: 1,
            cantidad: 2,
            subtotal: 5000,
            Plato: { id: 1, nombre: "Milanesa", precio: 2500 },
          },
          {
            PlatoId: 2,
            cantidad: 1,
            subtotal: 3000,
            Plato: { id: 2, nombre: "Papas", precio: 3000 },
          },
        ],
      },
      {
        id: 11,
        cliente: null,
        DetallePedidos: [
          {
            PlatoId: 3,
            cantidad: 1,
            subtotal: 2000,
            Plato: { id: 3, nombre: "Gaseosa", precio: 2000 },
          },
        ],
      },
    ]);

    const resultado = await facturacionService.generarResumenCierre(4);

    expect(pedidoRepositoryMock.buscarPedidosFacturablesPorMesa).toHaveBeenCalledWith(4, null);
    expect(resultado.mesaId).toBe(4);
    expect(resultado.pedidos).toHaveLength(2);
    expect(resultado.subtotal).toBe(10000);
    expect(resultado.impuestos).toEqual({
      ivaPorcentaje: 21,
      ivaImporte: 2100,
    });
    expect(resultado.totalFinal).toBe(12100);
    expect(resultado.pedidos[0].totalPedido).toBe(8000);
    expect(resultado.pedidos[1].cliente).toBe("Anonimo");
  });

  test("generarResumenCierre: soporta estructura detallePedidos en minuscula", async () => {
    pedidoRepositoryMock.buscarPedidosFacturablesPorMesa.mockResolvedValue([
      {
        id: 22,
        cliente: "Mesa 1",
        detallePedidos: [
          {
            PlatoId: 7,
            cantidad: 1,
            subtotal: 1500,
            Plato: { id: 7, nombre: "Cafe", precio: 1500 },
          },
        ],
      },
    ]);

    const resultado = await facturacionService.generarResumenCierre("1");

    expect(resultado.mesaId).toBe(1);
    expect(resultado.pedidos[0].items[0].plato).toBe("Cafe");
    expect(resultado.impuestos.ivaImporte).toBe(315);
    expect(resultado.totalFinal).toBe(1815);
  });

  test("generarResumenCierre: devuelve ticket vacio si no hay pedidos", async () => {
    pedidoRepositoryMock.buscarPedidosFacturablesPorMesa.mockResolvedValue([]);

    const resultado = await facturacionService.generarResumenCierre(8);

    expect(resultado.pedidos).toEqual([]);
    expect(resultado.subtotal).toBe(0);
    expect(resultado.impuestos.ivaImporte).toBe(0);
    expect(resultado.totalFinal).toBe(0);
  });
});
