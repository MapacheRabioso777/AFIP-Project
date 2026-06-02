import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { incomeService } from '../../services/api/incomeService';
import { accountService } from '../../services/api/accountService';
import { debtService } from '../../services/api/debtService';
import { categoryService } from '../../services/api/categoryService';
import { budgetService } from '../../services/api/budgetService';
import { goalService } from '../../services/api/goalService';
import { incomeSchema } from '../../utils/validators';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const IncomeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data: accountsData } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAll,
    });

    const { data: debtsData } = useQuery({
        queryKey: ['debts'],
        queryFn: debtService.getAll,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ['categories', 'income'],
        queryFn: () => categoryService.getAll('income'),
    });


    const { data: budgetsData } = useQuery({
        queryKey: ['budgets'],
        queryFn: budgetService.getAll,
    });

    const { data: goalsData } = useQuery({
        queryKey: ['goals'],
        queryFn: goalService.getAll,
    });

    const { data, isLoading } = useQuery({
        queryKey: ['income', id],
        queryFn: () => incomeService.getById(id),
        enabled: isEdit,
    });

    const mutation = useMutation({
        mutationFn: (values) => {
            // Formatear los datos para el backend
            const formattedData = {
                income_name: values.income_name,
                income_amount: values.income_amount,
                income_description: values.income_description,
                income_date: values.income_date,
                account_FK: values.account_FK === '' ? null : values.account_FK,
                category_FK: values.category_id === '' ? null : values.category_id,
                assignments: []
            };

            // Usar el monto completo del ingreso para todas las asignaciones
            const incomeAmount = parseFloat(values.income_amount);

            // Agregar asignaciones si existen (usando el monto completo del ingreso)
            if (values.debt_id) {
                formattedData.assignments.push({
                    type: 'debt',
                    id: values.debt_id,
                    amount: incomeAmount
                });
            }

            if (values.budget_id) {
                formattedData.assignments.push({
                    type: 'budget',
                    id: values.budget_id,
                    amount: incomeAmount
                });
            }

            if (values.goal_id) {
                formattedData.assignments.push({
                    type: 'goal',
                    id: values.goal_id,
                    amount: incomeAmount
                });
            }

            return isEdit ? incomeService.update(id, formattedData) : incomeService.create(formattedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['incomes']);
            queryClient.invalidateQueries(['debts']);
            queryClient.invalidateQueries(['categories']);
            queryClient.invalidateQueries(['budgets']);
            queryClient.invalidateQueries(['goals']);
            queryClient.invalidateQueries(['accounts']);
            toast.success(isEdit ? 'Ingreso actualizado' : 'Ingreso creado exitosamente');
            navigate('/ingresos');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al guardar el ingreso');
        },
    });

    const accounts = accountsData?.body || [];
    const debts = debtsData?.body || [];
    const categories = categoriesData?.body || [];
    const budgets = budgetsData?.body || [];
    const goals = goalsData?.body || [];

    const accountOptions = [
        { value: '', label: 'Sin cuenta' },
        ...accounts.map(acc => ({
            value: acc.account_id,
            label: acc.account_name
        }))
    ];

    const debtOptions = [
        { value: '', label: 'Seleccionar...' },
        ...debts.map(debt => ({
            value: debt.debt_id,
            label: `${debt.debt_name} (Restante: $${debt.debt_remaining_amount || (debt.debt_amount - debt.debt_paid_amount)})`
        }))
    ];



    const categoryOptions = [
        { value: '', label: 'Seleccionar...' },
        ...categories.map(cat => ({
            value: cat.category_id,
            label: cat.category_name
        }))
    ];

    const budgetOptions = [
        { value: '', label: 'Seleccionar...' },
        ...budgets.map(budget => ({
            value: budget.budget_id,
            label: `${budget.budget_name} (Disponible: $${budget.budget_remaining_amount || (budget.budget_amount - budget.budget_spent_amount)})`
        }))
    ];

    const goalOptions = [
        { value: '', label: 'Seleccionar...' },
        ...goals.map(goal => ({
            value: goal.goal_id,
            label: `${goal.goal_name} (Progreso: ${goal.goal_progress_percentage || 0}%)`
        }))
    ];

    const initialValues = {
        income_name: data?.body?.income_name || '',
        income_amount: data?.body?.income_amount || '',
        income_description: data?.body?.income_description || '',
        income_date: data?.body?.income_date ? new Date(data.body.income_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        account_FK: data?.body?.account_FK || '',
        user_FK: user?.id || '',
        // Poblar campos de asignación desde el backend al editar
        debt_id: data?.body?.assignments?.find(a => a.type === 'debt')?.id || '',
        budget_id: data?.body?.assignments?.find(a => a.type === 'budget')?.id || '',
        goal_id: data?.body?.assignments?.find(a => a.type === 'goal')?.id || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-text-primary">{isEdit ? 'Editar Ingreso' : 'Nuevo Ingreso'}</h1>
            <Card>
                <Formik
                    initialValues={initialValues}
                    validationSchema={incomeSchema}
                    onSubmit={mutation.mutate}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre" name="income_name" value={values.income_name} onChange={handleChange} onBlur={handleBlur} error={errors.income_name} touched={touched.income_name} required />
                            <Input label="Monto" name="income_amount" type="number" step="0.01" value={values.income_amount} onChange={handleChange} onBlur={handleBlur} error={errors.income_amount} touched={touched.income_amount} required />
                            <Input label="Descripción" name="income_description" value={values.income_description} onChange={handleChange} onBlur={handleBlur} error={errors.income_description} touched={touched.income_description} />
                            <Input label="Fecha" name="income_date" type="date" value={values.income_date} onChange={handleChange} onBlur={handleBlur} error={errors.income_date} touched={touched.income_date} required />
                            <Select label="Cuenta (Opcional)" name="account_FK" options={accountOptions} value={values.account_FK} onChange={handleChange} onBlur={handleBlur} error={errors.account_FK} touched={touched.account_FK} />
                            <Select label="Categoría" name="category_id" options={categoryOptions} value={values.category_id} onChange={handleChange} onBlur={handleBlur} error={errors.category_id} touched={touched.category_id} required />
                            
                            
                            {/* Sección de Asignaciones Opcionales */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary mb-4">Asignar Ingreso (Opcional)</h3>
                                <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">Puedes asignar parte de este ingreso a deudas, presupuestos o metas.</p>
                                
                                {/* Pagar Deudas */}
                                <div className="space-y-3 mb-4">
                                    <Select 
                                        label="Deuda (se asignará el monto completo del ingreso)" 
                                        name="debt_id" 
                                        options={debtOptions} 
                                        value={values.debt_id} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Asignar a Presupuestos */}
                                <div className="space-y-3 mb-4">
                                    <Select 
                                        label="Presupuesto (se asignará el monto completo del ingreso)" 
                                        name="budget_id" 
                                        options={budgetOptions} 
                                        value={values.budget_id} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Asignar a Metas */}
                                <div className="space-y-3 mb-4">
                                    <Select 
                                        label="Meta (se asignará el monto completo del ingreso)" 
                                        name="goal_id" 
                                        options={goalOptions} 
                                        value={values.goal_id} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/ingresos')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



