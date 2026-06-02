export const Input = ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const hasError = error && touched;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field ${hasError ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {hasError && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
};



