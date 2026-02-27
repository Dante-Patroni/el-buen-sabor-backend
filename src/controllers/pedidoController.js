const { manejarErrorHttp } = require("./errorMapper");

class PedidoController {
  /**
   * @description Crea una instancia del controller de pedidos.
   * @param {import("../services/pedidoService")} pedidoService - Servicio de pedidos inyectado.
   */
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  /**
   * @description Crea un pedido validando reglas de negocio en el service.
   * @param {import("express").Request} req - Request con payload del pedido.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Pedido creado.
   * @throws {Error} Codigos de dominio de pedido/mesa/plato.
   */
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

  /**
   * @description Modifica un pedido existente si cumple reglas de estado.
   * @param {import("express").Request} req - Request con datos de modificacion.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Pedido actualizado.
   * @throws {Error} Codigos de dominio de validacion o conflicto de estado.
   */
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

  /**
   * @description Lista pedidos existentes con metadata de cantidad.
   * @param {import("express").Request} req - Request HTTP.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Listado de pedidos.
   * @throws {Error} Errores de capa service/repository.
   */
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

  /**
   * @description Busca pedidos historicos/activos de una mesa.
   * @param {import("express").Request} req - Request con `params.mesa`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Pedidos asociados a la mesa.
   * @throws {Error} Codigos de dominio por validacion o inexistencia.
   */
  buscarPorMesa = async (req, res) => {
    try {
      const { mesa } = req.params;
      const pedidos = await this.pedidoService.buscarPedidosPorMesa(mesa);
      return res.status(200).json(pedidos);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Elimina un pedido pendiente y restaura stock/total asociado.
   * @param {import("express").Request} req - Request con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Confirmacion de eliminacion.
   * @throws {Error} Codigos de dominio si el pedido no existe o no puede eliminarse.
   */
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

