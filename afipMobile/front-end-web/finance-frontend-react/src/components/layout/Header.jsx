import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { FiLogOut, FiUser, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';

export const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-primary-500 shadow-primary rounded-b-2xl">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg text-white/90 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    >
                        <FiMenu size={24} />
                    </button>

                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/30 group-hover:ring-white/60 transition-all duration-200 shadow-lg">
                            <img
                                src="/logo.jpg"
                                alt="A.F.I.P Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block drop-shadow-md">
                            A.F.I.P
                        </span>
                    </Link>

                    {/* Right side - Theme toggle and user menu */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                            aria-label="Toggle theme"
                            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        >
                            {theme === 'dark' ? (
                                <FiSun className="h-5 w-5 text-yellow-300" />
                            ) : (
                                <FiMoon className="h-5 w-5 text-white" />
                            )}
                        </button>

                        {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/20"
                        >
                            <div className="w-9 h-9 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-md">
                                <FiUser size={18} />
                            </div>
                            <span className="text-sm font-medium text-white hidden sm:block">
                                {user?.email || 'Usuario'}
                            </span>
                        </button>

                        {/* Dropdown menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-border py-2 z-20 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg-tertiary">
                                        <p className="text-sm font-medium text-gray-900 dark:text-text-primary truncate">
                                            {user?.email}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-text-tertiary mt-1">A.F.I.P</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-900 dark:text-text-primary hover:bg-danger-500/10 flex items-center space-x-3 transition-all duration-200 group"
                                    >
                                        <FiLogOut className="text-danger-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Cerrar sesión</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </header>
    );
};



