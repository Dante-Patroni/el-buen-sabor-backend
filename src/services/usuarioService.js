const { body } = require('express-validator');
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar (En producción esto va en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'ClaveSecretaDante123';

class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async login(legajo, passwordPlano) {
        // 1. Buscamos al usuario por su legajo
        const usuario = await this.usuarioRepository.buscarUsuarioPorId(legajo);

        if (!usuario) {
            return {
                status: 404,
                body: { mensaje: "Usuario no encontrado" }
            }

        }

        // 👇 2. COMPARACIÓN SEGURA (EL CAMBIO CLAVE)

        const passwordValido = await this.usuarioRepository.compararPassword(passwordPlano, usuario.password);

        if (!passwordValido) {
            return {
                status: 401,
                body: { mensaje: "Contraseña incorrecta" }
            }

        }
        // 👇 2. AQUÍ GENERAMOS EL TOKEN
        // Guardamos datos útiles dentro del token (ID, Rol, Nombre)
        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol,
                nombre: usuario.nombre
            },
            JWT_SECRET,
            { expiresIn: '24h' } // El token vence en 24 horas
        );

        // 3. Login Exitoso Devolvemos usuario y Token
        return {
            status: 200,
            body: {
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: usuario.rol
                }
            }
        };


    }
}

module.exports = UsuarioService;

