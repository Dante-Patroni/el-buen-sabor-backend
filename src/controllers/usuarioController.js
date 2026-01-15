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
            res.status(500).json({ mensaje: 'Error del servidor' });
        }
    }
}

module.exports = UsuarioController;