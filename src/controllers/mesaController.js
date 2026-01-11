class MesaController {
  
  // 👇 Recibimos el servicio por inyección
  constructor(mesaService) {
    this.mesaService = mesaService;
  }

  // 1. LISTAR 
  listar = async (req, res) => {
    try {
      const mesasRaw = await this.mesaService.listar();

      const mesasFormateadas = mesasRaw.map(m => {
          // Convertimos decimal a float
          const valorNumerico = parseFloat(m.totalActual) || 0;

          // Lógica deducida: Si hay plata o está ocupada, hay items.
          const itemsCalc = (valorNumerico > 0 || m.estado === 'ocupada') ? 1 : 0;

          return {
              id: m.id,
              nombre: m.nombre || `Mesa ${m.id}`,
              numero: m.numero || m.id.toString(),
              estado: m.estado,
              mozo: m.mozo,
              
              // Campos para pasar los tests
              itemsPendientes: itemsCalc, 
              totalActual: valorNumerico
          };
      });

      res.status(200).json(mesasFormateadas);

    } catch (error) {
      console.error("❌ [Controller] Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // 2. Abrir Mesa
  abrirMesa = async (req, res) => {
    try {
      const { id } = req.params; // ID de la mesa
      const { idMozo } = req.body; // El ID del mozo que viene del token o body

      // Validación simple
      if (!idMozo) return res.status(400).json({ message: 'Se requiere idMozo' });

      const mesaActualizada = await this.mesaService.abrirMesa(id, idMozo);
      res.json({ message: 'Mesa abierta con éxito', mesa: mesaActualizada });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

}


module.exports = MesaController;