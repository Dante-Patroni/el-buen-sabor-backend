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
    // Como 'mesa' es una instancia de Sequelize (que trajimos con findByPk),
    // al hacer .save() guarda los cambios que le hicimos en el service.
    return await mesa.save();
  }

  async cerrarMesa(mesa) {
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
  //findAll NUNCA devuelve null, siempre un array.
  return await Pedido.findAll({
    where: { mesa: mesaNumero },
    include: [
      {
        model: DetallePedido
      }
    ],
    order: [["createdAt", "ASC"]]
  });
}


  async buscarPedidoPorId(id) {
     return await Pedido.findByPk(id);
  }

  async eliminarPedidoPorId(id) {
    await Pedido.destroy({ where: { id } });
    return true;
  }

  // 🔧 CORREGIDO: Quité la 's' en 'Pedidos' para coincidir con el Service
  async buscarPedidoAbiertosPorMesa(mesaId) {
    return await Pedido.findAll({
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

  async obtenerDetallesPedido(pedidoId) {
    return await DetallePedido.findAll({
      where: { PedidoId: pedidoId }
    });
  }

  async eliminarDetallesPedido(pedidoId) {
    return await DetallePedido.destroy({
      where: { PedidoId: pedidoId }
    });
  }

  async actualizarTotalPedido(pedidoId, nuevoTotal) {
    return await Pedido.update(
      { total: nuevoTotal },
      { where: { id: pedidoId } }
    );
  }
}

module.exports = SequelizePedidoRepository;