const { Pedido, DetallePedido, Plato, Mesa, sequelize } = require("../../models");
const PedidoRepository = require("../pedidoRepository");
const { Op } = require("sequelize");

class SequelizePedidoRepository extends PedidoRepository {

  /**
   * @description Ejecuta una operacion atomica dentro de una transaccion Sequelize.
   * @param {(transaction: import("sequelize").Transaction) => Promise<any>} callback - Logica atomica.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Repropaga errores tras rollback.
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

  /**
   * @description Crea la cabecera de un pedido.
   * @param {object} data - Datos del pedido.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Pedido creado.
   */
  async crearPedido(data, transaction = null) {
    return await Pedido.create(data, { transaction });
  }

  /**
   * @description Crea en lote los detalles de pedido.
   * @param {Array<object>} detalles - Detalles a persistir.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<object>>} Detalles creados.
   */
  async crearDetalles(detalles, transaction = null) {
    return await DetallePedido.bulkCreate(detalles, { transaction });
  }

  /**
   * @description Lista pedidos, opcionalmente filtrados por estado.
   * @param {string|undefined} estado - Estado opcional.
   * @returns {Promise<Array<object>>} Pedidos con detalles incluidos.
   */
  async listarPedidosPorEstado(estado) {
    const filtro = estado ? { where: { estado } } : {};

    return await Pedido.findAll({
      ...filtro,
      include: [DetallePedido]
    });
  }

  /**
   * @description Busca pedidos por mesa ordenados por fecha de creacion.
   * @param {number|string} mesaNumero - Numero de mesa.
   * @returns {Promise<Array<object>>} Pedidos de la mesa.
   */
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

  /**
   * @description Busca un pedido por clave primaria.
   * @param {number|string} id - Id del pedido.
   * @returns {Promise<object|null>} Pedido encontrado o `null`.
   */
  async buscarPedidoPorId(id) {
    return await Pedido.findByPk(id);
  }

  /**
   * @description Elimina un pedido por id.
   * @param {number|string} id - Id del pedido.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<boolean>} `true` cuando finaliza.
   */
  async eliminarPedidoPorId(id, transaction = null) {
    await Pedido.destroy({ where: { id }, transaction });
    return true;
  }

  /**
   * @description Busca pedidos no pagados/abiertos de una mesa.
   * @param {number|string} mesaId - Id de mesa.
   * @returns {Promise<Array<object>>} Pedidos abiertos.
   */
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

  /**
   * @description Marca como pagados los pedidos abiertos de una mesa.
   * @param {number|string} mesaId - Id de mesa.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<void>} Resolucion sin valor.
   */
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
  /**
   * @description Obtiene los detalles de un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @returns {Promise<Array<object>>} Detalles encontrados.
   */
  async obtenerDetallesPedido(pedidoId) {
    return await DetallePedido.findAll({
      where: { PedidoId: pedidoId }
    });
  }

  /**
   * @description Elimina los detalles asociados a un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Cantidad de filas eliminadas.
   */
  async eliminarDetallesPedido(pedidoId, transaction = null) {
    return await DetallePedido.destroy({
      where: { PedidoId: pedidoId },
      transaction
    });
  }

  /**
   * @description Actualiza el total monetario de un pedido.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {number} nuevoTotal - Nuevo total calculado.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<number>>} Resultado de `update` de Sequelize.
   */
  async actualizarTotalPedido(pedidoId, nuevoTotal, transaction = null) {
    return await Pedido.update(
      { total: nuevoTotal },
      { where: { id: pedidoId }, transaction }
    );
  }
}

module.exports = SequelizePedidoRepository;
