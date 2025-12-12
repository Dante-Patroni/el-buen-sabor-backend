const usuarioService = require('../services/usuarioServices');

class UsuarioController {

    async login(req, res) {
        try {
            const { legajo, password } = req.body;

            // Delegamos la lógica al servicio (igual que hacías con el Adapter)
            const resultado = await usuarioService.login(legajo, password);

            if (!resultado.exito) {
                return res.status(resultado.status).json({ mensaje: resultado.mensaje });
            }

            return res.status(200).json({
                mensaje: resultado.mensaje,
                token: resultado.token,
                usuario: resultado.usuario
            });

        } catch (error) {
            console.error("Error en controller login:", error);
            res.status(500).json({ mensaje: 'Error del servidor' });
        }
    }
}

module.exports = new UsuarioController();