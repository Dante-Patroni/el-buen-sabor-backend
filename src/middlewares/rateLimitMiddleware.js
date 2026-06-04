// src/middlewares/rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

// ==========================================
// 🛡️ MENSAJES DE ERROR CONSISTENTES
// ==========================================
/**
 * Handler centralizado para cuando se supera el límite.
 * Devuelve el mismo formato que tu errorMapper existente.
 */
const handlerLimiteSuperado = (req, res) => {
    res.status(429).json({
        ok: false,
        msg: "Demasiados intentos. Por favor, esperá unos minutos e intentá de nuevo.",
    });
};

// ==========================================
// 🔒 LÍMITE ESTRICTO — Solo para /login
// ==========================================
/**
 * Protege contra ataques de fuerza bruta en el endpoint de autenticación.
 *
 * Lógica:
 * - Ventana de 15 minutos
 * - Máximo 10 intentos por IP en esa ventana
 * - Al superar: bloqueo hasta que expire la ventana
 *
 * Ejemplo: Un atacante que prueba contraseñas quedará bloqueado
 * tras 10 intentos fallidos durante 15 minutos.
 */
const limitadorLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,                   // máx. intentos por IP
    standardHeaders: "draft-7", // Envía RateLimit-* headers (estándar moderno)
    legacyHeaders: false,       // Deshabilita X-RateLimit-* headers viejos
    handler: handlerLimiteSuperado,

    // Identificar por IP. Si en el futuro usás proxy/nginx, activar:
    // keyGenerator: (req) => req.ip, // ya es el default
    // y agregar: app.set("trust proxy", 1) en app.js
});

// ==========================================
// 🌐 LÍMITE GLOBAL — Todas las rutas /api/*
// ==========================================
/**
 * Límite general como segunda capa de defensa.
 * Más permisivo, pensado para detectar scrapers o abusos masivos,
 * no para bloquear usuarios legítimos.
 *
 * Lógica:
 * - Ventana de 1 minuto
 * - Máximo 100 requests por IP
 */
const limitadorGlobal = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: handlerLimiteSuperado,
});

module.exports = { limitadorLogin, limitadorGlobal };
