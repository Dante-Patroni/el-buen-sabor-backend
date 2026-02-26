const { manejarErrorHttp } = require("./errorMapper");

class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  // Login mantiene contrato especial: el Service devuelve {status, body}.
  login = async (req, res) => {
    try {
      const { legajo, password } = req.body;
      const resultado = await this.usuarioService.login(legajo, password);

      return res.status(resultado.status).json(resultado.body);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // GET /usuarios?incluirInactivos=true
  listar = async (req, res) => {
    try {
      const incluirInactivos = req.query.incluirInactivos === "true";
      const usuarios = await this.usuarioService.listar(incluirInactivos);

      return res.status(200).json(usuarios);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // GET /usuarios/:id
  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.obtenerPorId(id);

      return res.status(200).json(usuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // POST /usuarios
  crear = async (req, res) => {
    try {
      const nuevoUsuario = await this.usuarioService.crear(req.body);
      return res.status(201).json(nuevoUsuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // PUT /usuarios/:id
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.actualizar(id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  // DELETE /usuarios/:id (baja logica)
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.usuarioService.eliminar(id);
      return res.status(204).send();
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };
}

module.exports = UsuarioController;
