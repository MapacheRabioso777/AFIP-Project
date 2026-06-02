export const Select = ({
    label,
    name,
    options,
    value,
    onChange,
    onBlur,
    error,
    touched,
    disabled = false,
    required = false,
    placeholder = 'Seleccionar...',
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={`input-field ${hasError ? 'input-error' : ''} ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hasError && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
};



