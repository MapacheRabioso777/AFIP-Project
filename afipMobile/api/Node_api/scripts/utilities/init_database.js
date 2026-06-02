import sequelize from "./src/config/connect.db.js";
import Role from "./src/models/role.model.js";
import UserStatus from "./src/models/userStatus.model.js";

/**
 * Script para inicializar datos básicos en la base de datos
 * Crea roles y estados de usuario necesarios para el funcionamiento de la aplicación
 */

const initializeDatabase = async () => {
  try {
    console.log('[*] Iniciando sincronización de base de datos...');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('[OK] Base de datos sincronizada');

    // ========== CREAR ROLES ==========
    console.log('\n[*] Creando roles...');
    
    const roles = [
      {
        role_name: 'admin',
        role_description: 'Administrador del sistema con todos los permisos'
      },
      {
        role_name: 'user',
        role_description: 'Usuario regular con permisos básicos'
      }
    ];

    for (const roleData of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { role_name: roleData.role_name },
        defaults: roleData
      });
      
      if (created) {
        console.log(`  [OK] Rol creado: ${role.role_name} (ID: ${role.role_id})`);
      } else {
        console.log(`  ℹ️  Rol ya existe: ${role.role_name} (ID: ${role.role_id})`);
      }
    }

    // ========== CREAR ESTADOS DE USUARIO ==========
    console.log('\n[*] Creando estados de usuario...');
    
    const userStatuses = [
      {
        userStatus_name: 'activo',
        userStatus_descripcion: 'Usuario activo y con acceso al sistema'
      },
      {
        userStatus_name: 'inactivo',
        userStatus_descripcion: 'Usuario inactivo temporalmente'
      },
      {
        userStatus_name: 'suspendido',
        userStatus_descripcion: 'Usuario suspendido por violación de políticas'
      }
    ];

    for (const statusData of userStatuses) {
      const [status, created] = await UserStatus.findOrCreate({
        where: { userStatus_name: statusData.userStatus_name },
        defaults: statusData
      });
      
      if (created) {
        console.log(`  [OK] Estado creado: ${status.userStatus_name} (ID: ${status.userStatus_id})`);
      } else {
        console.log(`  ℹ️  Estado ya existe: ${status.userStatus_name} (ID: ${status.userStatus_id})`);
      }
    }

    console.log('\n[OK] Inicialización completada exitosamente');
    console.log('\n[INFO] Resumen:');
    console.log(`   - Roles disponibles: ${roles.length}`);
    console.log(`   - Estados de usuario disponibles: ${userStatuses.length}`);
    console.log('\n[TIP] Ahora puedes crear usuarios con:');
    console.log('   - userStatus_FK: 1 (activo)');
    console.log('   - role_FK: 1 (admin) o 2 (user)');
    
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar la inicialización
initializeDatabase();
