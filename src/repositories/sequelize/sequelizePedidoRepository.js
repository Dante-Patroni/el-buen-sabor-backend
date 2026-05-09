const { Pedido, DetallePedido, Plato, Mesa, sequelize } = require("../../models");
const PedidoRepository = require("../pedidoRepository");
const { Op, Sequelize } = require("sequelize");

class SequelizePedidoRepository extends PedidoRepository {

  async inTransaction(callback) {
    const transaction = await sequelize.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async crearPedido(data, transaction = null) {
    return await Pedido.create(data, { transaction });
  }

  async crearDetalles(detalles, transaction = null) {
    return await DetallePedido.bulkCreate(detalles, { transaction });
  }

  async listarPedidosPorEstado(estado) {
    let whereClause = {};
    if (estado) {
      if (Array.isArray(estado)) {
        whereClause.estado = { [Op.in]: estado };
      } else {
        whereClause.estado = estado;
      }
    }

    return await Pedido.findAll({
      where: whereClause,
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Plato,
              as: "plato",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });
  }

  async buscarPedidosPorMesa(mesaNumero) {
    return await Pedido.findAll({
      where: { mesaId: mesaNumero },
      include: [
        {
          model: DetallePedido,
          as: "detalles"
        }
      ],
      order: [["createdAt", "ASC"]]
    });
  }

  async eliminarPedidoPorId(id, transaction = null) {
    await Pedido.destroy({ where: { id }, transaction });
    return true;
  }

  async buscarPedidoAbiertosPorMesa(mesaId) {
    return await Pedido.findAll({
      where: {
        mesaId: mesaId,
        [Op.or]: [
          {
            estado: {
              [Op.in]: ["pendiente", "en_preparacion", "entregado", ""]
            }
          },
          {
            estado: {
              [Op.is]: null
            }
          }
        ]
      }
    });
  }

  async buscarPedidosFacturablesPorMesa(mesaId, transaction = null) {
    return await Pedido.findAll({
      where: {
        mesaId: mesaId,
        [Op.or]: [
          { estado: { [Op.in]: ["pendiente", "en_preparacion", "entregado", ""] } },
          { estado: { [Op.is]: null } }
        ]
      },
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Plato,
              as: "plato",
              attributes: ["id", "nombre", "precio"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
      transaction,
    });
  }

  async marcarPedidosComoPagados(mesaId, transaction = null) {
    await Pedido.update(
      { estado: 'pagado' },
      {
        where: {
          mesaId: mesaId,
          estado: {
            [Op.or]: [
              { [Op.eq]: 'pendiente' },
              { [Op.eq]: 'en_preparacion' },
              { [Op.eq]: 'entregado' },
              { [Op.is]: null },
              { [Op.eq]: '' }
            ]
          }
        },
        transaction
      }
    );
  }

  async obtenerDetallesPedido(pedidoId, transaction = null) {
    return await DetallePedido.findAll({
      where: { pedidoId: pedidoId },
      transaction
    });
  }

  async eliminarDetallesPedido(pedidoId, transaction = null) {
    return await DetallePedido.destroy({
      where: { pedidoId: pedidoId },
      transaction
    });
  }

  /*async actualizarTotalPedido(pedidoId, nuevoTotal, transaction = null) {
    return await Pedido.update(
      { total: nuevoTotal },
      { where: { id: pedidoId }, transaction }
    );
  }*/

  async buscarPedidoPorId(id, transaction = null) {
    return await Pedido.findByPk(id, {
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          include: [
            {
              model: Plato,
              as: "plato",
              attributes: ["id", "nombre", "precio"]
            }
          ]
        }
      ],
      transaction
    });
  } // ✅ FALTABA ESTE CIERRE

  async actualizarEstadoPedido(id, nuevoEstado, transaction = null) {
    return await Pedido.update(
      { estado: nuevoEstado },
      { where: { id }, transaction }
    );
  }

  async obtenerTotalPorMesa(mesaId, transaction = null) {
    const resultado = await Pedido.findAll({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("detalles.subtotal")), "total"]
      ],
      include: [
        {
          model: DetallePedido,
          as: "detalles",
          attributes: [],
        }
      ],
      where: {
        mesaId: mesaId,
        estado: {
          [Op.ne]: "pagado"
        }
      },
      raw: true,
      transaction
    });

    return Number(resultado[0]?.total) || 0;
  }

  async calcularTotalMesa(mesaId, transaction = null) {
    const resultado = await sequelize.query(
      `
      SELECT SUM(dp.subtotal) as total
      FROM pedidos p
      JOIN detallepedidos dp ON dp.pedido_id = p.id
      WHERE p.mesa_id = :mesaId
      AND p.estado != 'pagado'
      `,
      {
        replacements: { mesaId },
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    );

    return Number(resultado[0].total) || 0;
  }

  async calcularTotalPedido(pedidoId, transaction = null) {
    const resultado = await sequelize.query(
      `
      SELECT SUM(dp.subtotal) as total
      FROM detallepedidos dp
      WHERE dp.pedido_id = :pedidoId
      `,
      {
        replacements: { pedidoId },
        type: sequelize.QueryTypes.SELECT,
        transaction
      }
    );

    return Number(resultado[0].total) || 0;
  } // ✅ MÉTODO AHORA ESTÁ DENTRO DE LA CLASE

} // ✅ CIERRE DE LA CLASE

module.exports = SequelizePedidoRepository;