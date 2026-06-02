import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';

// Auth pages
import { AuthPage } from '../pages/auth/AuthPage';

// Dashboard
import { Dashboard } from '../pages/Dashboard';

// Feature pages (will be created)
import { AccountsListPage } from '../pages/accounts/AccountsListPage';
import { AccountFormPage } from '../pages/accounts/AccountFormPage';
import { IncomesListPage } from '../pages/incomes/IncomesListPage';
import { IncomeFormPage } from '../pages/incomes/IncomeFormPage';
import { ExpensesListPage } from '../pages/expenses/ExpensesListPage';
import { ExpenseFormPage } from '../pages/expenses/ExpenseFormPage';
import { BudgetsListPage } from '../pages/budgets/BudgetsListPage';
import { BudgetFormPage } from '../pages/budgets/BudgetFormPage';
import { GoalsListPage } from '../pages/goals/GoalsListPage';
import { GoalFormPage } from '../pages/goals/GoalFormPage';
import { DebtsListPage } from '../pages/debts/DebtsListPage';
import { DebtFormPage } from '../pages/debts/DebtFormPage';
import { CategoriesListPage } from '../pages/categories/CategoriesListPage';
import { CategoryFormPage } from '../pages/categories/CategoryFormPage';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Navigate to="/dashboard" replace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Accounts */}
                <Route
                    path="/cuentas"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AccountsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cuentas/nueva"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AccountFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cuentas/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <AccountFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Incomes */}
                <Route
                    path="/ingresos"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <IncomesListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ingresos/nuevo"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <IncomeFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ingresos/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <IncomeFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Expenses */}
                <Route
                    path="/gastos"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ExpensesListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gastos/nuevo"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ExpenseFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gastos/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ExpenseFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Budgets */}
                <Route
                    path="/presupuestos"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <BudgetsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/presupuestos/nuevo"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <BudgetFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/presupuestos/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <BudgetFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Goals */}
                <Route
                    path="/metas"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <GoalsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/metas/nueva"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <GoalFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/metas/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <GoalFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Debts */}
                <Route
                    path="/deudas"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DebtsListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/deudas/nueva"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DebtFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/deudas/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DebtFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Categories */}
                <Route
                    path="/categorias"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CategoriesListPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categorias/nueva"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CategoryFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/categorias/editar/:id"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CategoryFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};



