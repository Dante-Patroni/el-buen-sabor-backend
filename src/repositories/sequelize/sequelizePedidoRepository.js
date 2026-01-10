const { Pedido, DetallePedido, Plato, Mesa } = require("../../models");
const PedidoRepository = require("../pedidoRepository");
const { Op } = require("sequelize");

class SequelizePedidoRepository extends PedidoRepository {

  async buscarPlatoPorId(id) {
    return await Plato.findByPk(id);
  }

  async crearPedido(data) {
    return await Pedido.create(data);
  }

  async crearDetalles(detalles) {
    return await DetallePedido.bulkCreate(detalles);
  }

  async buscarMesaPorId(id) {
    return await Mesa.findByPk(id);
  }

  async actualizarMesa(mesa) {
    return await mesa.save();
  }

  async listarPedidosPorEstado(estado) {
    const filtro = estado ? { where: { estado } } : {};

    return await Pedido.findAll({
      ...filtro,
      include: [DetallePedido]
    });
  }
  async buscarPedidosPorMesa(mesaNumero) {
    return await Pedido.findAll({
      where: { mesa: mesaNumero },
      include: [DetallePedido]
    });
  }

  async buscarPedidoPorId(id) {
     return await Pedido.findByPk(id);
  }

  async eliminarPedidoPorId(id) {
    await Pedido.destroy({ where: { id } });
    return true;
  }

  async buscarPedidosAbiertosPorMesa(mesaId) {
    return pedidosPendientes = await Pedido.findAll({
        where: { 
          mesa: mesaId, 
          estado: {
            [Op.or]: [
               "pendiente",
                "en_preparacion",
                "entregado",
                null,
                ""
            ]
          } 
        }
      });
  }

  async marcarPedidosComoPagados(mesaId) {
    await Pedido.update(
        { estado: 'pagado' },
        {
          where: {
            mesa: mesaId,
            estado: {
              [Op.or]: [
                { [Op.eq]: 'pendiente' },
                { [Op.eq]: 'en_preparacion' },
                { [Op.eq]: 'entregado' },
                { [Op.is]: null },
                { [Op.eq]: '' }
              ]
            }
          }
        }
      );
  }

}
module.exports = SequelizePedidoRepository;
