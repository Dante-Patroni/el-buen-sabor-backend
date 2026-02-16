const { Mesa, Usuario, sequelize } = require("../../models");
const MesaRepository = require("../mesaRepository");

class SequelizeMesaRepository extends MesaRepository {


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



  /**
   * Trae todas las mesas con su mozo asociado
   * Infraestructura pura (ORM)
   */
  async listarMesasConMozo() {
    return await Mesa.findAll({
      order: [['id', 'ASC']],
      include: [{
        model: Usuario,
        as: 'mozo',
        attributes: ['nombre', 'apellido', 'legajo']
      }]
    });
  }

  /**
   * Busca una mesa por su ID
   * No valida negocio, solo devuelve datos
   */
  async buscarMesaPorId(id, transaction = null) {
    return await Mesa.findByPk(id, { transaction });
  }


  /**
   * Persiste una mesa ya modificada
   * El Service decide QUÉ cambiar
   */
  async actualizarMesa(mesa, transaction = null) {
    return await mesa.save({ transaction });
  }

  async cerrarMesa(mesa, transaction = null) {
    return await mesa.save({ transaction });
  }


}

module.exports = SequelizeMesaRepository;
