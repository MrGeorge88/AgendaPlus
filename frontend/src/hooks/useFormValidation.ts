import { useState, useCallback, useMemo } from 'react';

// Tipos para las reglas de validación
export interface ValidationRule {
  validate: (value: any, allValues?: Record<string, any>) => boolean;
  message: string;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule[];
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface TouchedFields {
  [fieldName: string]: boolean;
}

export interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

// Reglas de validación predefinidas
export const validationRules = {
  required: (message: string = 'Este campo es obligatorio'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return value != null && value !== '';
    },
    message
  }),

  email: (message: string = 'Ingresa un email válido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  phone: (message: string = 'Ingresa un teléfono válido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      return value.length >= min;
    },
    message: message || `Debe tener al menos ${min} caracteres`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      return value.length <= max;
    },
    message: message || `No debe exceder ${max} caracteres`
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      const num = Number(value);
      return !isNaN(num) && num >= min;
    },
    message: message || `Debe ser mayor o igual a ${min}`
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      const num = Number(value);
      return !isNaN(num) && num <= max;
    },
    message: message || `Debe ser menor o igual a ${max}`
  }),

  number: (message: string = 'Debe ser un número válido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      return !isNaN(Number(value));
    },
    message
  }),

  positiveNumber: (message: string = 'Debe ser un número positivo'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      const num = Number(value);
      return !isNaN(num) && num > 0;
    },
    message
  }),

  url: (message: string = 'Ingresa una URL válida'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Solo valida si hay valor
      return regex.test(value);
    },
    message
  }),

  custom: (validator: (value: any, allValues?: Record<string, any>) => boolean, message: string): ValidationRule => ({
    validate: validator,
    message
  }),

  // Validaciones específicas para el negocio
  serviceName: (message: string = 'Nombre de servicio inválido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.trim().length >= 2 && value.trim().length <= 100;
    },
    message
  }),

  clientName: (message: string = 'Nombre de cliente inválido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.trim().length >= 2 && value.trim().length <= 100;
    },
    message
  }),

  price: (message: string = 'Precio inválido'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num >= 0 && num <= 10000;
    },
    message
  }),

  duration: (message: string = 'Duración inválida'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num >= 5 && num <= 480; // 5 minutos a 8 horas
    },
    message
  })
};

/**
 * Hook para validación de formularios
 */
export const useFormValidation = (
  schema: ValidationSchema,
  options: UseFormValidationOptions = {}
) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true
  } = options;

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  // Validar un campo específico
  const validateField = useCallback((
    fieldName: string,
    value: any,
    allValues: Record<string, any> = {}
  ): string | null => {
    const rules = schema[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      if (!rule.validate(value, allValues)) {
        return rule.message;
      }
    }
    return null;
  }, [schema]);

  // Validar todos los campos
  const validateAll = useCallback((values: Record<string, any>): FormErrors => {
    const newErrors: FormErrors = {};

    Object.keys(schema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName], values);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
  }, [schema, validateField]);

  // Manejar cambio de campo
  const handleFieldChange = useCallback((
    fieldName: string,
    value: any,
    allValues: Record<string, any> = {}
  ) => {
    if (validateOnChange && touched[fieldName]) {
      const error = validateField(fieldName, value, allValues);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  }, [validateField, validateOnChange, touched]);

  // Manejar blur de campo
  const handleFieldBlur = useCallback((
    fieldName: string,
    value: any,
    allValues: Record<string, any> = {}
  ) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    if (validateOnBlur) {
      const error = validateField(fieldName, value, allValues);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  }, [validateField, validateOnBlur]);

  // Validar formulario completo
  const validate = useCallback((values: Record<string, any>): boolean => {
    if (!validateOnSubmit) return true;

    const newErrors = validateAll(values);
    setErrors(newErrors);

    // Marcar todos los campos como touched
    const allTouched: TouchedFields = {};
    Object.keys(schema).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  }, [validateAll, validateOnSubmit, schema]);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Limpiar error de un campo específico
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Obtener error de un campo
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  }, [errors, touched]);

  // Verificar si un campo tiene error
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  // Verificar si el formulario es válido
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Verificar si hay errores visibles
  const hasVisibleErrors = useMemo(() => {
    return Object.keys(errors).some(fieldName => touched[fieldName] && errors[fieldName]);
  }, [errors, touched]);

  return {
    errors,
    touched,
    validate,
    validateField,
    handleFieldChange,
    handleFieldBlur,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    isValid,
    hasVisibleErrors
  };
};

/**
 * Hook para formularios con validación integrada
 */
export const useValidatedForm = <T extends Record<string, any>>(
  initialValues: T,
  schema: ValidationSchema,
  options?: UseFormValidationOptions
) => {
  const [values, setValues] = useState<T>(initialValues);
  const validation = useFormValidation(schema, options);

  const setValue = useCallback((fieldName: keyof T, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [fieldName]: value };
      validation.handleFieldChange(fieldName as string, value, newValues);
      return newValues;
    });
  }, [validation]);

  const setFieldTouched = useCallback((fieldName: keyof T) => {
    validation.handleFieldBlur(fieldName as string, values[fieldName], values);
  }, [validation, values]);

  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validation.validate(values)) {
        await onSubmit(values);
      }
    };
  }, [values, validation]);

  const reset = useCallback(() => {
    setValues(initialValues);
    validation.clearErrors();
  }, [initialValues, validation]);

  return {
    values,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    ...validation
  };
};
