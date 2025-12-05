const PedidoService = require("../services/pedidoService");
const StockAdapter = require("../adapters/MongoStockAdapter");
const { Pedido, Plato } = require("../models");

class PedidoController {
  constructor() {
    // [A] INYECCIÓN DE DEPENDENCIAS (Wiring)
    this.stockAdapter = new StockAdapter();
    this.pedidoService = new PedidoService(this.stockAdapter);
  }

  // ---------------------------------------------------------
  // 1. CREAR (POST)
  // ---------------------------------------------------------
  async crear(req, res) {
    try {
      const { cliente, platoId, mesa } = req.body;

      if (!platoId || !mesa) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
      }

      // Asegurar que mesa sea string (incluso si envías número desde Flutter)
      const mesaString = String(mesa);

      // Cliente puede ser undefined/string vacío
      const clienteFinal = cliente || "";

      const pedidoCreado = await this.pedidoService.crearYValidarPedido(
        cliente,
        platoId,
        mesa,
      );

      res.status(201).json({
        mensaje: "Pedido creado exitosamente",
        data: {
          id: pedidoCreado.id,
          mesa: pedidoCreado.mesa,
          cliente: pedidoCreado.cliente,
          platoId: pedidoCreado.platoId,
          fecha: pedidoCreado.fecha,
          estado: pedidoCreado.estado,
        },
      });
    } catch (error) {
      console.error("Error Crear:", error.message);
      if (error.message === "STOCK_INSUFICIENTE")
        return res.status(409).json({ error: "Stock insuficiente." });
      if (error.message === "PLATO_NO_ENCONTRADO")
        return res.status(404).json({ error: "Plato no encontrado." });
      return res.status(500).json({ error: "Error interno." });
    }
  }

  // ---------------------------------------------------------
  // 2. LISTAR (GET)
  // ---------------------------------------------------------
  async listar(req, res) {
    try {
      //1. Extraemos 'estado' de los query params
      // Ejemplo: /api/pedidos?estado=pendiente => estadoFilter = 'pendiente'
      const { estado } = req.query;
      //2. Llamamos al servicio para obtener los pedidos
      const pedidos = await this.pedidoService.listarPedidos(estado);

      // Devolvemos Array puro para Flutter
      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error Listar:", error.message);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  // ---------------------------------------------------------
  // 3. ELIMINAR (DELETE) - ¡ESTE ES EL QUE FALTABA! 🆕
  // ---------------------------------------------------------
  async eliminar(req, res) {
    try {
      const { id } = req.params; // El ID viene en la URL: /api/pedidos/5

      await this.pedidoService.eliminarPedido(id);

      res.status(200).json({
        mensaje: "Pedido eliminado y stock restaurado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar:", error.message);

      if (error.message === "PEDIDO_NO_ENCONTRADO") {
        return res.status(404).json({ error: "El pedido no existe" });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = new PedidoController();
