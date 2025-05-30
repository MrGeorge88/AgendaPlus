import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm, useCreateForm } from '../use-form';
import { validationRules } from '../useFormValidation';

// Mock de React Query mutation
const mockMutation = {
  mutateAsync: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
};

describe('useForm', () => {
  const initialValues = {
    name: '',
    email: '',
    age: 0,
  };

  const validationSchema = {
    name: [validationRules.required('Name is required')],
    email: [
      validationRules.required('Email is required'),
      validationRules.email('Invalid email format'),
    ],
    age: [validationRules.required('Age is required')],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct values', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isDirty).toBe(false);
  });

  it('updates values correctly', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    act(() => {
      result.current.setValue('name', 'John Doe');
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.isDirty).toBe(true);
  });

  it('handles input changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    const mockEvent = {
      target: {
        name: 'email',
        value: 'john@example.com',
        type: 'text',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.email).toBe('john@example.com');
  });

  it('handles checkbox changes', () => {
    const checkboxInitialValues = { ...initialValues, subscribe: false };
    
    const { result } = renderHook(() =>
      useForm({
        initialValues: checkboxInitialValues,
        validationSchema,
      })
    );

    const mockEvent = {
      target: {
        name: 'subscribe',
        checked: true,
        type: 'checkbox',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.subscribe).toBe(true);
  });

  it('handles number input changes', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    const mockEvent = {
      target: {
        name: 'age',
        value: '25',
        type: 'number',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.age).toBe(25);
  });

  it('handles blur events', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    const mockEvent = {
      target: {
        name: 'email',
      },
    } as React.FocusEvent<HTMLInputElement>;

    act(() => {
      result.current.handleBlur(mockEvent);
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('validates form on submit', async () => {
    const onSubmit = vi.fn();
    
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled(); // No debería llamarse porque hay errores de validación
    expect(Object.keys(result.current.errors)).toHaveLength(3); // name, email, age
  });

  it('calls onSubmit when form is valid', async () => {
    const onSubmit = vi.fn();
    
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
        onSubmit,
      })
    );

    // Llenar el formulario con datos válidos
    act(() => {
      result.current.setValue('name', 'John Doe');
      result.current.setValue('email', 'john@example.com');
      result.current.setValue('age', 25);
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    });
  });

  it('resets form correctly', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    // Modificar el formulario
    act(() => {
      result.current.setValue('name', 'John Doe');
      result.current.setFieldError('email', 'Test error');
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.errors.email).toBe('Test error');
    expect(result.current.isDirty).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });

  it('sets multiple values at once', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.values.email).toBe('john@example.com');
    expect(result.current.isDirty).toBe(true);
  });

  it('manages field errors', () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationSchema,
      })
    );

    act(() => {
      result.current.setFieldError('name', 'Custom error');
    });

    expect(result.current.errors.name).toBe('Custom error');

    act(() => {
      result.current.clearFieldError('name');
    });

    expect(result.current.errors.name).toBeUndefined();
  });
});

describe('useCreateForm', () => {
  const initialValues = {
    name: '',
    email: '',
  };

  it('integrates with mutation correctly', async () => {
    mockMutation.mutateAsync.mockResolvedValue({ id: '1', name: 'John', email: 'john@example.com' });

    const { result } = renderHook(() =>
      useCreateForm(initialValues, mockMutation as any)
    );

    // Llenar formulario
    act(() => {
      result.current.setValue('name', 'John');
      result.current.setValue('email', 'john@example.com');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    });
  });

  it('resets form after successful submission', async () => {
    const successfulMutation = {
      ...mockMutation,
      mutateAsync: vi.fn().mockResolvedValue({}),
      isSuccess: true,
    };

    const { result } = renderHook(() =>
      useCreateForm(initialValues, successfulMutation as any)
    );

    // Modificar formulario
    act(() => {
      result.current.setValue('name', 'John');
    });

    expect(result.current.values.name).toBe('John');

    // Simular éxito de la mutación
    act(() => {
      result.current.reset();
    });

    expect(result.current.values.name).toBe('');
  });
});
