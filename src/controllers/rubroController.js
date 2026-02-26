class RubroController {

  constructor(rubroService) {
    this.rubroService = rubroService;
  }

  // =========================
  // LISTAR JERARQUÍA
  // =========================
  listarJerarquia = async (req, res) => {
    try {
      const rubros = await this.rubroService.obtenerJerarquiaCompleta();
      res.status(200).json(rubros);
    } catch (error) {
      console.error('Error en rubroController:', error);
      res.status(500).json({
        message: 'Error al obtener la jerarquía de rubros',
        error: error.message
      });
    }
  }

  // =========================
  // CREAR RUBRO
  // =========================
  crear = async (req, res) => {
    try {
      const { denominacion, padreId } = req.body;

      const resultado = await this.rubroService.crear({
        denominacion,
        padreId
      });

      res.status(201).json(resultado);
    } catch (error) {
      manejarError(error, res);
    }
  }

  // =========================
  // ACTUALIZAR RUBRO
  // =========================
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const { denominacion, padreId } = req.body;

      await this.rubroService.actualizar(
        Number(id),
        { denominacion, padreId }
      );

      res.status(200).json({
        message: 'Rubro actualizado correctamente'
      });
    } catch (error) {
      manejarError(error, res);
    }
  }

  // =========================
  // ELIMINAR RUBRO
  // =========================
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;

      await this.rubroService.eliminar(Number(id));

      res.status(204).send();
    } catch (error) {
      manejarError(error, res);
    }
  }
}
// =========================
// MANEJO CENTRALIZADO DE ERRORES DE DOMINIO
// =========================
function manejarError(error, res) {

  const errores400 = [
    "DENOMINACION_REQUERIDA",
    "PADRE_INVALIDO",
    "NO_SE_PERMITE_TERCER_NIVEL",
    "RUBRO_YA_EXISTE",
    "RUBRO_INACTIVO",
    "RUBRO_YA_INACTIVO",
    "RUBRO_TIENE_SUBRUBROS",
    "RUBRO_TIENE_PLATOS"
  ];

  if (errores400.includes(error.message)) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "RUBRO_NO_EXISTE") {
    return res.status(404).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({
    error: "ERROR_INTERNO"
  });
}




module.exports = RubroController;