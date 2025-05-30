import { useState, useCallback, useEffect } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { useFormValidation, ValidationSchema } from './useFormValidation';

export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema;
  onSubmit?: (values: T) => void | Promise<void>;
  mutation?: UseMutationResult<any, Error, T, unknown>;
  resetOnSuccess?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  reset: () => void;
  setValues: (values: Partial<T>) => void;
}

/**
 * Hook avanzado para formularios con React Query integration
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema = {},
  onSubmit,
  mutation,
  resetOnSuccess = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [isDirty, setIsDirty] = useState(false);

  // Usar el hook de validación
  const validation = useFormValidation(validationSchema);

  // Determinar si está enviando
  const isSubmitting = mutation?.isPending || false;

  // Verificar si el formulario es válido
  const isValid = validation.isValid && Object.keys(validation.errors).length === 0;

  // Manejar cambios en los valores
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [field]: value };
      setIsDirty(true);
      
      // Validar el campo si está tocado
      if (validation.touched[field as string]) {
        validation.handleFieldChange(field as string, value, newValues);
      }
      
      return newValues;
    });
  }, [validation]);

  // Establecer múltiples valores
  const setValuesCallback = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    setIsDirty(true);
  }, []);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    validation.handleFieldBlur(field as string, values[field], values);
  }, [validation, values]);

  // Establecer error de campo
  const setFieldError = useCallback((field: keyof T, error: string) => {
    validation.setError(field as string, error);
  }, [validation]);

  // Limpiar error de campo
  const clearFieldError = useCallback((field: keyof T) => {
    validation.clearFieldError(field as string);
  }, [validation]);

  // Manejar cambios de input
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Manejar diferentes tipos de input
    let newValue: any = value;
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }
    
    setValue(name as keyof T, newValue);
  }, [setValue]);

  // Manejar blur de input
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setFieldTouched(name as keyof T);
  }, [setFieldTouched]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar todos los campos
    const isFormValid = validation.validate(values);
    
    if (!isFormValid) {
      return;
    }

    try {
      if (mutation) {
        // Usar React Query mutation
        await mutation.mutateAsync(values);
      } else if (onSubmit) {
        // Usar callback personalizado
        await onSubmit(values);
      }
      
      // Reset si es exitoso y está configurado
      if (resetOnSuccess && !mutation?.isError) {
        reset();
      }
    } catch (error) {
      // Los errores se manejan en las mutaciones o en onSubmit
      console.error('Form submission error:', error);
    }
  }, [values, validation, mutation, onSubmit, resetOnSuccess]);

  // Reset del formulario
  const reset = useCallback(() => {
    setValues(initialValues);
    setIsDirty(false);
    validation.clearErrors();
  }, [initialValues, validation]);

  // Reset cuando cambian los valores iniciales
  useEffect(() => {
    if (!isDirty) {
      setValues(initialValues);
    }
  }, [initialValues, isDirty]);

  // Reset automático cuando la mutación es exitosa
  useEffect(() => {
    if (mutation?.isSuccess && resetOnSuccess) {
      reset();
    }
  }, [mutation?.isSuccess, resetOnSuccess, reset]);

  return {
    values,
    errors: validation.errors,
    touched: validation.touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues: setValuesCallback,
  };
}

/**
 * Hook específico para formularios de creación
 */
export function useCreateForm<T extends Record<string, any>>(
  initialValues: T,
  mutation: UseMutationResult<any, Error, T, unknown>,
  validationSchema?: ValidationSchema
) {
  return useForm({
    initialValues,
    validationSchema,
    mutation,
    resetOnSuccess: true,
  });
}

/**
 * Hook específico para formularios de edición
 */
export function useEditForm<T extends Record<string, any>>(
  initialValues: T,
  mutation: UseMutationResult<any, Error, { id: string; data: T }, unknown>,
  validationSchema?: ValidationSchema,
  id?: string
) {
  const form = useForm({
    initialValues,
    validationSchema,
    resetOnSuccess: false,
  });

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id) {
      console.error('ID is required for edit form');
      return;
    }

    const isFormValid = form.isValid;
    if (!isFormValid) {
      return;
    }

    try {
      await mutation.mutateAsync({ id, data: form.values });
    } catch (error) {
      console.error('Edit form submission error:', error);
    }
  }, [form.values, form.isValid, mutation, id]);

  return {
    ...form,
    handleSubmit,
    isSubmitting: mutation.isPending,
  };
}
