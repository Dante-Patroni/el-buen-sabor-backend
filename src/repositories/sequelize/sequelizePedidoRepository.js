const { Pedido, DetallePedido, Plato, Mesa, sequelize } = require("../../models");
const PedidoRepository = require("../pedidoRepository");
const { Op } = require("sequelize");

class SequelizePedidoRepository extends PedidoRepository {

  /**
* Ejecuta una operación dentro de una transacción de base de datos.
*
* Este método encapsula la lógica de manejo transaccional
* (begin, commit, rollback) para evitar que el Service tenga
* que conocer detalles del ORM (Sequelize).
*
* @param {Function} callback - Función async que contiene la lógica
* de negocio a ejecutar de forma atómica. Recibe el objeto transaction.
*
* @returns {*} Devuelve el resultado que retorne el callback.
*
* Funcionamiento:
* 1. Abre una nueva transacción.
* 2. Ejecuta la función recibida pasándole la transacción.
* 3. Si todo sale bien → hace commit.
* 4. Si ocurre un error → hace rollback.
* 5. Propaga el error hacia capas superiores.
*/
  async inTransaction(callback) {

    // 1️⃣ Se inicia una nueva transacción en la base de datos.
    // A partir de este momento, todas las operaciones que reciban
    // este objeto 'transaction' formarán parte de la misma unidad atómica.
    const transaction = await sequelize.transaction();

    try {

      // 2️⃣ Se ejecuta la lógica de negocio que el Service definió,
      // pasándole la transacción para que la utilice en sus queries.
      const result = await callback(transaction);

      // 3️⃣ Si no hubo errores, se confirma permanentemente
      // todo lo ejecutado dentro de la transacción.
      await transaction.commit();

      // 4️⃣ Se devuelve el resultado producido por el callback.
      return result;

    } catch (error) {

      // 5️⃣ Si ocurre cualquier error durante la ejecución,
      // se revierten todos los cambios realizados en la transacción.
      await transaction.rollback();

      // 6️⃣ Se vuelve a lanzar el error para que el Service o Controller
      // puedan manejarlo (no se oculta ni se transforma).
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

  async eliminarPedidoPorId(id, transaction = null) {
    await Pedido.destroy({ where: { id }, transaction });
    return true;
  }



  async buscarPedidoAbiertosPorMesa(mesaId) {
    return await Pedido.findAll({
      where: {
        mesa: mesaId,
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

  async marcarPedidosComoPagados(mesaId, transaction = null) {
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
        },
        transaction
      }
    );
  }


  async obtenerDetallesPedido(pedidoId) {
    return await DetallePedido.findAll({
      where: { PedidoId: pedidoId }
    });
  }

  async eliminarDetallesPedido(pedidoId, transaction = null) {
    return await DetallePedido.destroy({
      where: { PedidoId: pedidoId },
      transaction
    });
  }


  async actualizarTotalPedido(pedidoId, nuevoTotal, transaction = null) {
    return await Pedido.update(
      { total: nuevoTotal },
      { where: { id: pedidoId }, transaction }
    );
  }
}

module.exports = SequelizePedidoRepository;