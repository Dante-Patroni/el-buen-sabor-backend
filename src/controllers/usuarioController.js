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
      console.error("Error en controller login:", error);
      return manejarError(error, res);
    }
  };

  // GET /usuarios?incluirInactivos=true
  listar = async (req, res) => {
    try {
      const incluirInactivos = req.query.incluirInactivos === "true";
      const usuarios = await this.usuarioService.listar(incluirInactivos);

      return res.status(200).json(usuarios);
    } catch (error) {
      return manejarError(error, res);
    }
  };

  // GET /usuarios/:id
  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.obtenerPorId(id);

      return res.status(200).json(usuario);
    } catch (error) {
      return manejarError(error, res);
    }
  };

  // POST /usuarios
  crear = async (req, res) => {
    try {
      const nuevoUsuario = await this.usuarioService.crear(req.body);
      return res.status(201).json(nuevoUsuario);
    } catch (error) {
      return manejarError(error, res);
    }
  };

  // PUT /usuarios/:id
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.actualizar(id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return manejarError(error, res);
    }
  };

  // DELETE /usuarios/:id (baja logica)
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.usuarioService.eliminar(id);
      return res.status(204).send();
    } catch (error) {
      return manejarError(error, res);
    }
  };
}

// ==========================================
// MANEJO CENTRALIZADO DE ERRORES DE DOMINIO
// ==========================================
function manejarError(error, res) {
  // Errores de validacion o reglas de entrada.
  const errores400 = [
    "DATOS_INVALIDOS",
    "NOMBRE_REQUERIDO",
    "APELLIDO_REQUERIDO",
    "LEGAJO_REQUERIDO",
    "PASSWORD_REQUERIDA",
    "ROL_INVALIDO",
    "USUARIO_YA_INACTIVO",
  ];

  if (errores400.includes(error.message)) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "USUARIO_NO_ENCONTRADO") {
    return res.status(404).json({ error: error.message });
  }

  if (error.message === "USUARIO_INACTIVO") {
    return res.status(403).json({ error: error.message });
  }

  if (error.message === "PASSWORD_INCORRECTA") {
    return res.status(401).json({ error: error.message });
  }

  if (error.message === "LEGAJO_YA_EXISTENTE") {
    return res.status(409).json({ error: error.message });
  }

  // Fallback para errores no mapeados.
  console.error(error);
  return res.status(500).json({ error: "ERROR_INTERNO" });
}

module.exports = UsuarioController;
