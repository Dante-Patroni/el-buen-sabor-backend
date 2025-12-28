// Test automatizado de validaciones
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/pedidos';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sIjoiYWRtaW4iLCJub21icmUiOiJEYW50ZSIsImlhdCI6MTc2NjkzMzExNSwiZXhwIjoxNzY3MDE5NTE1fQ.YqG0RtE0I2Wskol1rcWznCzPqK9f2cbks-u8mDC6Iic';

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

async function runTests() {
    console.log('\n' + '='.repeat(70));
    console.log('EJECUTANDO TESTS DE VALIDACIÓN');
    console.log('='.repeat(70));

    // TEST 1: Pedido válido
    console.log('\n✅ TEST 1: Pedido VÁLIDO');
    console.log('-'.repeat(70));
    try {
        const response = await axios.post(BASE_URL, {
            mesa: "4",
            cliente: "Juan Pérez",
            productos: [
                { platoId: 1, cantidad: 2, aclaracion: "Sin sal" }
            ]
        }, { headers });
        console.log('✅ SUCCESS - Pedido creado:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ FAILED:', error.response?.data || error.message);
    }

    // TEST 2: platoId inválido (string)
    console.log('\n❌ TEST 2: platoId INVÁLIDO (string)');
    console.log('-'.repeat(70));
    try {
        const response = await axios.post(BASE_URL, {
            mesa: "4",
            productos: [
                { platoId: "abc", cantidad: 2 }
            ]
        }, { headers });
        console.log('❌ UNEXPECTED SUCCESS - Debería haber fallado');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('✅ EXPECTED ERROR - Validación funcionó:');
        console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    }

    // TEST 3: cantidad = 0
    console.log('\n❌ TEST 3: cantidad = 0');
    console.log('-'.repeat(70));
    try {
        const response = await axios.post(BASE_URL, {
            mesa: "4",
            productos: [
                { platoId: 1, cantidad: 0 }
            ]
        }, { headers });
        console.log('❌ UNEXPECTED SUCCESS - Debería haber fallado');
    } catch (error) {
        console.log('✅ EXPECTED ERROR - Validación funcionó:');
        console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    }

    // TEST 4: Array vacío
    console.log('\n❌ TEST 4: Array de productos vacío');
    console.log('-'.repeat(70));
    try {
        const response = await axios.post(BASE_URL, {
            mesa: "4",
            productos: []
        }, { headers });
        console.log('❌ UNEXPECTED SUCCESS - Debería haber fallado');
    } catch (error) {
        console.log('✅ EXPECTED ERROR - Validación funcionó:');
        console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    }

    // TEST 5: Sin mesa
    console.log('\n❌ TEST 5: Sin campo mesa');
    console.log('-'.repeat(70));
    try {
        const response = await axios.post(BASE_URL, {
            productos: [
                { platoId: 1, cantidad: 2 }
            ]
        }, { headers });
        console.log('❌ UNEXPECTED SUCCESS - Debería haber fallado');
    } catch (error) {
        console.log('✅ EXPECTED ERROR - Validación funcionó:');
        console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    }

    console.log('\n' + '='.repeat(70));
    console.log('TESTS COMPLETADOS');
    console.log('='.repeat(70) + '\n');
}

runTests().catch(console.error);
