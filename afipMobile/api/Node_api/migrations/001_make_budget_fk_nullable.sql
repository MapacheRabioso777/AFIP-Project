-- Migration: Make budget_FK nullable in expenses table
-- Date: 2025-12-14
-- Description: Allow expenses to be created without a budget

-- Hacer nullable la columna budget_FK
ALTER TABLE expenses 
MODIFY COLUMN budget_FK INT UNSIGNED NULL;

-- Verificar el cambio
DESCRIBE expenses;
