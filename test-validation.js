// Script de prueba para validaciones de pedido
const jwt = require('jsonwebtoken');

// Generar token de prueba con credenciales correctas
const JWT_SECRET = process.env.JWT_SECRET || 'ClaveSecretaDante123';
const token = jwt.sign(
    { id: 1, legajo: '1001', rol: 'mozo' },
    JWT_SECRET,
    { expiresIn: '2h' }
);

console.log('='.repeat(60));
console.log('TOKEN GENERADO (válido por 2 horas):');
console.log('='.repeat(60));
console.log(token);
console.log('\n');

// Guardar token en variable de entorno para los tests
console.log('Copia y pega este comando para guardar el token:');
console.log(`$token = "${token}"`);
console.log('\n');

console.log('='.repeat(60));
console.log('TESTS DE VALIDACIÓN');
console.log('='.repeat(60));

// Test 1: Pedido válido
console.log('\n✅ TEST 1: Pedido VÁLIDO (debe crear exitosamente)');
console.log('-'.repeat(60));
console.log('Invoke-RestMethod -Uri "http://localhost:3000/api/pedidos" -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body \'{"mesa":"4","cliente":"Juan Pérez","productos":[{"platoId":1,"cantidad":2,"aclaracion":"Sin sal"}]}\'');

// Test 2: platoId inválido (string)
console.log('\n❌ TEST 2: platoId INVÁLIDO (string en vez de número)');
console.log('-'.repeat(60));
console.log('Invoke-RestMethod -Uri "http://localhost:3000/api/pedidos" -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body \'{"mesa":"4","productos":[{"platoId":"abc","cantidad":2}]}\'');

// Test 3: cantidad = 0 (debe fallar)
console.log('\n❌ TEST 3: cantidad = 0 (debe ser al menos 1)');
console.log('-'.repeat(60));
console.log('Invoke-RestMethod -Uri "http://localhost:3000/api/pedidos" -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body \'{"mesa":"4","productos":[{"platoId":1,"cantidad":0}]}\'');

// Test 4: Sin productos (debe fallar)
console.log('\n❌ TEST 4: Sin productos (array vacío)');
console.log('-'.repeat(60));
console.log('Invoke-RestMethod -Uri "http://localhost:3000/api/pedidos" -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body \'{"mesa":"4","productos":[]}\'');

// Test 5: Sin mesa (debe fallar)
console.log('\n❌ TEST 5: Sin mesa (campo obligatorio)');
console.log('-'.repeat(60));
console.log('Invoke-RestMethod -Uri "http://localhost:3000/api/pedidos" -Method POST -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body \'{"productos":[{"platoId":1,"cantidad":2}]}\'');

console.log('\n' + '='.repeat(60));
