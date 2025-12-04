'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Borramos datos previos para evitar duplicados si corre dos veces
    await queryInterface.bulkDelete('Platos', null, {});

    await queryInterface.bulkInsert('Platos', [{
      id: 2, // Forzamos el ID para el Test
      nombre: 'Milanesa a la Napolitana',
      precio: 1500.00,
      // ⚠️ CORRECCIÓN 1: Usamos 'ingredientePrincipal' en vez de 'rubro'
      ingredientePrincipal: 'Carne', 
      // ⚠️ CORRECCIÓN 2: Tu columna se llama 'imagenPath', no 'imagenUrl'
      imagenPath: 'http://url-falsa.com/milanesa.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platos', null, {});
  }
};