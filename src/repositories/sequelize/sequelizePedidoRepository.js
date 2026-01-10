const { Pedido, DetallePedido, Plato, Mesa } = require("../../models");
const PedidoRepository = require("../pedidoRepository");

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
}

module.exports = SequelizePedidoRepository;
