'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Limpiamos para evitar conflictos
    await queryInterface.bulkDelete('Platos', null, {});

    await queryInterface.bulkInsert('Platos', [{
      id: 2, // Mantenemos el ID 2 porque es el que usa el Test
      nombre: 'Hamburguesa Clásica', // ✅ CORREGIDO
      precio: 1500.00,
      ingredientePrincipal: 'Carne',
      imagenPath: 'http://url-falsa.com/hamburguesa-clasica.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platos', null, {});
  }
};