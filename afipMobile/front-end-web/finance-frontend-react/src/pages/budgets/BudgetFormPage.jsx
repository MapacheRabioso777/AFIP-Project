import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/api/budgetService';
import { budgetSchema } from '../../utils/validators';
import { CURRENCIES } from '../../utils/constants';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const BudgetFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data, isLoading } = useQuery({ queryKey: ['budget', id], queryFn: () => budgetService.getById(id), enabled: isEdit });
    const mutation = useMutation({
        mutationFn: (values) => isEdit ? budgetService.update(id, values) : budgetService.create(values),
        onSuccess: () => {
            queryClient.invalidateQueries(['budgets']);
            toast.success(isEdit ? 'Presupuesto actualizado' : 'Presupuesto creado');
            navigate('/presupuestos');
        },
        onError: () => toast.error('Error al guardar'),
    });

    const initialValues = {
        budget_name: data?.body?.budget_name || '',
        budget_amount: data?.body?.budget_amount || '',
        budget_currency: data?.body?.budget_currency || 'COP',
        user_FK: user?.id || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-text-primary">{isEdit ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h1>
            <Card>
                <Formik initialValues={initialValues} validationSchema={budgetSchema} onSubmit={mutation.mutate} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre" name="budget_name" value={values.budget_name} onChange={handleChange} onBlur={handleBlur} error={errors.budget_name} touched={touched.budget_name} required />
                            <Input label="Monto" name="budget_amount" type="number" value={values.budget_amount} onChange={handleChange} onBlur={handleBlur} error={errors.budget_amount} touched={touched.budget_amount} required />
                            <Select label="Moneda" name="budget_currency" options={CURRENCIES} value={values.budget_currency} onChange={handleChange} onBlur={handleBlur} />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/presupuestos')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



