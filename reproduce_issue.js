const http = require('http');

// Configuración
const PORT = 3000;
const HOST = 'localhost';

// Helpers
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
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

async function runTest() {
    console.log("🔍 INICIANDO TEST DE INTEGRACIÓN: CERRAR MESA");

    try {
        // 1. LOGIN
        console.log("\n1️⃣ Login...");
        const loginRes = await request('POST', '/api/usuarios/login', {
            legajo: '1001',
            password: '1234'
        });

        if (loginRes.statusCode !== 200) {
            console.error("❌ Falló Login:", loginRes.statusCode, loginRes.body);
            return;
        }
        const token = loginRes.body.token;
        console.log("✅ Token Obtenido.");

        // 2. CREAR PEDIDO (Mesa 4 para que sea válido)
        console.log("\n2️⃣ Creando Pedido en Mesa 4...");
        const pedidoRes = await request('POST', '/api/pedidos', {
            mesa: "4", // Mesa existente en el seed
            productos: [{ platoId: 1, cantidad: 1 }]
        }, token);

        let pedidoId = null;
        if (pedidoRes.statusCode === 201 || pedidoRes.statusCode === 200) {
            pedidoId = pedidoRes.body.data ? pedidoRes.body.data.id : pedidoRes.body.id;
            console.log(`✅ Pedido Creado. ID: ${pedidoId}, Mesa: 4, Estado: pendiente`);
        } else {
            console.error("❌ Falló Crear Pedido:", pedidoRes.body);
            return;
        }

        // 3. CERRAR MESA 4
        console.log("\n3️⃣ Cerrando Mesa 4...");
        const cerrarRes = await request('POST', '/api/pedidos/cerrar-mesa', {
            mesaId: 4
        }, token);

        if (cerrarRes.statusCode === 200) {
            console.log("✅ Respuesta Backend: OK");
            console.log("   Payload:", cerrarRes.body);
        } else {
            console.error("❌ Fallo endpoint cerrar-mesa:", cerrarRes.statusCode, cerrarRes.body);
        }

        // 4. VERIFICAR ESTADO DEL PEDIDO (La prueba de fuego)
        console.log("\n4️⃣ Verificando si el pedido cambió a 'pagado'...");
        // Suponemos que hay un endpoint GET /api/pedidos que lista todo.
        // O mejor, consultamos la lista general.
        const listaRes = await request('GET', '/api/pedidos', null, token);

        if (listaRes.statusCode === 200 && Array.isArray(listaRes.body)) {
            const pedido = listaRes.body.find(p => p.id == pedidoId);
            if (pedido) {
                console.log("🔍 DETALLE DEL PEDIDO:", JSON.stringify(pedido, null, 2));
                console.log(`📊 ESTADO FINAL DEL PEDIDO ${pedidoId}: '${pedido.estado}'`);
                if (pedido.estado === 'pagado') {
                    console.log("✅ ÉXITO: El pedido se marcó como pagado.");
                } else {
                    console.log("❌ FALLO: El pedido sigue como", pedido.estado);
                }
            } else {
                console.error("❌ No encontré el pedido en la lista.");
            }
        }

    } catch (error) {
        console.error("❌ Error JS:", error);
    }
}

runTest();
