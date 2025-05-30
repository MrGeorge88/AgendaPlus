import React from 'react';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className,
  description
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  className, 
  error, 
  ...props 
}) => {
  return (
    <input
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    />
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  className, 
  error, 
  ...props 
}) => {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors resize-vertical',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  className, 
  error, 
  options,
  placeholder,
  ...props 
}) => {
  return (
    <select
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
          : 'border-slate-300 hover:border-slate-400',
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  className, 
  label,
  description,
  ...props 
}) => {
  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        className={cn(
          'mt-1 h-4 w-4 rounded border-slate-300 text-primary',
          'focus:ring-2 focus:ring-primary/20 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-start space-x-3">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'mt-1 h-4 w-4 border-slate-300 text-primary',
              'focus:ring-2 focus:ring-primary/20 focus:ring-offset-0',
              error && 'border-red-300'
            )}
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 cursor-pointer">
              {option.label}
            </label>
            {option.description && (
              <p className="text-xs text-slate-500 mt-1">{option.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      'flex justify-end space-x-3 pt-4 border-t border-slate-200',
      className
    )}>
      {children}
    </div>
  );
};
