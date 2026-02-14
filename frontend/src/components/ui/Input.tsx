import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;   // ✅ Add this line
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    return (
      <div className={`${widthClass} mb-4`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-3 py-2 bg-white border rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${widthClass} ${className}
          `}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;