'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Redefinimos la columna 'estado' incluyendo 'pagado'
    await queryInterface.changeColumn('pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente', 
        'en_preparacion', 
        'rechazado', 
        'entregado', 
        'pagado' // 👈 AGREGAMOS ESTO
      ),
      allowNull: false,
      defaultValue: 'pendiente'
    });
  },

  async down (queryInterface, Sequelize) {
    // Si volvemos atrás, quitamos 'pagado'
    // CUIDADO: Esto podría fallar si hay datos con 'pagado', pero para dev sirve.
    await queryInterface.changeColumn('pedidos', 'estado', {
      type: Sequelize.ENUM(
        'pendiente', 
        'en_preparacion', 
        'rechazado', 
        'entregado'
      ),
      allowNull: false,
      defaultValue: 'pendiente'
    });
  }
};