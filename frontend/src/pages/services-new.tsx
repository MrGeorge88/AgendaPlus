import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Form, FormGroup, FormActions } from '../components/ui/form';
import { Modal } from '../components/ui/modal';
import { AlertWithIcon } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useAppContext } from '../contexts/app-context';
import { useLanguage } from '../lib/translations';
import { useForm } from '../hooks/use-form';
import { useNotification } from '../components/ui/notification';
import { required, min, numeric } from '../utils/validation';
import { servicesService } from '../services/services';

// Service categories will be created dynamically based on the current language

export function Services() {
  const { state, dispatch } = useAppContext();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<number | null>(null);

  // Create service categories based on current language
  const serviceCategories = [
    { value: 'haircare', label: t('services.categories.haircare') },
    { value: 'nails', label: t('services.categories.nails') },
    { value: 'massage', label: t('services.categories.massage') },
    { value: 'aesthetics', label: t('services.categories.aesthetics') },
    { value: 'makeup', label: t('services.categories.makeup') },
    { value: 'other', label: t('services.categories.other') },
  ];

  // Cargar servicios al montar el componente
  useEffect(() => {
    const loadServices = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'services', value: true } });

        // Llamada al servicio para obtener los servicios
        const services = await servicesService.getServices();

        dispatch({ type: 'SET_SERVICES', payload: services });
        dispatch({ type: 'SET_LOADING', payload: { key: 'services', value: false } });

        showNotification({
          title: t('services.loadSuccess'),
          description: t('services.loadSuccessDetail', { count: services.length }),
          variant: 'success',
          position: 'bottom-right',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('services.loadError');
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: { key: 'services', value: false } });

        showNotification({
          title: t('common.error'),
          description: errorMessage,
          variant: 'error',
          position: 'bottom-right',
        });
      }
    };

    loadServices();
  }, [dispatch, showNotification]);

  // Filtrar servicios según el término de búsqueda
  const filteredServices = state.services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener el servicio actual para edición
  const currentService = currentServiceId
    ? state.services.find(service => service.id === currentServiceId)
    : null;

  // Configuración del formulario
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    isSubmitting
  } = useForm({
    initialValues: {
      name: currentService?.name || '',
      category: currentService?.category || 'Peluquería',
      price: currentService?.price?.toString() || '',
      duration: currentService?.duration?.toString() || '',
      description: currentService?.description || '',
    },
    validationRules: {
      name: [required()],
      category: [required()],
      price: [required(), numeric(), min(0, t('services.validation.priceMin'))],
      duration: [required(), numeric(), min(1, t('services.validation.durationMin'))],
    },
    onSubmit: async (values) => {
      try {
        if (currentService) {
          // Actualizar servicio existente
          const updatedService = await servicesService.updateService(currentService.id, {
            name: values.name,
            category: values.category,
            price: Number(values.price),
            duration: Number(values.duration),
            description: values.description,
          });

          // Actualizar el estado global
          dispatch({ type: 'UPDATE_SERVICE', payload: updatedService });

          // Mostrar notificación de éxito
          showNotification({
            title: t('services.updateSuccess'),
            description: t('services.updateSuccessDetail', { name: updatedService.name }),
            variant: 'success',
            position: 'bottom-right',
          });
        } else {
          // Añadir nuevo servicio
          const newService = await servicesService.createService({
            name: values.name,
            category: values.category,
            price: Number(values.price),
            duration: Number(values.duration),
            description: values.description,
          });

          // Actualizar el estado global
          dispatch({ type: 'ADD_SERVICE', payload: newService });

          // Mostrar notificación de éxito
          showNotification({
            title: t('services.createSuccess'),
            description: t('services.createSuccessDetail', { name: newService.name }),
            variant: 'success',
            position: 'bottom-right',
          });
        }

        setShowForm(false);
        resetForm();
      } catch (error) {
        console.error(t('services.saveError'), error);
        const errorMessage = error instanceof Error ? error.message : t('services.saveError');

        // Mostrar notificación de error
        showNotification({
          title: t('common.error'),
          description: errorMessage,
          variant: 'error',
          position: 'bottom-right',
        });

        throw new Error(errorMessage);
      }
    },
  });

  // Actualizar valores del formulario cuando cambia el servicio seleccionado
  useEffect(() => {
    if (currentService) {
      setFieldValue('name', currentService.name);
      setFieldValue('category', currentService.category);
      setFieldValue('price', currentService.price.toString());
      setFieldValue('duration', currentService.duration.toString());
      setFieldValue('description', currentService.description || '');
    } else {
      resetForm();
    }
  }, [currentService, setFieldValue, resetForm]);

  // Manejadores de eventos
  const handleAddService = () => {
    setCurrentServiceId(null);
    setShowForm(true);
  };

  const handleEditService = (id: number) => {
    setCurrentServiceId(id);
    setShowForm(true);
  };

  const handleDeleteService = async (id: number) => {
    try {
      if (window.confirm(t('services.deleteConfirm'))) {
        // Llamada al servicio para eliminar el servicio
        await servicesService.deleteService(id);

        // Actualizar el estado global
        dispatch({ type: 'DELETE_SERVICE', payload: id });

        // Mostrar notificación de éxito
        showNotification({
          title: t('services.deleteSuccess'),
          description: t('services.deleteSuccessDetail'),
          variant: 'success',
          position: 'bottom-right',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('services.deleteError');

      // Mostrar notificación de error
      showNotification({
        title: t('common.error'),
        description: errorMessage,
        variant: 'error',
        position: 'bottom-right',
      });
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <Layout title={t('services.title')}>
      {state.error && (
        <AlertWithIcon
          variant="error"
          title={t('common.error')}
          description={state.error}
          className="mb-4"
        />
      )}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder={t('services.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddService} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('services.newService')}
        </Button>
      </div>

      {state.isLoading.services ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="sr-only">{t('common.loading')}</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map(service => (
              <Card key={service.id} className="flex flex-col">
                <div className="flex items-start justify-between p-4">
                  <div>
                    <div className="mb-1 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {service.category}
                    </div>
                    <h3 className="text-lg font-bold">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{service.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditService(service.id)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-auto border-t p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="mr-1 h-4 w-4" /> {service.duration} {t('services.minutes')}
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="h-4 w-4 text-primary" /> ${service.price}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-slate-500">{t('services.noResults')}</p>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={currentService ? t('services.editService') : t('services.newService')}
      >
        <Form onSubmit={handleSubmit} error={errors.form}>
          <FormGroup>
            <Input
              label={t('services.name')}
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
            />
          </FormGroup>

          <FormGroup>
            <Select
              label={t('services.category')}
              name="category"
              id="category"
              options={serviceCategories}
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.category}
              required
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-4">
            <FormGroup>
              <Input
                label={t('services.price')}
                type="number"
                name="price"
                id="price"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.price}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                label={t('services.duration')}
                type="number"
                name="duration"
                id="duration"
                value={values.duration}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.duration}
                required
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Textarea
              label={t('services.description')}
              name="description"
              id="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
            />
          </FormGroup>

          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('common.saving')
                : currentService
                  ? t('common.update')
                  : t('common.save')
              }
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </Layout>
  );
}
