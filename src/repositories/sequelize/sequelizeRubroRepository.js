const { Rubro, Plato, sequelize } = require("../../models");
const RubroRepository = require("../rubroRepository");
const { Op } = require("sequelize");


class SequelizeRubroRepository extends RubroRepository {

    // ================================
    // TRANSACCIONES
    // ================================
    /**
     * @description Ejecuta una operacion atomica dentro de una transaccion Sequelize.
     * @param {(transaction: import("sequelize").Transaction) => Promise<any>} callback - Logica transaccional.
     * @returns {Promise<any>} Resultado del callback.
     * @throws {Error} Repropaga errores tras rollback.
     */
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

    // ================================
    // CONSULTAS
    // ================================

    /**
     * @description Trae rubros padre activos con subrubros activos anidados.
     * @returns {Promise<Array<object>>} Jerarquia de rubros.
     */
    async listarJerarquia() {
        return await Rubro.findAll({
            where: {
                padreId: null,
                activo: true
            },
            include: [
                {
                    model: Rubro,
                    as: 'subrubros',
                    where: { activo: true },
                    required: false,            // LEFT JOIN: trae al padre aunque no tenga hijos
                    attributes: ['id', 'denominacion']
                }
            ],
            attributes: ['id', 'denominacion'],
            order: [['denominacion', 'ASC']]
        });
    }

    /**
     * @description Busca un rubro por id.
     * @param {number|string} id - Id del rubro.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<object|null>} Rubro encontrado o `null`.
     */
    async buscarPorId(id, transaction = null) {
        return await Rubro.findByPk(id, { transaction });
    }

    /**
     * @description Indica si existe un rubro activo con el id provisto.
     * @param {number|string} id - Id del rubro.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<boolean>} `true` si existe activo.
     */
    async existeActivo(id, transaction = null) {
        const rubro = await Rubro.findOne({//solo queremos saber si existe uno
            where: {
                id,
                activo: true
            },
            transaction
        });

        return !!rubro;//devuelve true si encontró uno, false si no
    }
    /**
     * @description Busca un rubro por denominacion y padre.
     * @param {string} denominacion - Denominacion normalizada.
     * @param {number|null} padreId - Id de padre o `null`.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<object|null>} Rubro encontrado o `null`.
     */
    async buscarPorDenominacionYPadre(denominacion, padreId, transaction = null) {

        return await Rubro.findOne({
            where: {
                denominacion,
                padreId: padreId ?? null
            },
            transaction
        });
    }

    /**
     * @description Busca rubro por denominacion/padre excluyendo un id especifico.
     * @param {string} denominacion - Denominacion normalizada.
     * @param {number|null} padreId - Id de padre o `null`.
     * @param {number} excluirId - Id a excluir.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<object|null>} Rubro duplicado o `null`.
     */
    async buscarPorDenominacionYPadreExcluyendoId(denominacion, padreId, excluirId, transaction = null) {
        return await Rubro.findOne({
            where: {
                denominacion,
                padreId: padreId ?? null,
                id: { [Op.ne]: excluirId }//id diferente al excluirId
            },
            transaction
        });
    }

    /**
     * @description Verifica si un rubro posee subrubros activos.
     * @param {number|string} id - Id de rubro padre.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<boolean>} `true` si hay subrubros activos.
     */
    async tieneSubrubrosActivos(id, transaction = null) {
        const cantidad = await Rubro.count({
            where: {
                padreId: id,//Busca rubros cuyo padre sea el rubro actual.
                activo: true
            },
            transaction
        });

        return cantidad > 0;
    }

    /**
     * @description Verifica si existen platos activos asociados a un rubro.
     * @param {number|string} id - Id del rubro.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<boolean>} `true` si hay platos activos.
     */
    async tienePlatosAsociados(id, transaction = null) {
        const cantidad = await Plato.count({
            where: {
                rubroId: id,
                activo: true
            },
            transaction
        });

        return cantidad > 0;
    }


    // ================================
    // ESCRITURAS (Para el CRUD del Admin)
    // ================================

    /**
     * @description Crea un rubro nuevo.
     * @param {object} datos - Datos del rubro.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<object>} Rubro creado.
     */
    async crear(datos, transaction = null) {
        return await Rubro.create(datos, { transaction });
    }

    /**
     * @description Actualiza los campos de un rubro existente.
     * @param {number|string} id - Id del rubro.
     * @param {object} datos - Campos a actualizar.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<number>} Cantidad de filas afectadas.
     */
    async actualizar(id, datos, transaction = null) {
        const [filasAfectadas] = await Rubro.update(datos, {
            where: { id },
            transaction
        });
        return filasAfectadas;
    }

    /**
     * @description Realiza baja logica de rubro (`activo=false`).
     * @param {number|string} id - Id del rubro.
     * @param {import("sequelize").Transaction|null} transaction - Transaccion opcional.
     * @returns {Promise<number>} Cantidad de filas afectadas.
     */
    async eliminar(id, transaction = null) {
        const [filasAfectadas] = await Rubro.update(
            { activo: false },
            { where: { id }, transaction }
        );
        return filasAfectadas;
    }

}



module.exports = SequelizeRubroRepository;
