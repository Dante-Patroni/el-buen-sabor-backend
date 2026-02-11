class MesaController {

  constructor(mesaService) {
    this.mesaService = mesaService;
  }

  // ---------------------------------------------------------
  // 1. LISTAR MESAS
  // ---------------------------------------------------------
  listar = async (req, res) => {
    try {
      const mesasRaw = await this.mesaService.listar();

      const mesasFormateadas = mesasRaw.map(m => {
        const valorNumerico = parseFloat(m.totalActual) || 0;

        const itemsCalc =
          (valorNumerico > 0 || m.estado === 'ocupada') ? 1 : 0;

        return {
          id: m.id,
          nombre: m.nombre || `Mesa ${m.id}`,
          numero: m.numero || m.id.toString(),
          estado: m.estado,
          mozo: m.mozo,
          itemsPendientes: itemsCalc,
          totalActual: valorNumerico
        };
      });

      res.status(200).json(mesasFormateadas);

    } catch (error) {
      console.error("❌ [MesaController] listar:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ---------------------------------------------------------
  // 2. ABRIR MESA
  // ---------------------------------------------------------
  abrirMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const { idMozo } = req.body;

      if (!idMozo) {
        return res.status(400).json({
          error: "ID_MOZO_REQUERIDO"
        });
      }

      const mesaActualizada =
        await this.mesaService.abrirMesa(id, idMozo);

      // Excluir mozo_id (campo de DB) y mantener solo mozoId (campo JS)
      const { mozo_id, ...mesaLimpia } = mesaActualizada.dataValues;

      res.status(200).json({
        message: 'Mesa abierta con éxito',
        mesa: mesaLimpia
      });


    } catch (error) {
      console.error("❌ [MesaController] abrirMesa:", error.message);
      res.status(500).json({ message: error.message });
    }
  };

  // ---------------------------------------------------------
  // 3. CERRAR MESA
  // ---------------------------------------------------------
  cerrarMesa = async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await this.mesaService.cerrarMesa(id);

      res.status(200).json({
        mensaje: "Mesa cerrada y cobrada exitosamente",
        ...resultado
      });

    } catch (error) {
      console.error("❌ [MesaController] cerrarMesa:", error.message);

      res.status(error.status || 500).json({
        error: error.message
      });
    }
  };

}

module.exports = MesaController;
