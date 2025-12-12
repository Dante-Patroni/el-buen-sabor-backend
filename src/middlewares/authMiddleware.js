const jwt = require('jsonwebtoken');

// ⚠️ IMPORTANTE: Debe ser la MISMA clave que usaste en usuarioServices.js
const JWT_SECRET = process.env.JWT_SECRET || 'ClaveSecretaDante123';

const authMiddleware = (req, res, next) => {
    // 1. Buscamos el token en la cabecera (Header)
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: '🛑 Acceso denegado: Falta Token' });
    }

    // 2. Limpiamos el prefijo "Bearer " si viene
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7, authHeader.length) 
        : authHeader;

    try {
        // 3. Verificamos la firma digital
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. ¡Pase usted! Guardamos quién es para que el controlador lo sepa
        req.usuario = decoded;
        next(); 

    } catch (error) {
        return res.status(401).json({ mensaje: '🛑 Token inválido o expirado' });
    }
};

module.exports = authMiddleware;