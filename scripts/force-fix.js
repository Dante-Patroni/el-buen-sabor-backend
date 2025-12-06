// force-fix.js (Ubicado en la raíz del proyecto)

// 👇 CAMBIO IMPORTANTE: Apuntamos a ./src/models
const db = require('./src/models'); 

async function fixDatabase() {
  try {
    console.log("🚑 Conectando a la Base de Datos...");

    // 1. Corregir la estructura (ENUM)
    await db.sequelize.query(`
      ALTER TABLE Pedidos 
      MODIFY COLUMN estado ENUM('pendiente', 'en_preparacion', 'rechazado', 'entregado', 'pagado') 
      NOT NULL DEFAULT 'pendiente';
    `);
    console.log("✅ ENUM actualizado.");

    // 2. Corregir los datos vacíos
    await db.sequelize.query(`
      UPDATE Pedidos 
      SET estado = 'pagado' 
      WHERE estado = '' OR estado IS NULL;
    `);
    console.log("✅ Pedidos corregidos a 'pagado'.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixDatabase();