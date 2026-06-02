import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const runMigration = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database');

    // Check if table already exists
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'income_assignments'
    `);

    if (tables.length > 0) {
      console.log('⚠️  Table income_assignments already exists');
      await connection.end();
      return;
    }

    // Create income_assignments table
    await connection.query(`
      CREATE TABLE income_assignments (
        assignment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        income_FK INT UNSIGNED NOT NULL,
        assignment_type VARCHAR(50) NOT NULL,
        target_id INT UNSIGNED NOT NULL,
        assigned_amount DECIMAL(10, 2) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        CONSTRAINT fk_income_assignment_income
          FOREIGN KEY (income_FK) 
          REFERENCES incomes (income_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ Created income_assignments table');
    console.log('✅ Migration completed successfully!');

    await connection.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
