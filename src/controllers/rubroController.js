const { manejarErrorHttp } = require("./errorMapper");
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
      return manejarErrorHttp(error, res);
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
      return manejarErrorHttp(error, res);
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
        mensaje: 'Rubro actualizado correctamente'
      });
    } catch (error) {
      return manejarErrorHttp(error, res);
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
      return manejarErrorHttp(error, res);
    }
  }
}

module.exports = RubroController;