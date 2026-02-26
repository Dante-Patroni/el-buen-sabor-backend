const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Clave secreta para firmar (en produccion va en .env)
const JWT_SECRET = process.env.JWT_SECRET || "ClaveSecretaDante123";
const ROLES_VALIDOS = ["admin", "mozo", "cocinero", "cajero"];

class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  async login(legajo, passwordPlano) {
    // Normalizar entrada para evitar falsos negativos por espacios.
    const legajoNormalizado =
      typeof legajo === "string" ? legajo.trim() : "";
    const passwordNormalizada =
      typeof passwordPlano === "string" ? passwordPlano.trim() : "";

    if (!legajoNormalizado || !passwordNormalizada) {
      throw new Error("DATOS_INVALIDOS");
    }

    // Busqueda por legajo, no por id numerico.
    const usuario = await this.usuarioRepository.buscarPorLegajo(
      legajoNormalizado
    );

    if (!usuario) {
      throw new Error("USUARIO_NO_ENCONTRADO");
    }

    if (!usuario.activo) {
      throw new Error("USUARIO_INACTIVO");
    }

    const passwordValido = await this.usuarioRepository.compararPassword(
      passwordNormalizada,
      usuario.password
    );

    if (!passwordValido) {
      throw new Error("PASSWORD_INCORRECTA");
    }

