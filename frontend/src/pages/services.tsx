import { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { Service } from '../contexts/app-context';
import { useLanguage } from '../contexts/language-context';
import { ServiceListSkeleton } from '../components/ui/skeleton';
import { ComponentErrorBoundary, DataErrorFallback } from '../components/ui/error-boundary';
import { EmptyServices } from '../components/ui/empty-state';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../hooks/use-services';
import { normalizeQueryState } from '../hooks/useAsyncState';

export function Services() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Usar React Query hooks
  const servicesQuery = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // Normalizar estado para compatibilidad
  const { data: services, loading, error } = normalizeQueryState(servicesQuery);

  const filteredServices = (services || []).filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setCurrentService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (id: string) => {
    const service = services?.find(s => s.id === id);
    if (confirm(t('services.deleteConfirm'))) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleSubmitService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const serviceData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      description: formData.get('description') as string,
    };

    try {
      if (currentService) {
        await updateServiceMutation.mutateAsync({ id: currentService.id, data: serviceData });
      } else {
        await createServiceMutation.mutateAsync(serviceData);
      }
      setShowForm(false);
      setCurrentService(null);
    } catch (error) {
      // Los errores se manejan en los hooks
      console.error('Error al guardar servicio:', error);
    }
  };

  return (
    <Layout title={t('services.title')}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('services.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddService} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('services.new')}
        </Button>
      </div>

      <ComponentErrorBoundary componentName="Lista de Servicios">
        {loading ? (
          <ServiceListSkeleton count={6} />
        ) : error ? (
          <DataErrorFallback
            error={new Error(error)}
            onRetry={() => servicesQuery.refetch()}
            title="Error al cargar servicios"
          />
        ) : !services || services.length === 0 ? (
          <EmptyServices onCreateService={handleAddService} />
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
                        onClick={() => handleEditService(service)}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        disabled={updateServiceMutation.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-600"
                        disabled={deleteServiceMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto border-t p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="mr-1 h-4 w-4" /> {service.duration} min
                      </div>
                      <div className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 text-primary" /> ${service.price}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && services.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-slate-500">{t('services.noResults')}</p>
              </div>
            )}
          </>
        )}
      </ComponentErrorBoundary>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentService ? t('services.edit') : t('services.new')}
      >
        <form className="space-y-4" onSubmit={handleSubmitService}>
              <div>
                <label className="mb-1 block text-sm font-medium">{t('services.nameLabel')}</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentService?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('services.categoryLabel')}</label>
                <input
                  type="text"
                  name="category"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentService?.category || ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">{t('services.priceLabel')}</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full rounded-lg border border-slate-300 p-2"
                    defaultValue={currentService?.price || ''}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">{t('services.durationLabel')}</label>
                  <input
                    type="number"
                    name="duration"
                    className="w-full rounded-lg border border-slate-300 p-2"
                    defaultValue={currentService?.duration || ''}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('services.descriptionLabel')}</label>
                <textarea
                  name="description"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  rows={3}
                  defaultValue={currentService?.description || ''}
                ></textarea>
              </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
            >
              {(createServiceMutation.isPending || updateServiceMutation.isPending)
                ? 'Guardando...'
                : currentService ? t('common.update') : t('common.save')
              }
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
