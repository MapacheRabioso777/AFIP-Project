import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { accountService } from '../../services/api/accountService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { LineChart } from '../../components/charts/LineChart';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { processChartData, calculateTotal } from '../../utils/chartHelpers';
import { useAuth } from '../../hooks/useAuth';

export const AccountsListPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);

    // Fetch accounts
    const { data, isLoading, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAll,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: accountService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['accounts']);
            toast.success('Cuenta eliminada exitosamente');
            setDeleteModal(null);
        },
        onError: () => {
            toast.error('Error al eliminar la cuenta');
        },
    });

    const handleDelete = () => {
        if (deleteModal) {
            deleteMutation.mutate(deleteModal.account_id);
        }
    };

    const accounts = data?.body || [];
    const totalBalance = calculateTotal(accounts, 'account_balance');
    const chartData = processChartData(accounts, 'createdAt', 'account_balance');
    
    // Calculate account stats
    const accountCount = accounts.length;
    const averageBalance = accountCount > 0 ? totalBalance / accountCount : 0;
    const positiveAccounts = accounts.filter(acc => parseFloat(acc.account_balance) > 0).length;
    const accountTypes = [...new Set(accounts.map(acc => acc.account_type))].length;

    
    // Color palette for account types
    const accountTypeColors = {
        'Corriente': 'bg-blue-500',
        'Ahorros': 'bg-green-500',
        'Inversión': 'bg-purple-500',
        'Tarjeta de Crédito': 'bg-red-500',
        'Efectivo': 'bg-yellow-500',
    };

    const getAccountColor = (type) => {
        return accountTypeColors[type] || 'bg-primary-500';
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error al cargar las cuentas</div>;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Cuentas"
                subtitle="Aquí está un resumen de tus cuentas bancarias y financieras"
                actionButton={
                    <Link to="/cuentas/nueva" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nueva Cuenta
                    </Link>
                }
                balanceInfo={{
                    label: "Balance Total",
                    value: formatCurrency(totalBalance),
                    status: `${accountCount} cuenta${accountCount !== 1 ? 's' : ''}`
                }}
                stats={[
                    {
                        label: "Balance Total",
                        value: formatCurrency(totalBalance),
                        subtitle: "Suma de todas las cuentas"
                    },
                    {
                        label: "Total Cuentas",
                        value: accountCount,
                        subtitle: "Cuentas registradas"
                    },
                    {
                        label: "Promedio",
                        value: formatCurrency(averageBalance),
                        subtitle: "Por cuenta"
                    },
                    {
                        label: "Con Saldo",
                        value: positiveAccounts,
                        subtitle: "Cuentas activas"
                    }
                ]}
            />

            {/* Gráfica de Cuentas */}
            <LineChart 
                data={chartData}
                title={`Balance de Cuentas de los Últimos 30 Días`}
                color="#06b6d4"
                emptyMessage="No hay cuentas registradas en los últimos 30 días"
            />

            {/* Accounts Grid */}
            {accounts.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiCreditCard className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay cuentas</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza creando una nueva cuenta.</p>
                        <div className="mt-6">
                            <Link to="/cuentas/nueva">
                                <Button>
                                    <FiPlus className="mr-2" /> Nueva Cuenta
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {accounts.map((account) => {
                        const balance = parseFloat(account.account_balance) || 0;
                        const colorClass = getAccountColor(account.account_type);
                        const isPositive = balance >= 0;
                        
                        return (
                            <Card key={account.account_id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`${colorClass} p-3 rounded-lg`}>
                                            <FiCreditCard className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                {account.account_name}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">
                                                {account.account_type}
                                            </p>
                                            <div className="mt-3">
                                                <div className="flex items-baseline">
                                                    <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(balance, account.account_currency)}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">
                                                    Creada: {formatDate(account.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                    <Link to={`/cuentas/editar/${account.account_id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">
                                            <FiEdit2 className="mr-1" /> Editar
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="sm" 
                                        variant="danger" 
                                        onClick={() => setDeleteModal(account)}
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

            {/* Delete Modal */}
            <Modal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                title="Eliminar Cuenta"
                size="sm"
            >
                <div className="space-y-4">
                    <p>¿Estás seguro de que deseas eliminar la cuenta <strong>{deleteModal?.account_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={deleteMutation.isPending}
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



