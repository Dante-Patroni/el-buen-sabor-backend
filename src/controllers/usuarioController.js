class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    login = async (req, res) => {
        try {
            const { legajo, password } = req.body;

            // Delegamos la lógica al servicio
            const resultado = await this.usuarioService.login(legajo, password);

            res.status(resultado.status).json(resultado.body);

        } catch (error) {
            console.error("Error en controller login:", error);
            manejarError(error, res);
        }
    }
}
// =========================
// MANEJO CENTRALIZADO DE ERRORES DE DOMINIO
// =========================
function manejarError(error, res) {

    const errores400 = [
        "LEGAJO_YA_EXISTENTE",
        "DATOS_INVALIDOS"
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

    console.error(error);
    return res.status(500).json({
        error: "ERROR_INTERNO"
    });
}


module.exports = UsuarioController;
