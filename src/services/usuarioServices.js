const { Usuario } = require('../models');
// 👇 1. Importamos la librería de seguridad
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// Clave secreta para firmar (En producción esto va en .env)
const JWT_SECRET = process.env.JWT_SECRET;

class UsuarioService {

    async login(legajo, passwordPlano) {
        try {
            // 1. Buscamos al usuario por su legajo
            const usuario = await Usuario.findOne({ where: { legajo } });

            if (!usuario) {
                return { exito: false, mensaje: 'Usuario no encontrado', status: 404 };
            }

            // 👇 2. COMPARACIÓN SEGURA (EL CAMBIO CLAVE)
            // Usamos 'bcrypt.compare' para verificar si "1234" coincide con el Hash de la BD.
            // Es una operación asíncrona, así que lleva 'await'.
            const passwordValido = await bcrypt.compare(passwordPlano, usuario.password);

            if (!passwordValido) {
                return { exito: false, mensaje: 'Contraseña incorrecta', status: 401 };
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
                exito: true,
                mensaje: 'Login exitoso',
                status: 200,
                token: token, // <--- ¡La llave digital!
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: usuario.rol
                }
            };

        } catch (error) {
            console.error("Error en servicio login:", error);
            throw error;
        }
    }
}

module.exports = new UsuarioService();