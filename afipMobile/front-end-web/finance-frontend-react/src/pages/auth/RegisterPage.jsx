import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import Particles from '../../components/effects/Particles';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            const result = await register({
                email: values.email,
                username: values.username,
                password: values.password,
            });

            if (result.success) {
                toast.success('¡Cuenta creada exitosamente!');
                navigate('/dashboard');
            } else {
                toast.error(result.error || 'Error al crear la cuenta');
            }
        } catch (error) {
            toast.error('Error al registrarse');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Animated Particles Background */}
            <div className="absolute inset-0 z-0">
                <Particles
                    particleCount={600}
                    particleSpread={20}
                    speed={0.2}
                    particleColors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2}
                    alphaParticles={true}
                    particleBaseSize={500}
                    sizeRandomness={1.5}
                    cameraDistance={25}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 z-0" />

            {/* Register Card */}
            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Logo and title */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-4 shadow-lg">
                            <img 
                                src="/logo.jpg" 
                                alt="Finance Manager Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Crear Cuenta
                        </h2>
                        <p className="mt-2 text-gray-600">Comienza a gestionar tus finanzas</p>
                    </div>

                    {/* Register form */}
                    <Formik
                        initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur }) => (
                            <Form className="space-y-6">
                                <Input
                                    label="Correo Electrónico"
                                    name="email"
                                    type="email"
                                    placeholder="Tu correo"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.email}
                                    touched={touched.email}
                                    required
                                />

                                <Input
                                    label="Nombre de Usuario"
                                    name="username"
                                    type="text"
                                    placeholder="Tu usuario"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.username}
                                    touched={touched.username}
                                    required
                                />

                                <Input
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.password}
                                    touched={touched.password}
                                    required
                                />

                                <Input
                                    label="Confirmar contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Crear Cuenta
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};



