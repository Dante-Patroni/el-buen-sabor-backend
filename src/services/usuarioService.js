const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definida");
}

class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  /**
   * @description Autentica un usuario por legajo/password y devuelve token JWT con permisos.
   */
  async login(legajo, passwordPlano) {
    const legajoNormalizado =
      typeof legajo === "string" ? legajo.trim() : "";
    const passwordNormalizada =
      typeof passwordPlano === "string" ? passwordPlano.trim() : "";

    if (!legajoNormalizado || !passwordNormalizada) {
      throw new Error("DATOS_INVALIDOS");
    }

    const usuario = await this.usuarioRepository.buscarPorLegajo(
      legajoNormalizado
    );
    console.log("LOGIN:", legajoNormalizado);
    console.log("USUARIO:", usuario);

    if (!usuario) {
      throw new Error("CREDENCIALES_INVALIDAS");
    }

    if (!usuario.activo) {
      throw new Error("CREDENCIALES_INVALIDAS");
    }

    const passwordValido = await this.usuarioRepository.compararPassword(
      passwordNormalizada,
      usuario.password
    );

    if (!passwordValido) {
      throw new Error("PASSWORD_INCORRECTA");
    }

    // Extraer codigos de permisos del rol cargado.
    const permisos = usuario.rol?.permisos?.map((p) => p.codigo) ?? [];

    // JWT incluye identidad, rol y permisos para autorización posterior.
    const token = jwt.sign(
      {
        sub: usuario.id,
        rolId: usuario.rolId,
        rol: usuario.rol?.nombre,
        permisos,
        nombre: usuario.nombre,
      },
      
      JWT_SECRET,
      { expiresIn: "8h" }
      
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

  /**
   * @description Lista usuarios activos o incluyendo inactivos según bandera.
   */
  async listar(incluirInactivos = false) {
    const usuarios = await this.usuarioRepository.listar(incluirInactivos);
    return usuarios.map((u) => this._toPublicUser(u));
  }

  /**
   * @description Obtiene un usuario por id.
   */
  async obtenerPorId(id) {
    const usuarioId = this._parseId(id);
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new Error("USUARIO_NO_ENCONTRADO");
    }

    return this._toPublicUser(usuario);
  }

  /**
   * @description Crea un usuario dentro de una transaccion.
   */
  async crear(datos) {
    return await this.usuarioRepository.inTransaction(async (transaction) => {
      const datosValidados = await this._validarCreacion(datos, transaction);
      const nuevoUsuario = await this.usuarioRepository.crear(
        datosValidados,
        transaction
      );
      return this._toPublicUser(nuevoUsuario);
    });
  }

  /**
   * @description Actualiza un usuario dentro de una transaccion.
   */
  async actualizar(id, datos) {
    const usuarioId = this._parseId(id);

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

  /**
   * @description Baja lógica de usuario.
   */
  async eliminar(id) {
    const usuarioId = this._parseId(id);

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

  // ==========================================
  // HELPERS PRIVADOS
  // ==========================================

  _parseId(id) {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0) {
      throw new Error("DATOS_INVALIDOS");
    }
    return numero;
  }

  async _validarCreacion(datos, transaction) {
    const nombre = this._normalizarTexto(datos?.nombre);
    const apellido = this._normalizarTexto(datos?.apellido);
    const legajo = this._normalizarTexto(datos?.legajo);
    const passwordPlano = this._normalizarTexto(datos?.password);
    const rolId = this._normalizarRolId(datos?.rolId);
    const activo =
      datos?.activo === undefined ? true : this._normalizarActivo(datos.activo);

    if (!nombre) throw new Error("NOMBRE_REQUERIDO");
    if (!apellido) throw new Error("APELLIDO_REQUERIDO");
    if (!legajo) throw new Error("LEGAJO_REQUERIDO");
    if (!passwordPlano) throw new Error("PASSWORD_REQUERIDA");
    if (!rolId) throw new Error("ROL_INVALIDO");

    const existente = await this.usuarioRepository.buscarPorLegajo(
      legajo,
      transaction
    );
    if (existente) throw new Error("LEGAJO_YA_EXISTENTE");

    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    return { nombre, apellido, legajo, password: passwordHash, rolId, activo };
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
      if (existente && existente.id !== id) throw new Error("LEGAJO_YA_EXISTENTE");

      datosActualizados.legajo = legajo;
    }

    if (datos.password !== undefined) {
      const passwordPlano = this._normalizarTexto(datos.password);
      if (!passwordPlano) throw new Error("PASSWORD_REQUERIDA");
      datosActualizados.password = await bcrypt.hash(passwordPlano, 10);
    }

    if (datos.rolId !== undefined) {
      const rolId = this._normalizarRolId(datos.rolId);
      if (!rolId) throw new Error("ROL_INVALIDO");
      datosActualizados.rolId = rolId;
    }

    if (datos.activo !== undefined) {
      datosActualizados.activo = this._normalizarActivo(datos.activo);
    }

    return datosActualizados;
  }

  _normalizarTexto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
  }

  /**
   * @description Valida que rolId sea un entero positivo.
   */
  _normalizarRolId(rolId) {
    const numero = Number(rolId);
    return Number.isInteger(numero) && numero > 0 ? numero : null;
  }

  _normalizarActivo(activo) {
    if (typeof activo !== "boolean") {
      throw new Error("DATOS_INVALIDOS");
    }
    return activo;
  }

  /**
   * @description DTO público — nunca expone password.
   */
  _toPublicUser(usuario) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      legajo: usuario.legajo,
      rolId: usuario.rolId,
      rol: usuario.rol?.nombre ?? null,
      permisos: usuario.rol?.permisos?.map((p) => p.codigo) ?? [],
      activo: usuario.activo,
    };
  }
}

module.exports = UsuarioService;