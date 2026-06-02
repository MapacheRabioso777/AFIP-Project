export const Card = ({ children, title, className = '', ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {title && (
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-text-primary">{title}</h3>
            )}
            {children}
        </div>
    );
};



