const { Rubro } = require('../models');

module.exports = {
  // Servicio para traer el árbol de categorías (Padres + Hijos)
  obtenerJerarquiaCompleta: async () => {
    try {
      const rubros = await Rubro.findAll({
        where: { 
          padreId: null, // Solo traemos las raíces (Cocina, Bebidas)
          activo: true   // Solo los activos
        },
        include: [
          {
            model: Rubro,
            as: 'subrubros', // El alias que definimos en el modelo
            where: { activo: true }, // Solo hijos activos
            required: false, // LEFT JOIN (trae al padre aunque no tenga hijos)
            attributes: ['id', 'denominacion'] // Solo lo que necesita el front
          }
        ],
        attributes: ['id', 'denominacion'],
        order: [['denominacion', 'ASC']] // Orden alfabético
      });
      return rubros;
    } catch (error) {
      throw error;
    }
  }
};