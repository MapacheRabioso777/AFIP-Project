import sequelize from "./src/config/connect.db.js";
import dotenv from "dotenv";

dotenv.config();

async function verificarTablas() {
  try {
    console.log("\n[*] Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("[OK] Conexión exitosa\n");
    
    const [results] = await sequelize.query("SHOW TABLES");
    
    console.log("[INFO] TABLAS CREADAS EN LA BASE DE DATOS:");
    console.log("=====================================\n");
    
    if (results.length === 0) {
      console.log("[!] No se encontraron tablas.");
      console.log("[TIP] Ejecuta 'npm run dev' para crear las tablas automáticamente.\n");
    } else {
      results.forEach((row, index) => {
        const tableName = Object.values(row)[0];
        console.log(`  ${(index + 1).toString().padStart(2, ' ')}. ${tableName}`);
      });
      console.log(`\n[OK] Total de tablas creadas: ${results.length}\n`);
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("\n[ERROR] Error al verificar las tablas:");
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

verificarTablas();
