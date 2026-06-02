import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { accountService } from '../../services/api/accountService';
import { accountSchema } from '../../utils/validators';
import { ACCOUNT_TYPES, CURRENCIES } from '../../utils/constants';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const AccountFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    // Fetch account if editing
    const { data, isLoading } = useQuery({
        queryKey: ['account', id],
        queryFn: () => accountService.getById(id),
        enabled: isEdit,
    });

    // Create/Update mutation
    const mutation = useMutation({
        mutationFn: (values) => isEdit ? accountService.update(id, values) : accountService.create(values),
        onSuccess: () => {
            queryClient.invalidateQueries(['accounts']);
            toast.success(isEdit ? 'Cuenta actualizada' : 'Cuenta creada exitosamente');
            navigate('/cuentas');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error al guardar la cuenta');
        },
    });

    const initialValues = {
        account_name: data?.body?.account_name || '',
        account_type: data?.body?.account_type || '',
        account_balance: data?.body?.account_balance || 0,
        account_currency: data?.body?.account_currency || 'COP',
        user_FK: user?.id || '',
    };

    const handleSubmit = (values) => {
        mutation.mutate(values);
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-text-primary">
                    {isEdit ? 'Editar Cuenta' : 'Nueva Cuenta'}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-text-secondary">
                    {isEdit ? 'Modifica los datos de la cuenta' : 'Crea una nueva cuenta bancaria o financiera'}
                </p>
            </div>

            <Card>
                <Formik
                    initialValues={initialValues}
                    validationSchema={accountSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input
                                label="Nombre de la cuenta"
                                name="account_name"
                                placeholder="Mi cuenta de ahorros"
                                value={values.account_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.account_name}
                                touched={touched.account_name}
                                required
                            />

                            <Select
                                label="Tipo de cuenta"
                                name="account_type"
                                options={ACCOUNT_TYPES}
                                value={values.account_type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.account_type}
                                touched={touched.account_type}
                                required
                            />

                            <Input
                                label="Saldo inicial"
                                name="account_balance"
                                type="number"
                                placeholder="0"
                                value={values.account_balance}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.account_balance}
                                touched={touched.account_balance}
                                required
                            />

                            <Select
                                label="Moneda"
                                name="account_currency"
                                options={CURRENCIES}
                                value={values.account_currency}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.account_currency}
                                touched={touched.account_currency}
                            />

                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/cuentas')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    loading={mutation.isPending}
                                    disabled={mutation.isPending}
                                >
                                    {isEdit ? 'Actualizar' : 'Crear Cuenta'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



