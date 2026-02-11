class PedidoController {

  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  // ---------------------------------------------------------
  // CREAR (POST)
  // ---------------------------------------------------------
  crear = async (req, res) => {
    try {
      const pedido = await this.pedidoService.crearYValidarPedido(req.body);

      res.status(201).json({
        message: "Pedido creado con éxito",
        data: pedido
      });
    } catch (error) {
      console.error("Error Crear:", error.message);
      res.status(error.status || 500).json({
    error: error.message
  });
    }
  }

  // ---------------------------------------------------------
  // MODIFICAR (PUT)
  // ---------------------------------------------------------
  modificar = async (req, res) => {
    try {
      const pedido = await this.pedidoService.modificarPedido(req.body);

      res.status(200).json({
        message: "Pedido modificado con éxito",
        data: pedido
      });
    } catch (error) {
      console.error("Error modificar:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ---------------------------------------------------------
  // LISTAR (GET)
  // ---------------------------------------------------------
  listar = async (req, res) => {
    try {
      const pedidos = await this.pedidoService.listarPedidos();

      res.status(200).json({
        cantidad: pedidos.length,
        data: pedidos
      });
    } catch (error) {
      console.error("Error Listar:", error.message);
      res.status(500).json({ error: "Error al obtener pedidos" });
    }
  }

  // ---------------------------------------------------------
  // HISTORIAL POR MESA (GET)
  // ---------------------------------------------------------
  buscarPorMesa = async (req, res) => {
    try {
      const { mesa } = req.params;

      const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesa);

      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error buscando pedidos por mesa:", error.message);
      res.status(500).json({ error: "Error al obtener el historial de la mesa" });
    }
  }

  // ---------------------------------------------------------
  // ELIMINAR (DELETE)
  // ---------------------------------------------------------
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      await this.pedidoService.eliminarPedido(id);

      res.status(200).json({
        mensaje: "Pedido eliminado y stock restaurado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar:", error.message);

      if (error.message === "PEDIDO_NO_ENCONTRADO") {
        return res.status(404).json({ error: "El pedido no existe" });
      }

      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = PedidoController;
