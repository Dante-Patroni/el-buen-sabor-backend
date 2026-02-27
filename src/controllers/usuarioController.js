const { manejarErrorHttp } = require("./errorMapper");

class UsuarioController {
  /**
   * @description Crea una instancia del controller de usuarios.
   * @param {import("../services/usuarioService")} usuarioService - Servicio de usuarios inyectado.
   */
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  /**
   * @description Ejecuta login y devuelve el contrato especial `{ status, body }` provisto por el service.
   * @param {import("express").Request} req - Request con `legajo` y `password`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Resultado de autenticacion con token JWT.
   * @throws {Error} `DATOS_INVALIDOS`, `USUARIO_NO_ENCONTRADO`, `USUARIO_INACTIVO`, `PASSWORD_INCORRECTA`.
   */
  login = async (req, res) => {
    try {
      const { legajo, password } = req.body;
      const resultado = await this.usuarioService.login(legajo, password);

      return res.status(resultado.status).json(resultado.body);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Lista usuarios activos o todos segun query param.
   * @param {import("express").Request} req - Request con query `incluirInactivos`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Lista de usuarios.
   * @throws {Error} Errores de capa service/repository.
   */
  listar = async (req, res) => {
    try {
      const incluirInactivos = req.query.incluirInactivos === "true";
      const usuarios = await this.usuarioService.listar(incluirInactivos);

      return res.status(200).json(usuarios);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Obtiene un usuario por id.
   * @param {import("express").Request} req - Request con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Usuario encontrado.
   * @throws {Error} `USUARIO_NO_ENCONTRADO` o `DATOS_INVALIDOS`.
   */
  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.obtenerPorId(id);

      return res.status(200).json(usuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Crea un usuario nuevo.
   * @param {import("express").Request} req - Request con payload del usuario.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Usuario creado.
   * @throws {Error} Codigos de validacion de datos y unicidad.
   */
  crear = async (req, res) => {
    try {
      const nuevoUsuario = await this.usuarioService.crear(req.body);
      return res.status(201).json(nuevoUsuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Actualiza un usuario existente por id.
   * @param {import("express").Request} req - Request con `params.id` y campos a actualizar.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Usuario actualizado.
   * @throws {Error} Codigos de dominio de validacion/existencia.
   */
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await this.usuarioService.actualizar(id, req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return manejarErrorHttp(error, res);
    }
  };

  /**
   * @description Realiza baja logica de un usuario por id.
   * @param {import("express").Request} req - Request con `params.id`.
   * @param {import("express").Response} res - Response HTTP.
   * @returns {Promise<import("express").Response>} Respuesta 204 sin contenido.
   * @throws {Error} `USUARIO_NO_ENCONTRADO`, `USUARIO_YA_INACTIVO` o `DATOS_INVALIDOS`.
   */
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
