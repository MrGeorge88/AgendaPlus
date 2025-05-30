import React from 'react';
import { FormField, Input, Textarea, Select, FormActions } from '../ui/form-field';
import { Button } from '../ui/button';
import { useCreateForm, useEditForm } from '../../hooks/use-form';
import { useCreateService, useUpdateService } from '../../hooks/use-services';
import { validationRules } from '../../hooks/useFormValidation';
import { useLanguage } from '../../contexts/language-context';
import { Service } from '../../contexts/app-context';

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const serviceCategories = [
  { value: 'corte', label: 'Corte de Cabello' },
  { value: 'color', label: 'Coloración' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'peinado', label: 'Peinado' },
  { value: 'manicure', label: 'Manicure' },
  { value: 'pedicure', label: 'Pedicure' },
  { value: 'facial', label: 'Tratamiento Facial' },
  { value: 'masaje', label: 'Masaje' },
  { value: 'depilacion', label: 'Depilación' },
  { value: 'otro', label: 'Otro' },
];

const initialValues = {
  name: '',
  category: '',
  description: '',
  price: 0,
  duration: 30,
};

const validationSchema = {
  name: [
    validationRules.required('El nombre del servicio es obligatorio'),
    validationRules.serviceName('El nombre debe tener entre 2 y 100 caracteres')
  ],
  category: [
    validationRules.required('La categoría es obligatoria')
  ],
  price: [
    validationRules.required('El precio es obligatorio'),
    validationRules.price('El precio debe ser un número válido entre 0 y 10,000')
  ],
  duration: [
    validationRules.required('La duración es obligatoria'),
    validationRules.duration('La duración debe estar entre 5 y 480 minutos')
  ],
};

export const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSuccess,
  onCancel
}) => {
  const { t } = useLanguage();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  const isEditing = !!service;
  const formInitialValues = service ? {
    name: service.name,
    category: service.category,
    description: service.description || '',
    price: service.price,
    duration: service.duration,
  } : initialValues;

  // Usar el hook apropiado según si estamos editando o creando
  const form = isEditing
    ? useEditForm(
        formInitialValues,
        updateServiceMutation,
        validationSchema,
        service?.id
      )
    : useCreateForm(
        formInitialValues,
        createServiceMutation,
        validationSchema
      );

  // Manejar éxito
  React.useEffect(() => {
    if (createServiceMutation.isSuccess || updateServiceMutation.isSuccess) {
      onSuccess?.();
    }
  }, [createServiceMutation.isSuccess, updateServiceMutation.isSuccess, onSuccess]);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      <FormField
        label={t('services.nameLabel')}
        required
        error={form.touched.name ? form.errors.name : undefined}
      >
        <Input
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={!!form.errors.name && form.touched.name}
          placeholder="Ej: Corte de cabello clásico"
        />
      </FormField>

      <FormField
        label={t('services.categoryLabel')}
        required
        error={form.touched.category ? form.errors.category : undefined}
      >
        <Select
          name="category"
          value={form.values.category}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={!!form.errors.category && form.touched.category}
          options={serviceCategories}
          placeholder="Selecciona una categoría"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t('services.priceLabel')}
          required
          error={form.touched.price ? form.errors.price : undefined}
          description="Precio en dólares"
        >
          <Input
            type="number"
            name="price"
            value={form.values.price}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.errors.price && form.touched.price}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </FormField>

        <FormField
          label={t('services.durationLabel')}
          required
          error={form.touched.duration ? form.errors.duration : undefined}
          description="Duración en minutos"
        >
          <Input
            type="number"
            name="duration"
            value={form.values.duration}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={!!form.errors.duration && form.touched.duration}
            placeholder="30"
            min="5"
            max="480"
            step="5"
          />
        </FormField>
      </div>

      <FormField
        label={t('services.descriptionLabel')}
        error={form.touched.description ? form.errors.description : undefined}
        description="Descripción opcional del servicio"
      >
        <Textarea
          name="description"
          value={form.values.description}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={!!form.errors.description && form.touched.description}
          placeholder="Describe el servicio, técnicas utilizadas, beneficios..."
          rows={3}
        />
      </FormField>

      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={form.isSubmitting}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={form.isSubmitting || !form.isValid}
        >
          {form.isSubmitting
            ? (isEditing ? 'Actualizando...' : 'Creando...')
            : (isEditing ? t('common.update') : t('common.save'))
          }
        </Button>
      </FormActions>

      {/* Mostrar errores de la mutación */}
      {(createServiceMutation.error || updateServiceMutation.error) && (
        <div className="rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al {isEditing ? 'actualizar' : 'crear'} el servicio
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {createServiceMutation.error?.message || updateServiceMutation.error?.message}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ServiceForm;
