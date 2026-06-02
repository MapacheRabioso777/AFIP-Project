import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { goalService } from '../../services/api/goalService';
import { goalSchema } from '../../utils/validators';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

export const GoalFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data, isLoading } = useQuery({ queryKey: ['goal', id], queryFn: () => goalService.getById(id), enabled: isEdit });
    const mutation = useMutation({
        mutationFn: (values) => isEdit ? goalService.update(id, values) : goalService.create(values),
        onSuccess: () => {
            queryClient.invalidateQueries(['goals']);
            toast.success(isEdit ? 'Meta actualizada' : 'Meta creada');
            navigate('/metas');
        },
    });

    const initialValues = {
        goal_name: data?.body?.goal_name || '',
        goal_amount: data?.body?.goal_amount || '',
        goal_target_date: data?.body?.goal_target_date ? new Date(data.body.goal_target_date).toISOString().slice(0, 10) : '',
        goal_description: data?.body?.goal_description || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{isEdit ? 'Editar Meta' : 'Nueva Meta'}</h1>
            <Card>
                <Formik initialValues={initialValues} validationSchema={goalSchema} onSubmit={mutation.mutate} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre de la Meta" name="goal_name" value={values.goal_name} onChange={handleChange} onBlur={handleBlur} error={errors.goal_name} touched={touched.goal_name} required />
                            <Input label="Monto Objetivo" name="goal_amount" type="number" step="0.01" value={values.goal_amount} onChange={handleChange} onBlur={handleBlur} error={errors.goal_amount} touched={touched.goal_amount} required />
                            <Input label="Fecha Objetivo" name="goal_target_date" type="date" value={values.goal_target_date} onChange={handleChange} onBlur={handleBlur} error={errors.goal_target_date} touched={touched.goal_target_date} required />
                            <Input label="Descripción" name="goal_description" value={values.goal_description} onChange={handleChange} onBlur={handleBlur} />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/metas')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



