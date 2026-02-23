const { Rubro, Plato, sequelize } = require("../../models");
const RubroRepository = require("../rubroRepository");
const { Op } = require("sequelize");


class SequelizeRubroRepository extends RubroRepository {

    // ================================
    // TRANSACCIONES
    // ================================
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
     * Trae rubros padres (padreId = null) con sus subrubros anidados.
     * Solo activos.
     * Esta query estaba antes directamente en rubroService.js
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
     * Busca un rubro por ID (sin importar si es padre o hijo)
     */
    async buscarPorId(id, transaction = null) {
        return await Rubro.findByPk(id, { transaction });
    }

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
    async buscarPorDenominacionYPadre(denominacion, padreId, transaction = null) {

        return await Rubro.findOne({
            where: {
                denominacion,
                padreId: padreId ?? null
            },
            transaction
        });
    }

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
     * Crea un rubro nuevo.
     * Si datos.padreId viene definido → es un subrubro.
     * Si datos.padreId es null → es un rubro padre.
     */
    async crear(datos, transaction = null) {
        return await Rubro.create(datos, { transaction });
    }

    /**
     * Actualiza los campos de un rubro existente.
     */
    async actualizar(id, datos, transaction = null) {
        const [filasAfectadas] = await Rubro.update(datos, {
            where: { id },
            transaction
        });
        return filasAfectadas;
    }

    /**
     * Soft delete: pone activo = false.
     * NO borra de la BD, así se puede reactivar en el futuro.
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
