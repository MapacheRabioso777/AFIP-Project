import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiTrendingUp, FiTrendingDown, FiTarget, FiFlag, FiDollarSign } from 'react-icons/fi';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { LineChart } from '../components/charts/LineChart';
import { accountService } from '../services/api/accountService';
import { incomeService } from '../services/api/incomeService';
import { expenseService } from '../services/api/expenseService';
import { budgetService } from '../services/api/budgetService';
import { goalService } from '../services/api/goalService';
import { debtService } from '../services/api/debtService';
import { formatCurrency } from '../utils/formatters';
import { processChartData } from '../utils/chartHelpers';

export const Dashboard = () => {
    const { user } = useAuth();
    // Fetch data for dashboard
    const { data: accountsData } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAll,
    });

    const { data: incomesData } = useQuery({
        queryKey: ['incomes'],
        queryFn: incomeService.getAll,
    });

    const { data: expensesData } = useQuery({
        queryKey: ['expenses'],
        queryFn: expenseService.getAll,
    });

    const { data: budgetsData } = useQuery({
        queryKey: ['budgets'],
        queryFn: budgetService.getAll,
    });

    const { data: goalsData } = useQuery({
        queryKey: ['goals'],
        queryFn: goalService.getAll,
    });

    const { data: debtsData } = useQuery({
        queryKey: ['debts'],
        queryFn: debtService.getAll,
    });

    // Calculate totals
    const accounts = accountsData?.body || [];
    const incomes = incomesData?.body || [];
    const expenses = expensesData?.body || [];
    const budgets = budgetsData?.body || [];
    const goals = goalsData?.body || [];
    const debts = debtsData?.body || [];

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.account_balance || 0), 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + (parseFloat(inc.income_amount) || 0), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + (exp.expense_amount || 0), 0);
    const totalDebt = debts.reduce((sum, debt) => sum + (debt.debt_amount || 0), 0);

    // Process chart data
    const expenseChartData = processChartData(expenses, 'createdAt', 'expense_amount');
    const incomeChartData = processChartData(incomes, 'createdAt', 'income_amount');

    const stats = [
        {
            name: 'Saldo Total',
            value: formatCurrency(totalBalance),
            icon: FiCreditCard,
            color: 'bg-primary-500',
            link: '/cuentas',
        },
        {
            name: 'Ingresos Totales',
            value: formatCurrency(totalIncome),
            icon: FiTrendingUp,
            color: 'bg-success-500',
            link: '/ingresos',
        },
        {
            name: 'Gastos Totales',
            value: formatCurrency(totalExpense),
            icon: FiTrendingDown,
            color: 'bg-danger-500',
            link: '/gastos',
        },
        {
            name: 'Deudas Totales',
            value: formatCurrency(totalDebt),
            icon: FiDollarSign,
            color: 'bg-warning-500',
            link: '/deudas',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="mt-0 text-2xl md:text-3xl font-bold text-slate-900 dark:text-text-primary">Dashboard</h1>
                <p className="mt-1 text-slate-600 dark:text-text-secondary">Resumen de tus finanzas personales</p>
            </div>

            {/* Article 1: Welcome Banner and Stats */}
            <article className="space-y-6">
                {/* Welcome Banner with new blue gradient */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-primary-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2">¡Bienvenido de nuevo{user?.userName ? `, ${user.userName}` : ''}!</h2>
                            <p className="text-primary-100 mb-6 text-lg">
                                Aquí está un resumen de tu actividad financiera reciente
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/gastos/nuevo" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                                    + Nuevo Gasto
                                </Link>
                                <Link to="/ingresos/nuevo" className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-all duration-300 border-2 border-white/30 shadow-md hover:shadow-lg hover:scale-105">
                                    + Nuevo Ingreso
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-xl">
                                <p className="text-sm text-primary-100 mb-2 font-medium">Balance Neto</p>
                                <p className="text-4xl font-bold mb-2">{formatCurrency(totalIncome - totalExpense)}</p>
                                <p className="text-sm text-primary-100 mt-1">
                                    {totalIncome - totalExpense >= 0 ? '✓ Positivo' : '⚠ Negativo'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={stat.name} to={stat.link}>
                                <Card className="hover:shadow-primary-md hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-primary-500">
                                    <div className="flex items-center">
                                        <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-slate-600 dark:text-text-secondary">{stat.name}</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-text-primary">{stat.value}</p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </article>

            {/* Article 2: Charts */}
            <article className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Expenses Chart */}
                <LineChart
                    data={expenseChartData}
                    title="Gastos de los Últimos 30 Días"
                    color="#ef4444"
                    height={250}
                    emptyMessage="No hay gastos registrados"
                />

                {/* Incomes Chart */}
                <LineChart
                    data={incomeChartData}
                    title="Ingresos de los Últimos 30 Días"
                    color="#10b981"
                    height={250}
                    emptyMessage="No hay ingresos registrados"
                />
            </article>

            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Accounts */}
                <Card title="Cuentas">
                    <div className="space-y-3">
                        {accounts.length === 0 ? (
                            <p className="text-slate-500 dark:text-text-tertiary text-center py-4">No hay cuentas registradas</p>
                        ) : (
                            accounts.slice(0, 5).map((account) => (
                                <div key={account.account_id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg-secondary rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors duration-200">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-text-primary">{account.account_name}</p>
                                        <p className="text-sm text-slate-600 dark:text-text-secondary">{account.account_type}</p>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-text-primary">{formatCurrency(account.account_balance)}</p>
                                </div>
                            ))
                        )}
                        <Link to="/cuentas" className="block text-center text-primary-500 hover:text-primary-400 font-medium mt-4 transition-colors duration-200">
                            Ver todas las cuentas →
                        </Link>
                    </div>
                </Card>

                {/* Recent Goals */}
                <Card title="Metas Financieras">
                    <div className="space-y-3">
                        {goals.length === 0 ? (
                            <p className="text-slate-500 dark:text-text-tertiary text-center py-4">No hay metas registradas</p>
                        ) : (
                            goals.slice(0, 5).map((goal) => (
                                <div key={goal.goal_id} className="p-3 bg-gray-50 dark:bg-dark-bg-secondary rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors duration-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium text-slate-900 dark:text-text-primary">{goal.goal_name}</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-text-primary">{formatCurrency(goal.goal_amount)}</p>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-dark-bg-tertiary rounded-full h-2">
                                        <div className="bg-primary-500 h-2 rounded-full shadow-primary" style={{ width: '0%' }} />
                                    </div>
                                </div>
                            ))
                        )}
                        <Link to="/metas" className="block text-center text-primary-500 hover:text-primary-400 font-medium mt-4 transition-colors duration-200">
                            Ver todas las metas →
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Budgets Overview */}
            <Card title="Presupuestos">
                <div className="space-y-3">
                    {budgets.length === 0 ? (
                        <p className="text-slate-500 dark:text-text-tertiary text-center py-4">No hay presupuestos registrados</p>
                    ) : (
                        budgets.slice(0, 3).map((budget) => (
                            <div key={budget.budget_id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-bg-secondary rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors duration-200">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-text-primary">{budget.budget_name}</p>
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-text-primary">{formatCurrency(budget.budget_amount)}</p>
                            </div>
                        ))
                    )}
                    <Link to="/presupuestos" className="block text-center text-primary-500 hover:text-primary-400 font-medium mt-4 transition-colors duration-200">
                        Ver todos los presupuestos →
                    </Link>
                </div>
            </Card>
        </div>
    );
};



