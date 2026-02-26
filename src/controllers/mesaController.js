const { manejarErrorHttp } = require("./errorMapper");

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

      const mesasFormateadas = mesasRaw.map((m) => {
        const valorNumerico = parseFloat(m.totalActual) || 0;
        const itemsCalc = valorNumerico > 0 || m.estado === "ocupada" ? 1 : 0;

        return {
          id: m.id,
          nombre: m.nombre || `Mesa ${m.id}`,
          numero: m.numero || m.id.toString(),
          estado: m.estado,
          mozo: m.mozo,
          itemsPendientes: itemsCalc,
          totalActual: valorNumerico,
        };
      });

      return res.status(200).json(mesasFormateadas);
    } catch (error) {
      console.error("[MesaController] listar:", error.message);
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // 2. ABRIR MESA
  // ---------------------------------------------------------
  abrirMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const { idMozo } = req.body;

      if (!idMozo) {
        throw new Error("MOZO_REQUERIDO");
      }

      const resultado = await this.mesaService.abrirMesa(id, idMozo);
      return res.status(200).json(resultado);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // ---------------------------------------------------------
  // 3. CERRAR MESA
  // ---------------------------------------------------------
  cerrarMesa = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.mesaService.cerrarMesa(id);

      return res.status(200).json({
        mensaje: "Mesa cerrada y cobrada exitosamente",
        ...resultado,
      });
    } catch (error) {
      console.error("[MesaController] cerrarMesa:", error.message);
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = MesaController;
