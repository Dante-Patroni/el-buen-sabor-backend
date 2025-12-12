const bcrypt = require('bcryptjs');

const passwordPlano = '1234';

// El '10' es el "Salt Round" (qué tan difícil es de romper)
bcrypt.hash(passwordPlano, 10, (err, hash) => {
    if (err) console.error(err);
    console.log('\n---------------------------------------------------');
    console.log('🔑 Tu contraseña "1234" transformada en HASH es:');
    console.log(hash); // <--- ESTO ES LO QUE COPIARÁS
    console.log('---------------------------------------------------\n');
});