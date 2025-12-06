'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. FORZAMOS el cambio de estructura usando SQL PURO (Infalible en MySQL)
    await queryInterface.sequelize.query(`
      ALTER TABLE Pedidos 
      MODIFY COLUMN estado ENUM('pendiente', 'en_preparacion', 'rechazado', 'entregado', 'pagado') 
      NOT NULL DEFAULT 'pendiente';
    `);

    // 2. REPARAMOS los datos corruptos
    // Todos los que quedaron con estado "" (vacío) es porque intentamos pagarlos.
    // Los forzamos a 'pagado' ahora que la columna lo permite.
    await queryInterface.sequelize.query(`
      UPDATE Pedidos 
      SET estado = 'pagado' 
      WHERE estado = '' OR estado IS NULL;
    `);
  },

  async down (queryInterface, Sequelize) {
    // Volver atrás (Cuidado: esto convertirá los 'pagado' en '' de nuevo)
    await queryInterface.sequelize.query(`
      ALTER TABLE Pedidos 
      MODIFY COLUMN estado ENUM('pendiente', 'en_preparacion', 'rechazado', 'entregado') 
      NOT NULL DEFAULT 'pendiente';
    `);
  }
};