    // El token guarda identidad y rol para autorizacion posterior.
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      status: 200,
      body: {
        mensaje: "Login exitoso",
        token,
        usuario: this._toPublicUser(usuario),
      },
    };
  }

  // --------------------------------------------------
  // ABM
  // --------------------------------------------------
  async listar(incluirInactivos = false) {
    const usuarios = await this.usuarioRepository.listar(incluirInactivos);
    return usuarios.map((usuario) => this._toPublicUser(usuario));
  }

  async obtenerPorId(id) {
    const usuarioId = this._parseId(id);
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new Error("USUARIO_NO_ENCONTRADO");
    }

    return this._toPublicUser(usuario);
  }

  async crear(datos) {
    // Crear usuario afecta datos persistentes: siempre transaccional.
    return await this.usuarioRepository.inTransaction(async (transaction) => {
      const datosValidados = await this._validarCreacion(datos, transaction);

      const nuevoUsuario = await this.usuarioRepository.crear(
        datosValidados,
        transaction
      );

      return this._toPublicUser(nuevoUsuario);
    });
  }

  async actualizar(id, datos) {
    const usuarioId = this._parseId(id);

    // Se valida existencia y duplicados en una misma transaccion.
    return await this.usuarioRepository.inTransaction(async (transaction) => {
      const usuario = await this.usuarioRepository.buscarPorId(
        usuarioId,
        transaction
      );

      if (!usuario) {
        throw new Error("USUARIO_NO_ENCONTRADO");
      }

      const datosActualizados = await this._validarActualizacion(
        usuarioId,
        datos,
        transaction
      );

      if (Object.keys(datosActualizados).length === 0) {
        throw new Error("DATOS_INVALIDOS");
      }

      await this.usuarioRepository.actualizar(
        usuarioId,
        datosActualizados,
        transaction
      );
      const actualizado = await this.usuarioRepository.buscarPorId(
        usuarioId,
        transaction
      );

      return this._toPublicUser(actualizado);
    });
  }

  async eliminar(id) {
    const usuarioId = this._parseId(id);

    // Baja logica: conserva historial y relaciones.
    return await this.usuarioRepository.inTransaction(async (transaction) => {
      const usuario = await this.usuarioRepository.buscarPorId(
        usuarioId,
        transaction
      );

      if (!usuario) {
        throw new Error("USUARIO_NO_ENCONTRADO");
      }

      if (!usuario.activo) {
        throw new Error("USUARIO_YA_INACTIVO");
      }

      await this.usuarioRepository.eliminarLogico(usuarioId, transaction);
      return true;
    });
  }

  // --------------------------------------------------
  // VALIDACIONES PRIVADAS
  // --------------------------------------------------
  _parseId(id) {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0) {
      throw new Error("DATOS_INVALIDOS");
    }

    return numero;
  }

  async _validarCreacion(datos, transaction) {
    // Normalizacion centralizada para no repetir trim en cada if.
    const nombre = this._normalizarTexto(datos?.nombre);
    const apellido = this._normalizarTexto(datos?.apellido);
    const legajo = this._normalizarTexto(datos?.legajo);
    const passwordPlano = this._normalizarTexto(datos?.password);
    const rol = this._normalizarRol(datos?.rol);
    const activo =
      datos?.activo === undefined ? true : this._normalizarActivo(datos.activo);

    if (!nombre) throw new Error("NOMBRE_REQUERIDO");
    if (!apellido) throw new Error("APELLIDO_REQUERIDO");
    if (!legajo) throw new Error("LEGAJO_REQUERIDO");
    if (!passwordPlano) throw new Error("PASSWORD_REQUERIDA");
    if (!rol) throw new Error("ROL_INVALIDO");

    const existente = await this.usuarioRepository.buscarPorLegajo(
      legajo,
      transaction
    );
    if (existente) {
      throw new Error("LEGAJO_YA_EXISTENTE");
    }

    // Nunca guardar password plano en BD.
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    return {
      nombre,
      apellido,
      legajo,
      password: passwordHash,
      rol,
      activo,
    };
  }

  async _validarActualizacion(id, datos, transaction) {
    if (!datos || typeof datos !== "object") {
      throw new Error("DATOS_INVALIDOS");
    }

    const datosActualizados = {};

    if (datos.nombre !== undefined) {
      const nombre = this._normalizarTexto(datos.nombre);
      if (!nombre) throw new Error("NOMBRE_REQUERIDO");
      datosActualizados.nombre = nombre;
    }

    if (datos.apellido !== undefined) {
      const apellido = this._normalizarTexto(datos.apellido);
      if (!apellido) throw new Error("APELLIDO_REQUERIDO");
      datosActualizados.apellido = apellido;
    }

    if (datos.legajo !== undefined) {
      const legajo = this._normalizarTexto(datos.legajo);
      if (!legajo) throw new Error("LEGAJO_REQUERIDO");

      const existente = await this.usuarioRepository.buscarPorLegajo(
        legajo,
        transaction
      );
      if (existente && existente.id !== id) {
        throw new Error("LEGAJO_YA_EXISTENTE");
      }

      datosActualizados.legajo = legajo;
    }

    if (datos.password !== undefined) {
      const passwordPlano = this._normalizarTexto(datos.password);
      if (!passwordPlano) throw new Error("PASSWORD_REQUERIDA");
      // Si cambia password, se vuelve a hashear.
      datosActualizados.password = await bcrypt.hash(passwordPlano, 10);
    }

    if (datos.rol !== undefined) {
      const rol = this._normalizarRol(datos.rol);
      if (!rol) throw new Error("ROL_INVALIDO");
      datosActualizados.rol = rol;
    }

    if (datos.activo !== undefined) {
      datosActualizados.activo = this._normalizarActivo(datos.activo);
    }

    return datosActualizados;
  }

  _normalizarTexto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
  }

  _normalizarRol(rol) {
    const valor = this._normalizarTexto(rol).toLowerCase();
    return ROLES_VALIDOS.includes(valor) ? valor : null;
  }

  _normalizarActivo(activo) {
    if (typeof activo !== "boolean") {
      throw new Error("DATOS_INVALIDOS");
    }

    return activo;
  }

  _toPublicUser(usuario) {
    // DTO publico: nunca exponer password hash.
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      legajo: usuario.legajo,
      rol: usuario.rol,
      activo: usuario.activo,
    };
  }
}

module.exports = UsuarioService;
