import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative rounded-2xl shadow-lg border ${sizeClasses[size]} w-full overflow-hidden transform transition-all duration-300 scale-100 bg-white border-gray-200 dark:bg-dark-surface dark:border-dark-border dark:shadow-dark-lg`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b bg-gray-100 border-gray-200 dark:bg-dark-bg-tertiary dark:border-dark-border">
                            {title && (
                                <h3 className="text-xl font-bold text-slate-900 dark:text-text-primary">{title}</h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-slate-600 dark:text-text-secondary hover:text-primary-500 transition-all duration-200 hover:scale-110 p-1 rounded-lg hover:bg-primary-500/10"
                                >
                                    <FiX size={24} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
};



