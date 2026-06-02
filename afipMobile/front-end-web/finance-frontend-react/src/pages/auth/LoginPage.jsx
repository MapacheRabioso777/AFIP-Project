import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import Particles from '../../components/effects/Particles';
import toast from 'react-hot-toast';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            const result = await login(values.email, values.password);

            if (result.success) {
                toast.success('¡Bienvenido!');
                navigate('/dashboard');
            } else {
                toast.error(result.error || 'Credenciales inválidas');
            }
        } catch (error) {
            toast.error('Error al iniciar sesión');
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

            {/* Login Card */}
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
                            Iniciar Sesión
                        </h2>
                        <p className="mt-2 text-gray-600">Gestiona tus finanzas personales</p>
                    </div>

                    {/* Login form */}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
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

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Iniciar Sesión
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    {/* Register link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};



