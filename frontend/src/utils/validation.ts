// Validation types
export type ValidationRule<T = string> = {
  validate: (value: T) => boolean;
  message: string;
};

export type ValidationRules<T = string> = Record<string, ValidationRule<T>[]>;

export type ValidationErrors = Record<string, string>;

// Basic validation rules
export const required = (message = "Este campo es obligatorio"): ValidationRule => ({
  validate: (value) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (value === null || value === undefined) return false;
    return true;
  },
  message,
});

export const minLength = (min: number, message = `Debe tener al menos ${min} caracteres`): ValidationRule => ({
  validate: (value) => value.length >= min,
  message,
});

export const maxLength = (max: number, message = `Debe tener como máximo ${max} caracteres`): ValidationRule => ({
  validate: (value) => value.length <= max,
  message,
});

export const email = (message = "Debe ser un email válido"): ValidationRule => ({
  validate: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message,
});

export const phone = (message = "Debe ser un número de teléfono válido"): ValidationRule => ({
  validate: (value) => {
    // Acepta formatos comunes como: +34 612 345 678, 612-345-678, 612.345.678, 612 345 678
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
    return value.length === 0 || phoneRegex.test(value);
  },
  message,
});

export const numeric = (message = "Debe ser un valor numérico"): ValidationRule => ({
  validate: (value) => {
    return !isNaN(Number(value));
  },
  message,
});

export const min = (minValue: number, message = `Debe ser mayor o igual a ${minValue}`): ValidationRule => ({
  validate: (value) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= minValue;
  },
  message,
});

export const max = (maxValue: number, message = `Debe ser menor o igual a ${maxValue}`): ValidationRule => ({
  validate: (value) => {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue <= maxValue;
  },
  message,
});

export const pattern = (regex: RegExp, message = "El formato no es válido"): ValidationRule => ({
  validate: (value) => regex.test(value),
  message,
});

export const match = (fieldToMatch: string, message = "Los campos no coinciden"): ValidationRule => ({
  validate: (value, formValues) => value === formValues[fieldToMatch],
  message,
});

// Validation function
export const validateField = (
  value: any,
  rules: ValidationRule[],
  formValues: Record<string, any> = {}
): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value, formValues)) {
      return rule.message;
    }
  }
  return null;
};

export const validateForm = (
  values: Record<string, any>,
  validationRules: ValidationRules
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.entries(validationRules).forEach(([field, rules]) => {
    const error = validateField(values[field], rules, values);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
