'use strict';

async function resolverNombreTablaUsuarios(queryInterface) {
  const tablas = await queryInterface.showAllTables();

  const nombres = tablas.map((tabla) => {
    if (typeof tabla === 'string') return tabla;
    if (tabla?.tableName) return tabla.tableName;
    if (tabla?.table_name) return tabla.table_name;
    return '';
  });

  return nombres.find((nombre) => nombre.toLowerCase() === 'usuarios') || null;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const nombreTabla = await resolverNombreTablaUsuarios(queryInterface);
    if (!nombreTabla) return;

    const tableInfo = await queryInterface.describeTable(nombreTabla);

    if (!tableInfo.activo) {
      await queryInterface.addColumn(nombreTabla, 'activo', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface) {
    const nombreTabla = await resolverNombreTablaUsuarios(queryInterface);
    if (!nombreTabla) return;

    const tableInfo = await queryInterface.describeTable(nombreTabla);

    if (tableInfo.activo) {
      await queryInterface.removeColumn(nombreTabla, 'activo');
    }
  },
};
