// 👇 Importamos la instancia DIRECTAMENTE (ya creada en el servicio)
const pedidoService = require("../services/pedidoService");

class PedidoController {
  
  // ---------------------------------------------------------
  // 1. CREAR (POST)
  // ---------------------------------------------------------
  async crear(req, res) {
    try {
      const { cliente, platoId, mesa } = req.body;

      if (!platoId || !mesa) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
      }

      // Asegurar que mesa sea string
      const mesaString = String(mesa);
      const clienteFinal = cliente || "";

      // 👇 Usamos 'pedidoService' directamente (sin 'this.')
      const pedidoCreado = await pedidoService.crearYValidarPedido(
        clienteFinal,
        platoId,
        mesaString
      );

      res.status(201).json({
        mensaje: "Pedido creado exitosamente",
        data: {
          id: pedidoCreado.id,
          mesa: pedidoCreado.mesa,
          cliente: pedidoCreado.cliente,
          platoId: pedidoCreado.PlatoId, // Ojo: Sequelize suele devolver PlatoId o platoId
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
      if (error.message === "MESA_REQUERIDA")
          return res.status(400).json({ error: "Número de mesa obligatorio." });
          
      return res.status(500).json({ error: "Error interno." });
    }
  }

  // ---------------------------------------------------------
  // 2. LISTAR (GET)
  // ---------------------------------------------------------
  async listar(req, res) {
    try {
      const { estado } = req.query;
      // 👇 Usamos 'pedidoService' directamente
      const pedidos = await pedidoService.listarPedidos(estado);

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error Listar:", error.message);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  // ---------------------------------------------------------
  // 3. HISTORIAL DE MESA
  // ---------------------------------------------------------
  async buscarPorMesa(req, res) {
    try {
      const { mesa } = req.params;

      if (!mesa) {
        return res.status(400).json({ error: "Número de mesa es obligatorio" });
      }

      // 👇 Usamos 'pedidoService' directamente
      const pedidos = await pedidoService.buscarPedidosPorMesa(mesa);

      res.status(200).json(pedidos);
    } catch (error) {
      console.error(`Error buscando pedidos por mesa ${req.params.mesa}:`, error);
      return res.status(500).json({ error: "Error al obtener el historial de la mesa" });
    }
  }

  // ---------------------------------------------------------
  // 4. ELIMINAR (DELETE)
  // ---------------------------------------------------------
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // 👇 Usamos 'pedidoService' directamente
      const resultado = await pedidoService.eliminarPedido(id); // Eliminamos y reponemos stock

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

module.exports = PedidoController;