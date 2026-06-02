// Simplified Expenses, Budgets, Goals, Debts, and Categories List Pages
// These follow the same pattern as Accounts and Incomes

// Expenses List Page
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiTrendingDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { expenseService } from '../../services/api/expenseService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { processChartData, calculateTotal } from '../../utils/chartHelpers';

export const ExpensesListPage = () => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['expenses'],
        queryFn: expenseService.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: expenseService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            queryClient.invalidateQueries(['categories']);
            queryClient.invalidateQueries(['accounts']);
            queryClient.invalidateQueries(['budgets']);
            toast.success('Gasto eliminado');
            setDeleteModal(null);
        },
        onError: () => toast.error('Error al eliminar'),
    });

    const expenses = data?.body || [];
    const totalExpenses = calculateTotal(expenses, 'expense_amount');
    const chartData = processChartData(expenses, 'createdAt', 'expense_amount');
    
    // Calculate stats
    const expenseCount = expenses.length;
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
    const highestExpense = expenses.length > 0 
        ? Math.max(...expenses.map(exp => parseFloat(exp.expense_amount) || 0))
        : 0;

    
    // Color palette for expenses
    const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-rose-500',
    ];

    const columns = [
        { key: 'expense_name', header: 'Nombre' },
        { key: 'expense_amount', header: 'Monto', render: (row) => formatCurrency(row.expense_amount) },
        { key: 'expense_date', header: 'Fecha', render: (row) => formatDate(row.expense_date) },
        { key: 'expense_description', header: 'Descripción' },
        {
            key: 'actions',
            header: 'Acciones',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link to={`/gastos/editar/${row.expense_id}`}>
                        <Button size="sm" variant="secondary"><FiEdit2 className="mr-1" /> Editar</Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={() => setDeleteModal(row)}>
                        <FiTrash2 className="mr-1" /> Eliminar
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Gastos"
                subtitle="Aquí está un resumen de tus gastos registrados"
                actionButton={
                    <Link to="/gastos/nuevo" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nuevo Gasto
                    </Link>
                }
                balanceInfo={{
                    label: "Total Gastos",
                    value: formatCurrency(totalExpenses),
                    status: `${expenseCount} registro${expenseCount !== 1 ? 's' : ''}`
                }}
                stats={[
                    {
                        label: "Total Gastado",
                        value: formatCurrency(totalExpenses),
                        subtitle: "Suma de todos los gastos"
                    },
                    {
                        label: "Cantidad",
                        value: expenseCount,
                        subtitle: "Gastos registrados"
                    },
                    {
                        label: "Promedio",
                        value: formatCurrency(averageExpense),
                        subtitle: "Por gasto"
                    },
                    {
                        label: "Más Alto",
                        value: formatCurrency(highestExpense),
                        subtitle: "Gasto máximo"
                    }
                ]}
            />

            {/* Gráfica de Gastos */}
            <LineChart 
                data={chartData}
                title={`Gastos de los Últimos 30 Días`}
                color="#ef4444"
                emptyMessage="No hay gastos registrados en los últimos 30 días"
            />


            {/* Expenses Grid */}
            {expenses.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiTrendingDown className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay gastos</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza registrando un nuevo gasto.</p>
                        <div className="mt-6">
                            <Link to="/gastos/nuevo">
                                <Button>
                                    <FiPlus className="mr-2" /> Nuevo Gasto
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {expenses.map((expense, index) => {
                        const amount = parseFloat(expense.expense_amount) || 0;
                        const colorClass = colors[index % colors.length];
                        
                        return (
                            <Card key={expense.expense_id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`${colorClass} p-3 rounded-lg`}>
                                            <FiTrendingDown className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                {expense.expense_name}
                                            </h3>
                                            {expense.expense_description && (
                                                <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary line-clamp-2">
                                                    {expense.expense_description}
                                                </p>
                                            )}
                                            <div className="mt-3">
                                                <div className="flex items-baseline">
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {formatCurrency(amount)}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">
                                                    {formatDate(expense.expense_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                    <Link to={`/gastos/editar/${expense.expense_id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">
                                            <FiEdit2 className="mr-1" /> Editar
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        onClick={() => setDeleteModal(expense)}
                                        className="flex-1"
                                    >
                                        <FiTrash2 className="mr-1" /> Eliminar
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar Gasto">
                <div className="space-y-4">
                    <p>¿Eliminar <strong>{deleteModal?.expense_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => deleteModal && deleteMutation.mutate(deleteModal.expense_id)} loading={deleteMutation.isPending}>Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



