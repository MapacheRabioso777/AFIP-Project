import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { goalService } from '../../services/api/goalService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { processChartData, calculateTotal } from '../../utils/chartHelpers';

export const GoalsListPage = () => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);

    const { data, isLoading } = useQuery({ queryKey: ['goals'], queryFn: goalService.getAll });
    const deleteMutation = useMutation({
        mutationFn: goalService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['goals']);
            toast.success('Meta eliminada');
            setDeleteModal(null);
        },
    });

    const goals = data?.body || [];
    const totalGoals = calculateTotal(goals, 'goal_amount');
    const chartData = processChartData(goals, 'createdAt', 'goal_amount');
    
    // Calculate goal stats
    const totalSaved = goals.reduce((sum, goal) => sum + (parseFloat(goal.goal_current_amount) || 0), 0);
    const totalRemaining = totalGoals - totalSaved;
    const averageProgress = goals.length > 0 
        ? (goals.reduce((sum, goal) => sum + (parseFloat(goal.goal_progress_percentage) || 0), 0) / goals.length).toFixed(1)
        : 0;
    
    
    // Color palette for goal progress
    const getGoalColor = (progress) => {
        if (progress === 0) return 'bg-dark-border';
        if (progress < 25) return 'bg-red-500';
        if (progress < 50) return 'bg-orange-500';
        if (progress < 75) return 'bg-yellow-500';
        if (progress < 100) return 'bg-blue-500';
        return 'bg-green-500';
    };

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Metas Financieras"
                subtitle="Aquí está un resumen de tus metas y su progreso"
                actionButton={
                    <Link to="/metas/nueva" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nueva Meta
                    </Link>
                }
                balanceInfo={{
                    label: "Progreso Promedio",
                    value: `${averageProgress}%`,
                    status: `${goals.length} meta${goals.length !== 1 ? 's' : ''}`
                }}
                stats={[
                    {
                        label: "Total Objetivo",
                        value: formatCurrency(totalGoals),
                        subtitle: "Suma de todas las metas"
                    },
                    {
                        label: "Total Ahorrado",
                        value: formatCurrency(totalSaved),
                        subtitle: "Progreso acumulado"
                    },
                    {
                        label: "Por Ahorrar",
                        value: formatCurrency(totalRemaining),
                        subtitle: "Falta para completar"
                    },
                    {
                        label: "Progreso Promedio",
                        value: `${averageProgress}%`,
                        subtitle: "De todas las metas"
                    }
                ]}
            />
            
            {/* Gráfica de Metas */}
            <LineChart 
                data={chartData}
                title={`Metas de los Últimos 30 Días`}
                color="#3b82f6"
                emptyMessage="No hay metas registradas en los últimos 30 días"
            />
            
            {/* Goals Grid */}
            {goals.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiTarget className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay metas</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza creando una nueva meta financiera.</p>
                        <div className="mt-6">
                            <Link to="/metas/nueva">
                                <Button>
                                    <FiPlus className="mr-2" /> Nueva Meta
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => {
                        const targetAmount = parseFloat(goal.goal_amount) || 0;
                        const currentAmount = parseFloat(goal.goal_current_amount) || 0;
                        const remaining = targetAmount - currentAmount;
                        const progress = parseFloat(goal.goal_progress_percentage) || 0;
                        const colorClass = getGoalColor(progress);
                        
                        return (
                            <Card key={goal.goal_id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`${colorClass} p-3 rounded-lg`}>
                                            <FiTarget className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                {goal.goal_name}
                                            </h3>
                                            {goal.goal_description && (
                                                <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary line-clamp-2">
                                                    {goal.goal_description}
                                                </p>
                                            )}
                                            <div className="mt-3">
                                                <div className="flex items-baseline justify-between">
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-text-primary">
                                                        {formatCurrency(targetAmount)}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-slate-600 dark:text-text-secondary mb-1">
                                                        <span>Ahorrado: {formatCurrency(currentAmount)}</span>
                                                        <span>{progress.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full transition-all ${colorClass}`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">
                                                        Falta: {formatCurrency(remaining)} • {formatDate(goal.goal_target_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                    <Link to={`/metas/editar/${goal.goal_id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">
                                            <FiEdit2 className="mr-1" /> Editar
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        onClick={() => setDeleteModal(goal)}
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

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar Meta">
                <div className="space-y-4">
                    <p>¿Eliminar <strong>{deleteModal?.goal_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => deleteModal && deleteMutation.mutate(deleteModal.goal_id)} loading={deleteMutation.isPending}>Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



