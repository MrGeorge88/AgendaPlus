import { useState, useCallback, useEffect } from "react";
import { ValidationRules, validateForm, ValidationErrors } from "../utils/validation";

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): string | null => {
      if (!validationRules[field as string]) return null;
      
      const fieldErrors = validateForm(
        { [field]: values[field] },
        { [field]: validationRules[field as string] }
      );
      
      return fieldErrors[field as string] || null;
    },
    [values, validationRules]
  );

  // Validate all fields
  const validateAllFields = useCallback((): ValidationErrors => {
    return validateForm(values, validationRules);
  }, [values, validationRules]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      // Handle different input types
      const newValue = type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : value;
      
      setValues((prev) => ({ ...prev, [name]: newValue }));
      
      if (validateOnChange) {
        setErrors((prev) => {
          const fieldError = validateField(name as keyof T);
          if (!fieldError) {
            const { [name]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [name]: fieldError };
        });
      }
    },
    [validateOnChange, validateField]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      
      setTouched((prev) => ({ ...prev, [name]: true }));
      
      if (validateOnBlur) {
        setErrors((prev) => {
          const fieldError = validateField(name as keyof T);
          if (!fieldError) {
            const { [name]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [name]: fieldError };
        });
      }
    },
    [validateOnBlur, validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      
      // Validate all fields
      const formErrors = validateAllFields();
      setErrors(formErrors);
      
      // If there are no errors, submit the form
      if (Object.keys(formErrors).length === 0 && onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateAllFields, onSubmit]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Set a field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Set a field touched programmatically
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm: () => Object.keys(validateAllFields()).length === 0,
  };
}
