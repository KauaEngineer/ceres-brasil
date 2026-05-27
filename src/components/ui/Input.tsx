import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, className = '', id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ceres-dark">
          {label}
        </label>
      )}
      <div className="relative mt-1.5">
        {icon && (
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ceres-muted"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-full border bg-white py-3 text-sm text-ceres-dark placeholder:text-ceres-muted focus:outline-none focus:ring-2 ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
              : 'border-ceres-sand-soft focus:border-ceres-terracotta-dark focus:ring-ceres-terracotta-dark/30'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
