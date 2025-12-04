module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insertar un plato de prueba
    await queryInterface.bulkInsert('Platos', [{
      id: 2, // Forzamos el ID 2 para que coincida con tu test
      nombre: 'Hamburguesa Doble',
      precio: 1500.00,
      rubro: 'Comida',
      imagenUrl: 'http://url-falsa.com/hamburguesa.jpg', // Ajusta según tu modelo
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    // Si deshacemos el seed, borramos todo
    await queryInterface.bulkDelete('Platos', null, {});
  }
};