// Budgets, Goals, Debts, Categories - List & Form Pages Combined File Structure
// This creates all remaining CRUD pages efficiently

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiPieChart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/api/budgetService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { processChartData, calculateTotal } from '../../utils/chartHelpers';

export const BudgetsListPage = () => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);

    const { data, isLoading } = useQuery({ queryKey: ['budgets'], queryFn: budgetService.getAll });
    const deleteMutation = useMutation({
        mutationFn: budgetService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['budgets']);
            toast.success('Presupuesto eliminado');
            setDeleteModal(null);
        },
        onError: () => toast.error('Error al eliminar'),
    });

    const budgets = data?.body || [];
    const totalBudgets = calculateTotal(budgets, 'budget_amount');
    const chartData = processChartData(budgets, 'createdAt', 'budget_amount');
    
    // Calculate budget stats
    const totalSpent = budgets.reduce((sum, budget) => sum + (parseFloat(budget.budget_spent_amount) || 0), 0);
    const totalAvailable = totalBudgets - totalSpent;
    const usagePercentage = totalBudgets > 0 ? ((totalSpent / totalBudgets) * 100).toFixed(1) : 0;
    
    // Color palette for budget usage
    const getBudgetColor = (spent, total) => {
        const percentage = (spent / total) * 100;
        if (percentage === 0) return 'bg-dark-border';
        if (percentage < 50) return 'bg-green-500';
        if (percentage < 75) return 'bg-yellow-500';
        if (percentage < 90) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Presupuestos"
                subtitle="Aquí está un resumen de tus presupuestos y gastos"
                actionButton={
                    <Link to="/presupuestos/nuevo" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nuevo Presupuesto
                    </Link>
                }
                balanceInfo={{
                    label: "Total Disponible",
                    value: formatCurrency(totalAvailable),
                    status: `${usagePercentage}% usado`
                }}
                stats={[
                    {
                        label: "Total Asignado",
                        value: formatCurrency(totalBudgets),
                        subtitle: "Suma de presupuestos"
                    },
                    {
                        label: "Total Gastado",
                        value: formatCurrency(totalSpent),
                        subtitle: "Gastos realizados"
                    },
                    {
                        label: "Disponible",
                        value: formatCurrency(totalAvailable),
                        subtitle: "Por gastar"
                    },
                    {
                        label: "Uso",
                        value: `${usagePercentage}%`,
                        subtitle: "Del presupuesto"
                    }
                ]}
            />
            
            {/* Gráfica de Presupuestos */}
            <LineChart 
                data={chartData}
                title={`Presupuestos de los Últimos 30 Días`}
                color="#8b5cf6"
                emptyMessage="No hay presupuestos registrados en los últimos 30 días"
            />
            
            {/* Budgets Grid */}
            {budgets.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiPieChart className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay presupuestos</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza creando un nuevo presupuesto.</p>
                        <div className="mt-6">
                            <Link to="/presupuestos/nuevo">
                                <Button>
                                    <FiPlus className="mr-2" /> Nuevo Presupuesto
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {budgets.map((budget) => {
                        const totalAmount = parseFloat(budget.budget_amount) || 0;
                        const spentAmount = parseFloat(budget.budget_spent_amount) || 0;
                        const available = totalAmount - spentAmount;
                        const usagePercent = totalAmount > 0 ? (spentAmount / totalAmount) * 100 : 0;
                        const colorClass = getBudgetColor(spentAmount, totalAmount);
                        
                        return (
                            <Card key={budget.budget_id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`${colorClass} p-3 rounded-lg`}>
                                            <FiPieChart className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                {budget.budget_name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">
                                                Creado: {formatDate(budget.createdAt)}
                                            </p>
                                            <div className="mt-3">
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-text-primary">
                                                        {formatCurrency(totalAmount, budget.budget_currency)}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-slate-600 dark:text-text-secondary mb-1">
                                                        <span>Gastado: {formatCurrency(spentAmount)}</span>
                                                        <span>{usagePercent.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all ${colorClass}`}
                                                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">
                                                        Disponible: {formatCurrency(available)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                    <Link to={`/presupuestos/editar/${budget.budget_id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">
                                            <FiEdit2 className="mr-1" /> Editar
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        onClick={() => setDeleteModal(budget)}
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

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar Presupuesto">
                <div className="space-y-4">
                    <p>¿Eliminar <strong>{deleteModal?.budget_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => deleteModal && deleteMutation.mutate(deleteModal.budget_id)} loading={deleteMutation.isPending}>Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



