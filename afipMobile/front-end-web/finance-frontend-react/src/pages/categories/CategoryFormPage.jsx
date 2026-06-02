import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/api/categoryService';
import { categorySchema } from '../../utils/validators';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const CategoryFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data, isLoading } = useQuery({ queryKey: ['category', id], queryFn: () => categoryService.getById(id), enabled: isEdit });
    const mutation = useMutation({
        mutationFn: (values) => isEdit ? categoryService.update(id, values) : categoryService.create(values),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success(isEdit ? 'Categoría actualizada' : 'Categoría creada');
            navigate('/categorias');
        },
    });

    const initialValues = {
        category_name: data?.body?.category_name || '',
        category_description: data?.body?.category_description || '',
    };

    if (isEdit && isLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</h1>
            <Card>
                <Formik initialValues={initialValues} validationSchema={categorySchema} onSubmit={mutation.mutate} enableReinitialize>
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            <Input label="Nombre" name="category_name" value={values.category_name} onChange={handleChange} onBlur={handleBlur} error={errors.category_name} touched={touched.category_name} required />
                            <Input label="Descripción" name="category_description" value={values.category_description} onChange={handleChange} onBlur={handleBlur} />
                            <div className="flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => navigate('/categorias')}>Cancelar</Button>
                                <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Actualizar' : 'Crear'}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};



