import React from 'react';
import { FormField, Input, Textarea, Select, FormActions } from '../ui/form-field';
import { Button } from '../ui/button';
import { ColorPicker } from '../ui/color-picker';
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

// Service categories will be translated dynamically
const getServiceCategories = (t: (key: string) => string) => [
  { value: 'corte', label: t('services.categories.haircut') },
  { value: 'color', label: t('services.categories.coloring') },
  { value: 'tratamiento', label: t('services.categories.treatment') },
  { value: 'peinado', label: t('services.categories.styling') },
  { value: 'manicure', label: t('services.categories.manicure') },
  { value: 'pedicure', label: t('services.categories.pedicure') },
  { value: 'facial', label: t('services.categories.facial') },
  { value: 'masaje', label: t('services.categories.massage') },
  { value: 'depilacion', label: t('services.categories.hairRemoval') },
  { value: 'otro', label: t('services.categories.other') },
];

const initialValues = {
  name: '',
  category: '',
  description: '',
  price: 0,
  duration: 30,
  color: '#3B82F6',
};

// Validation schema will be created dynamically with translations
const getValidationSchema = (t: (key: string) => string) => ({
  name: [
    validationRules.required(t('validation.serviceNameRequired')),
    validationRules.serviceName(t('validation.serviceNameLength'))
  ],
  category: [
    validationRules.required(t('validation.categoryRequired'))
  ],
  price: [
    validationRules.required(t('validation.priceRequired')),
    validationRules.price(t('validation.priceRange'))
  ],
  duration: [
    validationRules.required(t('validation.durationRequired')),
    validationRules.duration(t('validation.durationRange'))
  ],
});

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
    color: service.color || '#3B82F6',
  } : initialValues;

  // Get translated categories and validation schema
  const serviceCategories = getServiceCategories(t);
  const validationSchema = getValidationSchema(t);

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
          placeholder={t('forms.exampleHaircut')}
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
          placeholder={t('forms.selectCategory')}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label={t('services.priceLabel')}
          required
          error={form.touched.price ? form.errors.price : undefined}
          description={t('forms.priceInDollars')}
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
          description={t('forms.durationInMinutes')}
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

        <FormField
          label={t('services.colorLabel')}
          error={form.touched.color ? form.errors.color : undefined}
          description={t('forms.serviceColor')}
        >
          <ColorPicker
            value={form.values.color}
            onChange={(color) => form.setFieldValue('color', color)}
            disabled={form.isSubmitting}
          />
        </FormField>
      </div>

      <FormField
        label={t('services.descriptionLabel')}
        error={form.touched.description ? form.errors.description : undefined}
        description={t('forms.optionalDescription')}
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
            ? (isEditing ? t('common.saving') : t('common.saving'))
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
                {isEditing ? t('services.updateError') : t('services.createError')}
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
