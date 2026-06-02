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

    // Check if column already exists
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM incomes LIKE 'category_FK'
    `);

    if (columns.length > 0) {
      console.log('⚠️  Column category_FK already exists in incomes table');
      await connection.end();
      return;
    }

    // Add category_FK column
    await connection.query(`
      ALTER TABLE incomes 
      ADD COLUMN category_FK INT UNSIGNED NULL AFTER account_FK
    `);

    console.log('✅ Added category_FK column to incomes table');

    // Add foreign key constraint
    await connection.query(`
      ALTER TABLE incomes
      ADD CONSTRAINT incomes_category_fk 
      FOREIGN KEY (category_FK) 
      REFERENCES categories (category_id) 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    console.log('✅ Added foreign key constraint for category_FK');
    console.log('✅ Migration completed successfully!');

    await connection.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

runMigration();
