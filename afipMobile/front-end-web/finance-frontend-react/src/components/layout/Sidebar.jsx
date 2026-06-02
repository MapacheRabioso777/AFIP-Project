import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiCreditCard,
    FiTrendingUp,
    FiTrendingDown,
    FiTarget,
    FiFlag,
    FiDollarSign,
    FiTag,
    FiX
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const menuSections = [
    {
        title: 'Finanzas',
        items: [
            { name: 'Dashboard', path: '/dashboard', icon: FiHome },
            { name: 'Cuentas', path: '/cuentas', icon: FiCreditCard },
            { name: 'Ingresos', path: '/ingresos', icon: FiTrendingUp },
            { name: 'Gastos', path: '/gastos', icon: FiTrendingDown },
        ]
    },
    {
        title: 'Planificación',
        items: [
            { name: 'Presupuestos', path: '/presupuestos', icon: FiTarget },
            { name: 'Metas', path: '/metas', icon: FiFlag },
        ]
    },
    {
        title: 'Gestión',
        items: [
            { name: 'Deudas', path: '/deudas', icon: FiDollarSign },
            { name: 'Categorías', path: '/categorias', icon: FiTag },
        ]
    }
];

export const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-12 left-0 z-50 h-[calc(100vh-3rem)] w-64 
          bg-white dark:bg-dark-bg-secondary 
          border-r border-blue-100 dark:border-dark-border 
          shadow-lg dark:shadow-none
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Mobile close button */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-blue-100 dark:border-dark-border">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-text-primary">Menú</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md text-slate-600 dark:text-text-secondary hover:bg-blue-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* User welcome section - Enhanced */}
                    <div className="p-6 border-b border-blue-100 dark:border-dark-border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-dark-bg-tertiary dark:to-dark-bg-secondary">
                        <div className="flex items-center space-x-4">
                            {/* Avatar with new blue colors */}
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-primary-400 dark:to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-blue-400/30 dark:ring-primary-500/50">
                                <span className="text-2xl font-bold text-white">
                                    {user?.email?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>

                            {/* User info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-blue-600 dark:text-primary-400 uppercase tracking-wide mb-1">
                                    Bienvenido
                                </p>
                                <h2 className="text-base font-bold text-slate-800 dark:text-white truncate">
                                    {user?.email || 'Usuario'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto pb-4 px-3 bg-gradient-to-b from-white to-blue-50/30 dark:from-dark-bg-secondary dark:to-dark-bg-secondary">
                        {menuSections.map((section, sectionIndex) => (
                            <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : 'mt-4'}>
                                {/* Section header */}
                                <h3 className="px-4 mb-2 text-xs font-semibold text-blue-600 dark:text-text-tertiary uppercase tracking-wider">
                                    {section.title}
                                </h3>

                                {/* Section items */}
                                <ul className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);

                                        return (
                                            <li key={item.path}>
                                                <Link
                                                    to={item.path}
                                                    onClick={onClose}
                                                    className={`
                                                        flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                                                        ${active
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-primary-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-primary-md'
                                                            : 'text-slate-600 dark:text-text-secondary hover:bg-blue-50 dark:hover:bg-dark-bg-tertiary hover:text-blue-700 dark:hover:text-text-primary'
                                                        }
                                                    `}
                                                >
                                                    <Icon
                                                        size={20}
                                                        className={`
                                                            transition-transform duration-200 
                                                            ${active ? '' : 'group-hover:scale-110'}
                                                        `}
                                                    />
                                                    <span className="font-medium">{item.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-blue-100 dark:border-dark-border bg-blue-50/50 dark:bg-transparent">
                        <p className="text-xs text-blue-600 dark:text-text-tertiary text-center font-medium">
                            Finance Manager v1.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};



