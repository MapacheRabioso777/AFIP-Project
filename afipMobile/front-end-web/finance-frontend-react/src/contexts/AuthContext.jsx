import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            // Backend returns: { ok: true, status: 200, message: "...", id: ..., token: "..." }
            if (response.ok && response.token) {
                // Save token and user data
                localStorage.setItem('token', response.token);

                const userData = {
                    id: response.id,
                    email: email,
                    userName: response.userName,
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                return { success: true };
            }

            return { success: false, error: response.message || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);

            // Backend returns: { ok: true, status: 200, message: "...", id: ..., token: "..." }
            if (response.ok && response.token) {
                // Auto-login after registration
                localStorage.setItem('token', response.token);

                const newUser = {
                    id: response.id,
                    email: userData.email,
                    userName: response.userName,
                };

                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
                setIsAuthenticated(true);

                return { success: true };
            }

            return { success: false, error: response.message || 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};



