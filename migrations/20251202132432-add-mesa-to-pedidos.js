'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregamos la columna 'mesa' a la tabla 'Pedidos'
    await queryInterface.addColumn('Pedidos', 'mesa', {
      type: Sequelize.STRING, // String para permitir "4", "4B" o "Barra"
      allowNull: true,        // Opcional por si es "Para llevar"
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pedidos', 'mesa');
  }
};
