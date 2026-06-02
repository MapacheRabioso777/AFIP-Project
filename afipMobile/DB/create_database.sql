-- =============================================
-- Base de datos: node_project_api
-- Generado a partir de los modelos Sequelize
-- =============================================

DROP DATABASE IF EXISTS node_project_api;
CREATE DATABASE node_project_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE node_project_api;

-- ========== USERS ==========
CREATE TABLE users (
    user_id CHAR(36) NOT NULL,
    user_user VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== ACCOUNTS ==========
CREATE TABLE accounts (
    account_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_balance INT NOT NULL DEFAULT 0,
    account_currency VARCHAR(255) DEFAULT 'COP',
    user_FK CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (account_id),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== CATEGORIES ==========
CREATE TABLE categories (
    category_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    category_description VARCHAR(255) DEFAULT NULL,
    category_type ENUM('income', 'expense') NOT NULL DEFAULT 'expense',
    category_allocated_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category_is_predefined TINYINT(1) NOT NULL DEFAULT 0,
    user_FK CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id),
    UNIQUE KEY unique_category_per_user_and_type (user_FK, category_name, category_type),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== BUDGETS ==========
CREATE TABLE budgets (
    budget_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    budget_name VARCHAR(255) NOT NULL,
    budget_amount INT NOT NULL,
    budget_currency VARCHAR(255) DEFAULT 'COP',
    budget_spent_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    user_FK CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (budget_id),
    UNIQUE KEY unique_budget_per_user (user_FK, budget_name),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== EXPENSES ==========
CREATE TABLE expenses (
    expense_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    expense_name VARCHAR(255) NOT NULL,
    expense_amount INT NOT NULL,
    expense_description VARCHAR(255) DEFAULT NULL,
    expense_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_FK CHAR(36) NOT NULL,
    category_FK INT UNSIGNED NOT NULL,
    account_FK INT UNSIGNED NOT NULL,
    budget_FK INT UNSIGNED DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (expense_id),
    UNIQUE KEY unique_expense_per_user (user_FK, expense_name),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_FK) REFERENCES categories(category_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (account_FK) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (budget_FK) REFERENCES budgets(budget_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== INCOMES ==========
CREATE TABLE incomes (
    income_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    income_name VARCHAR(255) NOT NULL,
    income_amount DECIMAL(10, 2) NOT NULL,
    income_description VARCHAR(255) DEFAULT NULL,
    income_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_FK CHAR(36) NOT NULL,
    account_FK INT UNSIGNED NOT NULL,
    category_FK INT UNSIGNED DEFAULT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (income_id),
    UNIQUE KEY unique_income_per_user (user_FK, income_name),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (account_FK) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_FK) REFERENCES categories(category_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== INCOME ASSIGNMENTS ==========
CREATE TABLE income_assignments (
    assignment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    income_FK INT UNSIGNED NOT NULL,
    assignment_type ENUM('debt', 'budget', 'goal', 'category') NOT NULL,
    target_id INT UNSIGNED NOT NULL COMMENT 'ID of the assigned entity (debt_id, budget_id, goal_id, or category_id)',
    assigned_amount DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (assignment_id),
    FOREIGN KEY (income_FK) REFERENCES incomes(income_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== GOALS ==========
CREATE TABLE goals (
    goal_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    goal_name VARCHAR(255) NOT NULL,
    goal_amount DECIMAL(10, 2) NOT NULL,
    goal_target_date DATETIME NOT NULL,
    goal_description VARCHAR(255) DEFAULT NULL,
    goal_current_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    user_FK CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (goal_id),
    UNIQUE KEY unique_goal_per_user (user_FK, goal_name),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== DEBTS ==========
CREATE TABLE debts (
    debt_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    debt_name VARCHAR(255) NOT NULL,
    debt_amount INT NOT NULL,
    debt_currency VARCHAR(255) DEFAULT 'COP',
    debt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    debt_status VARCHAR(255) DEFAULT 'pendiente',
    debt_description VARCHAR(255) DEFAULT NULL,
    debt_paid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    user_FK CHAR(36) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (debt_id),
    UNIQUE KEY unique_debt_per_user (user_FK, debt_name),
    FOREIGN KEY (user_FK) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== DEBT PAYMENTS ==========
CREATE TABLE debtPayments (
    debtPayment_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    debtPayment_amount INT DEFAULT NULL,
    debtPayment_date DATETIME DEFAULT NULL,
    debtPayment_description VARCHAR(255) DEFAULT NULL,
    debt_FK INT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (debtPayment_id),
    FOREIGN KEY (debt_FK) REFERENCES debts(debt_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
