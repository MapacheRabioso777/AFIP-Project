import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { expenseService } from '../../services/api/expenseService';
import { accountService } from '../../services/api/accountService';
import { categoryService } from '../../services/api/categoryService';
import { budgetService } from '../../services/api/budgetService';
import { expenseSchema } from '../../utils/validators';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const ExpenseFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data: accountsData } = useQuery({ queryKey: ['accounts'], queryFn: accountService.getAll });
    const { data: categoriesData } = useQuery({ queryKey: ['categories', 'expense'], queryFn: () => categoryService.getAll('expense') });
    const { data: budgetsData } = useQuery({ queryKey: ['budgets'], queryFn: budgetService.getAll });
    const { data, isLoading } = useQuery({ queryKey: ['expense', id], queryFn: () => expenseService.getById(id), enabled: isEdit });

    const mutation = useMutation({
        mutationFn: (values) => {
            const payload = {
                ...values,
                budget_FK: values.budget_FK === '' ? null : values.budget_FK,
                account_FK: values.account_FK === '' ? null : values.account_FK,
                category_FK: values.category_FK === '' ? null : values.category_FK,
            };
            return isEdit ? expenseService.update(id, payload) : expenseService.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['expenses']);
            queryClient.invalidateQueries(['categories']);
            queryClient.invalidateQueries(['accounts']);
            queryClient.invalidateQueries(['budgets']);
            toast.success(isEdit ? 'Gasto actualizado' : 'Gasto creado');
            navigate('/gastos');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Error al guardar';
            toast.error(errorMessage);
            console.error('Error creating/updating expense:', error);
        },
    });

    const accountOptions = [
        { value: '', label: 'Sin cuenta' },
        ...(accountsData?.body || []).map(a => ({ value: a.account_id, label: a.account_name }))
    ];
    const categoryOptions = (categoriesData?.body || []).map(c => ({ value: c.category_id, label: c.category_name }));
    const budgetOptions = [
        { value: '', label: 'Sin presupuesto' },
        ...(budgetsData?.body || []).map(b => ({ value: b.budget_id, label: b.budget_name }))
    ];

    const initialValues = {
        expense_name: data?.body?.expense_name || '',
        expense_amount: data?.body?.expense_amount || '',
        expense_description: data?.body?.expense_description || '',
        expense_date: data?.body?.expense_date ? new Date(data.body.expense_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        account_FK: data?.body?.account_FK || '',
        category_FK: data?.body?.category_FK || '',
        budget_FK: data?.body?.budget_FK || '',
        user_FK: user?.id || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-text-primary">{isEdit ? 'Editar Gasto' : 'Nuevo Gasto'}</h1>
            <Card>
                <Formik initialValues={initialValues} validationSchema={expenseSchema} onSubmit={mutation.mutate} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre" name="expense_name" value={values.expense_name} onChange={handleChange} onBlur={handleBlur} error={errors.expense_name} touched={touched.expense_name} required />
                            <Input label="Monto" name="expense_amount" type="number" value={values.expense_amount} onChange={handleChange} onBlur={handleBlur} error={errors.expense_amount} touched={touched.expense_amount} required />
                            <Input label="Descripción" name="expense_description" value={values.expense_description} onChange={handleChange} onBlur={handleBlur} />
                            <Input label="Fecha" name="expense_date" type="date" value={values.expense_date} onChange={handleChange} onBlur={handleBlur} required />
                            <Select label="Cuenta (Opcional)" name="account_FK" options={accountOptions} value={values.account_FK} onChange={handleChange} onBlur={handleBlur} error={errors.account_FK} touched={touched.account_FK} />
                            <Select label="Categoría" name="category_FK" options={categoryOptions} value={values.category_FK} onChange={handleChange} onBlur={handleBlur} error={errors.category_FK} touched={touched.category_FK} required />
                            <Select label="Presupuesto (Opcional)" name="budget_FK" options={budgetOptions} value={values.budget_FK} onChange={handleChange} onBlur={handleBlur} error={errors.budget_FK} touched={touched.budget_FK} />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/gastos')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



