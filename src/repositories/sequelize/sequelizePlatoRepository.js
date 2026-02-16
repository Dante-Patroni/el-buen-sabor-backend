const { Plato, Rubro, sequelize } = require("../../models");
const PlatoRepository = require("../platoRepository");
const { Op, Sequelize } = require("sequelize");




class SequelizePlatoRepository extends PlatoRepository {
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

  //LISTAR MENU COMPLETO
  async listarMenuCompleto() {
    // A. MySQL: Traemos platos e incluimos el nombre del Rubro
    return await Plato.findAll({
      include: [{ model: Rubro, as: 'rubro', attributes: ['denominacion'] }]
    });

  }

  // CREAR NUEVO PRODUCTO
  async crearNuevoProducto(datos) {
    // datos trae: nombre, precio, rubroId, esMenuDelDia, etc.
    return await Plato.create(datos);
  }

  //BUSCAR PRODUCTO POR ID
  async buscarPorPlatoPorId(id) {
    return await Plato.findByPk(id);
  }
  //BUSCAR PRODUCTO POR NOMBRE
  async buscarPorNombre(nombre) {
    return await Plato.findOne({
      where: { nombre }
    });
  }

  //MODIFICAR PRODUCTO ID
  async modificarProductoSeleccionado(id, datos) {
    await Plato.update(datos, { where: { id } });
    return await Plato.findByPk(id);
  }
  //ELIMINAR PRODUCTO POR ID
  async eliminarPorId(id) {
    const filasEliminadas = await Plato.destroy({
      where: { id }
    });

    return filasEliminadas; // devuelve 0 o 1
  }


  async actualizarStock(id, nuevoStock, transaction = null) {
    await Plato.update(
      { stockActual: nuevoStock },
      { where: { id }, transaction }
    );
    return await Plato.findByPk(id, { transaction });
  }

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

  async actualizarEstadoPedido(pedidoId, nuevoEstado, transaction = null) {
    return await Pedido.update(
      { estado: nuevoEstado },
      { where: { id: pedidoId }, transaction }
    );
  }


}//FIN DE CLASE

module.exports = SequelizePlatoRepository;