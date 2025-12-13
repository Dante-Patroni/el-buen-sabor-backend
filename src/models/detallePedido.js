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

    DetallePedido.init(
        {
            cantidad: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            subtotal: {
                type: DataTypes.FLOAT, // O DECIMAL(10,2)
                allowNull: false
            },
            // Sequelize crea automáticamente PedidoId y PlatoId, 
            // pero puedes declararlos explícitamente si quieres validaciones extra.
        },
        {
            sequelize,
            modelName: "DetallePedido",
            tableName: "DetallePedidos", // Forzar nombre de tabla si quieres
        }
    );

    return DetallePedido;
};