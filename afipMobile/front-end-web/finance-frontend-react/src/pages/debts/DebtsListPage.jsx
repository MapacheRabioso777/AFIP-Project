import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { debtService } from '../../services/api/debtService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { processChartData, calculateTotal } from '../../utils/chartHelpers';

export const DebtsListPage = () => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);

    const { data, isLoading } = useQuery({ queryKey: ['debts'], queryFn: debtService.getAll });
    const deleteMutation = useMutation({
        mutationFn: debtService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['debts']);
            toast.success('Deuda eliminada');
            setDeleteModal(null);
        },
    });

    const debts = data?.body || [];
    const totalDebts = calculateTotal(debts, 'debt_amount');
    const chartData = processChartData(debts, 'createdAt', 'debt_amount');
    
    // Calculate debt stats
    const totalPaid = debts.reduce((sum, debt) => sum + (parseFloat(debt.debt_paid_amount) || 0), 0);
    const totalRemaining = totalDebts - totalPaid;
    const paymentProgress = totalDebts > 0 ? ((totalPaid / totalDebts) * 100).toFixed(1) : 0;
    
    
    // Color palette for debt status
    const getDebtColor = (paidAmount, totalAmount) => {
        const percentage = (paidAmount / totalAmount) * 100;
        if (percentage === 0) return 'bg-red-500';
        if (percentage < 50) return 'bg-orange-500';
        if (percentage < 100) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Deudas"
                subtitle="Aquí está un resumen de tus deudas y su progreso de pago"
                actionButton={
                    <Link to="/deudas/nueva" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nueva Deuda
                    </Link>
                }
                balanceInfo={{
                    label: "Total Pendiente",
                    value: formatCurrency(totalRemaining),
                    status: `${paymentProgress}% pagado`
                }}
                stats={[
                    {
                        label: "Total Adeudado",
                        value: formatCurrency(totalDebts),
                        subtitle: "Suma de todas las deudas"
                    },
                    {
                        label: "Total Pagado",
                        value: formatCurrency(totalPaid),
                        subtitle: "Pagos realizados"
                    },
                    {
                        label: "Pendiente",
                        value: formatCurrency(totalRemaining),
                        subtitle: "Por pagar"
                    },
                    {
                        label: "Progreso",
                        value: `${paymentProgress}%`,
                        subtitle: "Deuda pagada"
                    }
                ]}
            />
            
            {/* Gráfica de Deudas */}
            <LineChart 
                data={chartData}
                title={`Deudas de los Últimos 30 Días`}
                color="#f59e0b"
                emptyMessage="No hay deudas registradas en los últimos 30 días"
            />
            
            {/* Debts Grid */}
            {debts.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiDollarSign className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay deudas</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza registrando una nueva deuda.</p>
                        <div className="mt-6">
                            <Link to="/deudas/nueva">
                                <Button>
                                    <FiPlus className="mr-2" /> Nueva Deuda
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {debts.map((debt) => {
                        const totalAmount = parseFloat(debt.debt_amount) || 0;
                        const paidAmount = parseFloat(debt.debt_paid_amount) || 0;
                        const remaining = totalAmount - paidAmount;
                        const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
                        const colorClass = getDebtColor(paidAmount, totalAmount);
                        
                        return (
                            <Card key={debt.debt_id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`${colorClass} p-3 rounded-lg`}>
                                            <FiDollarSign className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                {debt.debt_name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">
                                                {debt.debt_status}
                                            </p>
                                            <div className="mt-3">
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-text-primary">
                                                        {formatCurrency(totalAmount, debt.debt_currency)}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-slate-600 dark:text-text-secondary mb-1">
                                                        <span>Pagado: {formatCurrency(paidAmount)}</span>
                                                        <span>{progress.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all ${colorClass}`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">
                                                        Restante: {formatCurrency(remaining)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                    <Link to={`/deudas/editar/${debt.debt_id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">
                                            <FiEdit2 className="mr-1" /> Editar
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        onClick={() => setDeleteModal(debt)}
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

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar Deuda">
                <div className="space-y-4">
                    <p>¿Eliminar <strong>{deleteModal?.debt_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => deleteModal && deleteMutation.mutate(deleteModal.debt_id)} loading={deleteMutation.isPending}>Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



