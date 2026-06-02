import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { debtService } from '../../services/api/debtService';
import { debtSchema } from '../../utils/validators';
import { DEBT_STATUSES, CURRENCIES } from '../../utils/constants';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const DebtFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data, isLoading } = useQuery({ queryKey: ['debt', id], queryFn: () => debtService.getById(id), enabled: isEdit });
    const mutation = useMutation({
        mutationFn: (values) => isEdit ? debtService.update(id, values) : debtService.create(values),
        onSuccess: () => {
            queryClient.invalidateQueries(['debts']);
            toast.success(isEdit ? 'Deuda actualizada' : 'Deuda creada');
            navigate('/deudas');
        },
    });

    const initialValues = {
        debt_name: data?.body?.debt_name || '',
        debt_amount: data?.body?.debt_amount || '',
        debt_currency: data?.body?.debt_currency || 'COP',
        debt_status: data?.body?.debt_status || 'pendiente',
        debt_description: data?.body?.debt_description || '',
        user_FK: user?.id || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{isEdit ? 'Editar Deuda' : 'Nueva Deuda'}</h1>
            <Card>
                <Formik initialValues={initialValues} validationSchema={debtSchema} onSubmit={mutation.mutate} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre" name="debt_name" value={values.debt_name} onChange={handleChange} onBlur={handleBlur} error={errors.debt_name} touched={touched.debt_name} required />
                            <Input label="Monto" name="debt_amount" type="number" value={values.debt_amount} onChange={handleChange} onBlur={handleBlur} error={errors.debt_amount} touched={touched.debt_amount} required />
                            <Select label="Moneda" name="debt_currency" options={CURRENCIES} value={values.debt_currency} onChange={handleChange} onBlur={handleBlur} />
                            <Select label="Estado" name="debt_status" options={DEBT_STATUSES} value={values.debt_status} onChange={handleChange} onBlur={handleBlur} />
                            <Input label="Descripción" name="debt_description" value={values.debt_description} onChange={handleChange} onBlur={handleBlur} />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/deudas')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



