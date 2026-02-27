const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Clave secreta para firmar (en produccion va en .env)
const JWT_SECRET = process.env.JWT_SECRET || "ClaveSecretaDante123";
const ROLES_VALIDOS = ["admin", "mozo", "cocinero", "cajero"];

class UsuarioService {
  /**
   * @description Crea una instancia del servicio de usuarios.
   * @param {import("../repositories/usuarioRepository")} usuarioRepository - Repositorio de usuarios inyectado.
   */
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  /**
   * @description Autentica un usuario por legajo/password y devuelve token JWT.
   * @param {string} legajo - Legajo ingresado por el usuario.
   * @param {string} passwordPlano - Password ingresada en texto plano.
   * @returns {Promise<{status:number, body:{mensaje:string, token:string, usuario:object}}>} Resultado HTTP para controller.
   * @throws {Error} `DATOS_INVALIDOS`, `USUARIO_NO_ENCONTRADO`, `USUARIO_INACTIVO`, `PASSWORD_INCORRECTA`.
   */
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

  /**
   * @description Lista usuarios activos o incluyendo inactivos segun bandera.
   * @param {boolean} incluirInactivos - Cuando es `true`, incluye usuarios inactivos.
   * @returns {Promise<Array<object>>} Usuarios en formato publico.
   */
  async listar(incluirInactivos = false) {
    const usuarios = await this.usuarioRepository.listar(incluirInactivos);
    return usuarios.map((usuario) => this._toPublicUser(usuario));
  }

  /**
   * @description Obtiene un usuario por id y lo devuelve como DTO publico.
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise<object>} Usuario publico.
   * @throws {Error} `DATOS_INVALIDOS` o `USUARIO_NO_ENCONTRADO`.
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
   * @description Crea un usuario aplicando validaciones y hash de password dentro de una transaccion.
   * @param {object} datos - Payload de creacion.
   * @returns {Promise<object>} Usuario creado en formato publico.
   * @throws {Error} Codigos de validacion de dominio y unicidad de legajo.
   */
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

  /**
   * @description Actualiza un usuario existente dentro de una transaccion.
   * @param {number|string} id - Identificador del usuario.
   * @param {object} datos - Campos a actualizar.
   * @returns {Promise<object>} Usuario actualizado en formato publico.
   * @throws {Error} `DATOS_INVALIDOS`, `USUARIO_NO_ENCONTRADO`, `LEGAJO_YA_EXISTENTE` y validaciones.
   */
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

  /**
   * @description Realiza baja logica de un usuario (`activo=false`) de forma transaccional.
   * @param {number|string} id - Identificador del usuario.
   * @returns {Promise<boolean>} `true` cuando la baja logica se aplica correctamente.
   * @throws {Error} `DATOS_INVALIDOS`, `USUARIO_NO_ENCONTRADO`, `USUARIO_YA_INACTIVO`.
   */
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

  /**
   * @description Convierte y valida un id a entero positivo.
   * @param {number|string} id - Identificador a validar.
   * @returns {number} Id normalizado.
   * @throws {Error} `DATOS_INVALIDOS` cuando no es entero positivo.
   */
  _parseId(id) {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0) {
      throw new Error("DATOS_INVALIDOS");
    }

    return numero;
  }

  /**
   * @description Valida y normaliza datos de alta de usuario.
   * @param {object} datos - Payload recibido desde controller.
   * @param {object|null} transaction - Transaccion activa de Sequelize.
   * @returns {Promise<object>} Datos listos para persistir (incluye password hasheada).
   * @throws {Error} Codigos de validacion y conflicto de legajo.
   */
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

  /**
   * @description Valida y normaliza datos parciales para actualizacion de usuario.
   * @param {number} id - Id del usuario que se esta actualizando.
   * @param {object} datos - Campos de entrada a validar.
   * @param {object|null} transaction - Transaccion activa de Sequelize.
   * @returns {Promise<object>} Objeto parcial con solo campos validados.
   * @throws {Error} Codigos de validacion de dominio y conflicto de legajo.
   */
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

  /**
   * @description Normaliza un texto aplicando `trim`.
   * @param {unknown} valor - Valor a normalizar.
   * @returns {string} Texto sin espacios exteriores o cadena vacia si no es string.
   */
  _normalizarTexto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
  }

  /**
   * @description Normaliza y valida un rol contra el catalogo permitido.
   * @param {string} rol - Rol de entrada.
   * @returns {string|null} Rol normalizado en minuscula o `null` si es invalido.
   */
  _normalizarRol(rol) {
    const valor = this._normalizarTexto(rol).toLowerCase();
    return ROLES_VALIDOS.includes(valor) ? valor : null;
  }

  /**
   * @description Valida que el flag `activo` sea booleano.
   * @param {unknown} activo - Valor a validar.
   * @returns {boolean} Valor booleano de activo.
   * @throws {Error} `DATOS_INVALIDOS` cuando el tipo no es booleano.
   */
  _normalizarActivo(activo) {
    if (typeof activo !== "boolean") {
      throw new Error("DATOS_INVALIDOS");
    }

    return activo;
  }

  /**
   * @description Proyecta una entidad usuario al DTO publico sin exponer password.
   * @param {object} usuario - Entidad de usuario persistida.
   * @returns {{id:number,nombre:string,apellido:string,legajo:string,rol:string,activo:boolean}} DTO publico.
   */
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
