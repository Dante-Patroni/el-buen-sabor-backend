const jwt = require("jsonwebtoken");
const { manejarErrorHttp } = require("../controllers/errorMapper");

/**
 * @description Clave secreta usada para firmar/verificar JWT.
 */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definida en variables de entorno");
}

/**
 * @description Valida el JWT enviado en Authorization
 * y agrega el usuario decodificado a req.usuario.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {import("express").Response|void}
 */
const authMiddleware = (req, res, next) => {
    /**
     * Header esperado:
     * Authorization: Bearer TOKEN
     */
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return manejarErrorHttp(
            new Error("NO_AUTORIZADO"),
            res,
        );
    }

    /**
     * Extraer token removiendo Bearer.
     */
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        /**
         * Verificación criptográfica del JWT.
         */
        const decoded = jwt.verify(
            token,
            JWT_SECRET,
        );

        /**
         * Usuario autenticado disponible
         * para siguientes middlewares/controladores.
         */
        req.usuario = decoded;

        next();
    } catch (error) {
        return manejarErrorHttp(
            new Error("TOKEN_INVALIDO"),
            res,
        );
    }
};

module.exports = authMiddleware;