const jwt = require("jsonwebtoken");

// Clave secreta para firmar (en produccion va en .env)
const JWT_SECRET = process.env.JWT_SECRET || "ClaveSecretaDante123";

class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async login(legajo, passwordPlano) {
        const legajoNormalizado =
            typeof legajo === "string" ? legajo.trim() : "";
        const passwordNormalizada =
            typeof passwordPlano === "string" ? passwordPlano.trim() : "";

        if (!legajoNormalizado || !passwordNormalizada) {
            throw new Error("DATOS_INVALIDOS");
        }

        const usuario =
            await this.usuarioRepository.buscarUsuarioPorId(legajoNormalizado);

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
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: usuario.rol,
                },
            },
        };
    }
}

module.exports = UsuarioService;
