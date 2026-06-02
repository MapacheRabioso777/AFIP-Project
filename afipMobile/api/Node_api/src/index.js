import app from "./app/app.js";
import dotenv from "dotenv";
import modelsApp from "./config/models.app.js";

dotenv.config({ path: "../.env" });

// Función async para iniciar el servidor
(async () => {
  // Sincronizar las tablas con la base de datos
  await modelsApp(false); // ← IMPORTANTE: dejar en true al crear, luego cambiar a false

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '192.168.80.134:5173', () => {
    console.log(`Servidor conectado en http://192.168.80.134:5173:${PORT}`);
  });
})();



