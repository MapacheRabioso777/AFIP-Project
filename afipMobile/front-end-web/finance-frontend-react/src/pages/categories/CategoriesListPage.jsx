import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/api/categoryService';
import { userService } from '../../services/api/userService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { SummaryBanner } from '../../components/common/SummaryBanner';
import { formatCurrency } from '../../utils/formatters';

export const CategoriesListPage = () => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll });
    
    const deleteMutation = useMutation({
        mutationFn: categoryService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Categoría eliminada');
            setDeleteModal(null);
        },
        onError: () => toast.error('No se puede eliminar - categoría en uso'),
    });

    const categories = data?.body || [];
    
    // Auto-inicializar categorías predefinidas si el usuario no tiene ninguna
    useEffect(() => {
        const initializeCategoriesIfNeeded = async () => {
            // Solo ejecutar cuando los datos se hayan cargado
            if (!isLoading && categories.length === 0 && !isInitializing) {
                try {
                    setIsInitializing(true);
                    console.log('[*] No hay categorías, inicializando automáticamente...');
                    const result = await userService.initializeCategories();
                    console.log('[OK] Categorías inicializadas:', result);
                    // Recargar las categorías
                    queryClient.invalidateQueries(['categories']);
                    toast.success('Categorías predefinidas creadas automáticamente');
                } catch (error) {
                    console.error('Error al inicializar categorías:', error);
                    // No mostrar error si el usuario ya tiene categorías
                    if (error.response?.status !== 200) {
                        toast.error('Error al crear categorías predefinidas');
                    }
                } finally {
                    setIsInitializing(false);
                }
            }
        };

        initializeCategoriesIfNeeded();
    }, [isLoading, categories.length, queryClient, isInitializing]);
    
    // Calculate category stats
    const totalAllocated = categories.reduce((sum, cat) => sum + (parseFloat(cat.category_allocated_amount) || 0), 0);

    // Color palette for categories
    const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-6">
            <SummaryBanner
                title="Categorías"
                subtitle="Aquí está un resumen de tus categorías"
                actionButton={
                    <Link to="/categorias/nueva" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                        + Nueva Categoría
                    </Link>
                }
                balanceInfo={{
                    label: "Total",
                    value: formatCurrency(totalAllocated),
                    status: `${categories.length} categoría${categories.length !== 1 ? 's' : ''}`
                }}
                stats={[
                    {
                        label: "Total Categorías",
                        value: categories.length,
                        subtitle: "Categorías creadas"
                    },
                    {
                        label: "Total General",
                        value: formatCurrency(totalAllocated),
                        subtitle: "Suma de todas las categorías"
                    },
                    {
                        label: "Promedio",
                        value: formatCurrency(categories.length > 0 ? totalAllocated / categories.length : 0),
                        subtitle: "Por categoría"
                    },
                    {
                        label: "Activas",
                        value: categories.filter(c => (parseFloat(c.category_allocated_amount) || 0) > 0).length,
                        subtitle: "Con movimientos"
                    }
                ]}
            />

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <FiTag className="mx-auto h-12 w-12 text-slate-500 dark:text-text-tertiary" />
                        <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-text-primary">No hay categorías</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">Comienza creando una nueva categoría.</p>
                        <div className="mt-6">
                            <Link to="/categorias/nueva">
                                <Button>
                                    <FiPlus className="mr-2" /> Nueva Categoría
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category, index) => {
                        const allocatedAmount = parseFloat(category.category_allocated_amount) || 0;
                        const colorClass = colors[index % colors.length];
                        
                        return (
                            <Card key={category.category_id} className="hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className={`${colorClass} p-3 rounded-lg`}>
                                                <FiTag className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary truncate">
                                                        {category.category_name}
                                                    </h3></div>
                                                {category.category_description && (
                                                    <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary line-clamp-2">
                                                        {category.category_description}
                                                    </p>
                                                )}
                                                <div className="mt-3">
                                                    <div className="flex items-baseline">
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-text-primary">
                                                            {formatCurrency(allocatedAmount)}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-text-tertiary mt-1">Total</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!category.category_is_predefined && (
                                        <div className="mt-4 flex space-x-2 pt-4 border-t border-dark-border">
                                            <Link to={`/categorias/editar/${category.category_id}`} className="flex-1">
                                                <Button size="sm" variant="secondary" className="w-full">
                                                    <FiEdit2 className="mr-1" /> Editar
                                                </Button>
                                            </Link>
                                            <Button 
                                                size="sm" 
                                                variant="danger" 
                                                onClick={() => setDeleteModal(category)}
                                                className="flex-1"
                                            >
                                                <FiTrash2 className="mr-1" /> Eliminar
                                            </Button>
                                        </div>
                                    )}
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar Categoría">
                <div className="space-y-4">
                    <p>¿Eliminar <strong>{deleteModal?.category_name}</strong>?</p>
                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => deleteModal && deleteMutation.mutate(deleteModal.category_id)} loading={deleteMutation.isPending}>Eliminar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};



