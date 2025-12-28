// Generar token válido usando la misma lógica del servicio
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ClaveSecretaDante123';

// Generar token con la misma estructura que usuarioServices.js
const token = jwt.sign(
    {
        id: 1,
        rol: 'mozo',
        nombre: 'Admin'  // Usar 'nombre' en vez de 'legajo' como en el servicio original
    },
    JWT_SECRET,
    { expiresIn: '24h' }
);

console.log('Token generado (válido por 24h):');
console.log(token);
console.log('\nGuardar en variable:');
console.log(`$token = "${token}"`);
