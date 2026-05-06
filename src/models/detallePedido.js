"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class DetallePedido extends Model {
        static associate(models) {
            // Relaciones (Opcional, pero recomendado para integridad)
            DetallePedido.belongsTo(models.Pedido);
            DetallePedido.belongsTo(models.Plato);
        }
    }

    DetallePedido.init({
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    precioUnitario: {  // ✅ AGREGAR ESTE CAMPO
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "Precio del plato al momento de la venta (histórico)"
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2), // Mejor que FLOAT
        allowNull: false,
        comment: "precioUnitario × cantidad"
    },
    aclaracion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
}, {
    sequelize,
    modelName: "DetallePedido",
    tableName: "detallepedidos",
    freezeTableName: true,
});
    return DetallePedido;
};