const { Plato, Rubro, sequelize } = require("../../models");
const PlatoRepository = require("../platoRepository");
const { Op, Sequelize } = require("sequelize");




class SequelizePlatoRepository extends PlatoRepository {
  /**
   * @description Ejecuta una operacion dentro de una transaccion de Sequelize.
   * @param {(transaction: import("sequelize").Transaction) => Promise<any>} callback - Logica atomica.
   * @returns {Promise<any>} Resultado del callback.
   * @throws {Error} Repropaga cualquier error tras rollback.
   */
  async inTransaction(callback) {

    const transaction = await sequelize.transaction();

    try {
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
   * @description Lista el menu completo incluyendo rubro asociado.
   * @returns {Promise<Array<object>>} Platos con rubro.
   */
  async listarMenuCompleto() {
    // A. MySQL: Traemos platos e incluimos el nombre del Rubro
    return await Plato.findAll({
      include: [{ model: Rubro, as: 'rubro', attributes: ['denominacion'] }]
    });

  }

  /**
   * @description Crea un plato nuevo.
   * @param {object} datos - Datos del plato.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object>} Plato creado.
   */
  async crearNuevoProducto(datos, transaction = null) {
    // datos trae: nombre, precio, rubroId, esMenuDelDia, etc.
    return await Plato.create(datos, { transaction });
  }

  /**
   * @description Busca un plato por id.
   * @param {number|string} id - Id del plato.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato encontrado o `null`.
   */
  async buscarPorId(id, transaction = null) {
    return await Plato.findByPk(id, { transaction });
  }
  /**
   * @description Busca un plato por nombre.
   * @param {string} nombre - Nombre del plato.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato encontrado o `null`.
   */
  async buscarPorNombre(nombre, transaction = null) {
    return await Plato.findOne({
      where: { nombre },
      transaction
    });
  }

  /**
   * @description Actualiza un plato por id y devuelve la entidad actualizada.
   * @param {number|string} id - Id del plato.
   * @param {object} datos - Campos a actualizar.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato actualizado o `null`.
   */
  async modificarProductoSeleccionado(id, datos, transaction = null) {
    await Plato.update(datos, { where: { id }, transaction });
    return await Plato.findByPk(id, { transaction });
  }
  /**
   * @description Elimina un plato por id.
   * @param {number|string} id - Id del plato.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<number>} Cantidad de filas eliminadas.
   */
  async eliminarPorId(id, transaction = null) {
    const filasEliminadas = await Plato.destroy({
      where: { id },
      transaction
    });

    return filasEliminadas; // devuelve 0 o 1
  }

  /**
   * @description Actualiza el stock absoluto y devuelve el plato resultante.
   * @param {number|string} id - Id del plato.
   * @param {number} nuevoStock - Nuevo stock.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<object|null>} Plato actualizado o `null`.
   */
  async actualizarStock(id, nuevoStock, transaction = null) {
    await Plato.update(
      { stockActual: nuevoStock },
      { where: { id }, transaction }
    );
    return await Plato.findByPk(id, { transaction });
  }

  /**
   * @description Descuenta stock de forma atomica usando condicion `stockActual >= cantidad`.
   * @param {number|string} id - Id del plato.
   * @param {number} cantidad - Cantidad a descontar.
   * @param {import("sequelize").Transaction} transaction - Transaccion activa.
   * @returns {Promise<number>} Filas afectadas.
   */
  async descontarStockAtomico(id, cantidad, transaction) {
    const [filasAfectadas] = await Plato.update(
      {
        stockActual: Sequelize.literal(`stockActual - ${cantidad}`)
      },
      {
        where: {
          id,
          esIlimitado: false,
          stockActual: { [Op.gte]: cantidad } //Es lo mismo que WHERE stockActual >= cantidad
        },
        transaction
      }
    );

    return filasAfectadas; // 0 si no pudo descontar
  }

  /**
   * @description Restaura stock de forma atomica para platos no ilimitados.
   * @param {number|string} id - Id del plato.
   * @param {number} cantidad - Cantidad a sumar.
   * @param {import("sequelize").Transaction} transaction - Transaccion activa.
   * @returns {Promise<void>} Resolucion sin valor.
   */
  async restaurarStockAtomico(id, cantidad, transaction) {
    await Plato.update(
      {
        stockActual: Sequelize.literal(`stockActual + ${cantidad}`)
      },
      {
        where: {
          id,
          esIlimitado: false
        },
        transaction
      }
    );
  }

  /**
   * @description Actualiza el estado de un pedido relacionado.
   * @param {number|string} pedidoId - Id del pedido.
   * @param {string} nuevoEstado - Nuevo estado.
   * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
   * @returns {Promise<Array<number>>} Resultado de `update` de Sequelize.
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado, transaction = null) {
    return await Pedido.update(
      { estado: nuevoEstado },
      { where: { id: pedidoId }, transaction }
    );
  }


}//FIN DE CLASE

module.exports = SequelizePlatoRepository;
