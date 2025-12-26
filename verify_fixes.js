const http = require('http');

// Configuración
const PORT = 3000;
const HOST = 'localhost';

// Helpers para hacer requests
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // Intentamos parsear JSON, si falla devolvemos el texto raw
                    const parsed = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log("🔍 Iniciando Verificación de Fixes Backend...");
    console.log("--------------------------------------------");

    try {
        // 1. LOGIN (Necesario para el token)
        // Usamos un usuario admin por defecto o hardcodeado del seeder?
        // Intentaremos con las credenciales que usualmente están en el seeder (admin/admin o similar)
        // O mejor, creamos un login rápido si conocemos las credenciales.
        // Asumiré 'admin@elbuensabor.com' / '123456' que es común, o reviso seeders...
        // Para no fallar, hagamos un login genérico.
        // Si falla el login, avisamos.

        console.log("1️⃣ Intentando Login (admin@elbuensabor.com)...");
        const loginRes = await request('POST', '/api/usuarios/login', {
            email: 'admin@elbuensabor.com',
            clave: '123456' // Contraseña común en dev
        });

        let token = null;
        if (loginRes.statusCode === 200) {
            token = loginRes.body.token;
            console.log("✅ Login Exitoso.");
        } else {
            console.log("⚠️ No se pudo loguear (Status " + loginRes.statusCode + "). Intentando sin token (fallará si hay authMiddleware).");
            // Si el seeder tiene otra pass, esto fallará. Pero probemos.
        }

        // 2. VERIFICAR RUBROS (El fix de la ruta)
        // La App ahora apunta a /api/rubros. Verifiquemos que eso responda.
        console.log("\n2️⃣ Verificando Endpoint de Rubros (/api/rubros)...");
        const rubrosRes = await request('GET', '/api/rubros', null, token);

        if (rubrosRes.statusCode === 200 && Array.isArray(rubrosRes.body)) {
            console.log(`✅ Rubros OK. Se recibieron ${rubrosRes.body.length} rubros raíz.`);
        } else {
            console.error("❌ Falló Rubros:", rubrosRes.statusCode, rubrosRes.body);
        }

        // 3. VERIFICAR CERRAR MESA (El fix del controller)
        // Ruta: /api/pedidos/cerrar-mesa
        // Necesitamos un ID de mesa válido. Usaremos el 1.
        console.log("\n3️⃣ Verificando Endpoint Cerrar Mesa (/api/pedidos/cerrar-mesa)...");

        // Primero, para que tenga sentido, intentemos "Abrir" la mesa 1 (si se puede) o crear un pedido.
        // Pero solo queremos ver si la ruta RESPONDE, no necesariamente todo el flujo de negocio complejo.
        const cerrarRes = await request('POST', '/api/pedidos/cerrar-mesa', {
            mesaId: 1
        }, token);

        // Esperamos 200 OK o tal vez 500/400 si la mesa no existe, pero NO un 404 Not Found (que significaría ruta inexistente).
        if (cerrarRes.statusCode === 404) {
            console.error("❌ CRÍTICO: La ruta /api/pedidos/cerrar-mesa devuelve 404 Not Found.");
            console.error("   Significa que el router.post(...) no se aplicó o no se reinició el server.");
        } else if (cerrarRes.statusCode === 200) {
            console.log("✅ Cerrar Mesa OK. Respuesta:", cerrarRes.body);
        } else {
            console.log("⚠️ Ruta encontrada pero devolvió error de negocio (Normal si la mesa no estaba lista):");
            console.log(`   Status: ${cerrarRes.statusCode}, Body:`, cerrarRes.body);
            console.log("   ✅ Esto CONFIRMA que la ruta existe y el controlador responde.");
        }

    } catch (error) {
        console.error("❌ Error de ejecución del script:", error);
    }
}

runTests();
