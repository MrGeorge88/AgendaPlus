import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, validationRules } from '../useFormValidation';

describe('useFormValidation', () => {
  const validationSchema = {
    name: [validationRules.required('Name is required')],
    email: [
      validationRules.required('Email is required'),
      validationRules.email('Invalid email format'),
    ],
    age: [validationRules.required('Age is required')],
  };

  it('initializes with empty errors and touched', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('validates required fields', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      const isValid = result.current.validate({ name: '', email: '', age: '' });
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.age).toBe('Age is required');
  });

  it('validates email format', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      const isValid = result.current.validate({
        name: 'John',
        email: 'invalid-email',
        age: '25',
      });
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.email).toBe('Invalid email format');
    expect(result.current.errors.name).toBeUndefined();
  });

  it('passes validation with valid data', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      const isValid = result.current.validate({
        name: 'John Doe',
        email: 'john@example.com',
        age: '25',
      });
      expect(isValid).toBe(true);
    });

    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });

  it('handles field-level validation', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      result.current.handleFieldChange('email', 'invalid-email', {
        name: 'John',
        email: 'invalid-email',
        age: '25',
      });
    });

    expect(result.current.errors.email).toBe('Invalid email format');
  });

  it('handles field blur', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      result.current.handleFieldBlur('name', '', { name: '', email: '', age: '' });
    });

    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('sets and clears errors manually', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      result.current.setError('name', 'Custom error');
    });

    expect(result.current.errors.name).toBe('Custom error');

    act(() => {
      result.current.clearFieldError('name');
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it('clears all errors', () => {
    const { result } = renderHook(() => useFormValidation(validationSchema));

    act(() => {
      result.current.setError('name', 'Error 1');
      result.current.setError('email', 'Error 2');
    });

    expect(Object.keys(result.current.errors)).toHaveLength(2);

    act(() => {
      result.current.clearErrors();
    });

    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });
});

describe('validationRules', () => {
  describe('required', () => {
    it('validates required fields', () => {
      const rule = validationRules.required('Field is required');
      
      expect(rule('')).toBe('Field is required');
      expect(rule('   ')).toBe('Field is required');
      expect(rule('value')).toBe('');
    });
  });

  describe('email', () => {
    it('validates email format', () => {
      const rule = validationRules.email('Invalid email');
      
      expect(rule('invalid')).toBe('Invalid email');
      expect(rule('invalid@')).toBe('Invalid email');
      expect(rule('invalid@domain')).toBe('Invalid email');
      expect(rule('valid@domain.com')).toBe('');
      expect(rule('user+tag@domain.co.uk')).toBe('');
    });
  });

  describe('minLength', () => {
    it('validates minimum length', () => {
      const rule = validationRules.minLength(5, 'Too short');
      
      expect(rule('1234')).toBe('Too short');
      expect(rule('12345')).toBe('');
      expect(rule('123456')).toBe('');
    });
  });

  describe('maxLength', () => {
    it('validates maximum length', () => {
      const rule = validationRules.maxLength(5, 'Too long');
      
      expect(rule('123456')).toBe('Too long');
      expect(rule('12345')).toBe('');
      expect(rule('1234')).toBe('');
    });
  });

  describe('price', () => {
    it('validates price format', () => {
      const rule = validationRules.price('Invalid price');
      
      expect(rule('invalid')).toBe('Invalid price');
      expect(rule('-5')).toBe('Invalid price');
      expect(rule('10001')).toBe('Invalid price');
      expect(rule('25.99')).toBe('');
      expect(rule('0')).toBe('');
      expect(rule('10000')).toBe('');
    });
  });

  describe('duration', () => {
    it('validates duration', () => {
      const rule = validationRules.duration('Invalid duration');
      
      expect(rule('invalid')).toBe('Invalid duration');
      expect(rule('4')).toBe('Invalid duration');
      expect(rule('481')).toBe('Invalid duration');
      expect(rule('30')).toBe('');
      expect(rule('5')).toBe('');
      expect(rule('480')).toBe('');
    });
  });

  describe('phone', () => {
    it('validates phone numbers', () => {
      const rule = validationRules.phone('Invalid phone');
      
      expect(rule('123')).toBe('Invalid phone');
      expect(rule('abc')).toBe('Invalid phone');
      expect(rule('+1234567890')).toBe('');
      expect(rule('(555) 123-4567')).toBe('');
      expect(rule('555-123-4567')).toBe('');
    });
  });

  describe('serviceName', () => {
    it('validates service names', () => {
      const rule = validationRules.serviceName('Invalid service name');
      
      expect(rule('a')).toBe('Invalid service name');
      expect(rule('a'.repeat(101))).toBe('Invalid service name');
      expect(rule('Valid Service')).toBe('');
      expect(rule('ab')).toBe('');
    });
  });
});
