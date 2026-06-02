-- Migration: Add category_FK to incomes table
-- 
-- This migration adds the category_FK column to the incomes table
-- to allow associating incomes with categories

ALTER TABLE `incomes` 
ADD COLUMN `category_FK` INT UNSIGNED NULL AFTER `account_FK`,
ADD CONSTRAINT `incomes_category_fk` 
  FOREIGN KEY (`category_FK`) 
  REFERENCES `categories` (`category_id`) 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;
