const rubroService = require('../services/rubroService');

module.exports = {
  listarJerarquia: async (req, res) => {
    try {
      // Delegamos la lógica al servicio
      const rubros = await rubroService.obtenerJerarquiaCompleta();
      
      // Respondemos al cliente
      res.status(200).json(rubros);
    } catch (error) {
      console.error('Error en rubroController:', error);
      res.status(500).json({ 
        message: 'Error al obtener la jerarquía de rubros',
        error: error.message 
      });
    }
  }
};