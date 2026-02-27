const { manejarErrorHttp } = require("./errorMapper");

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

      return res.status(201).json({
        mensaje: "Pedido creado con éxito",
        data: pedido,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // MODIFICAR (PUT)
  // ---------------------------------------------------------
  modificar = async (req, res) => {
    try {
      const pedido = await this.pedidoService.modificarPedido(req.body);

      return res.status(200).json({
        mensaje: "Pedido modificado con éxito",
        data: pedido,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // LISTAR (GET)
  // ---------------------------------------------------------
  listar = async (req, res) => {
    try {
      const pedidos = await this.pedidoService.listarPedidos();

      return res.status(200).json({
        cantidad: pedidos.length,
        data: pedidos,
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // HISTORIAL POR MESA (GET)
  // ---------------------------------------------------------
  buscarPorMesa = async (req, res) => {
    try {
      const { mesa } = req.params;
      const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesa);
      return res.status(200).json(pedidos);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // ELIMINAR (DELETE)
  // ---------------------------------------------------------
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.pedidoService.eliminarPedido(id);

      return res.status(200).json({
        mensaje: "Pedido eliminado y stock restaurado correctamente",
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = PedidoController;

