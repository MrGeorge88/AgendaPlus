import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { servicesService } from '../services/services';
import { Service } from '../contexts/app-context';
import { useAuth } from '../contexts/auth-context';
import { useNotification } from '../components/ui/notification';
import { useLanguage } from '../contexts/language-context';

export function Services() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Cargar servicios desde Supabase
  useEffect(() => {
    const loadServices = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await servicesService.getServices(user.id);
          setServices(data);
        } catch (error) {
          console.error('Error al cargar servicios:', error);
          showNotification({
            title: t('common.error'),
            message: t('services.errorLoading'),
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadServices();
  }, [user, t, showNotification]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddService = () => {
    setCurrentService(null);
    setShowForm(true);
  };

  const handleEditService = (service: any) => {
    setCurrentService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm(t('services.deleteConfirm'))) {
      try {
        const success = await servicesService.deleteService(id);
        if (success) {
          setServices(prev => prev.filter(service => service.id !== id));
          showNotification({
            title: t('common.success'),
            message: t('services.deleteSuccess'),
            type: 'success'
          });
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        showNotification({
          title: t('common.error'),
          message: t('services.deleteError'),
          type: 'error'
        });
      }
    }
  };

  return (
    <Layout title="Servicios">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddService} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nuevo servicio
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">{t('common.loading')}</span>
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
                      onClick={() => handleEditService(service)}
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
                      <Clock className="mr-1 h-4 w-4" /> {service.duration} min
                    </div>
                    <div className="flex items-center font-medium">
                      <DollarSign className="h-4 w-4 text-primary" /> {service.price}€
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

          {services.length === 0 && !loading && (
            <div className="mt-8 text-center">
              <p className="text-slate-500">{t('services.noServices')}</p>
              <Button onClick={handleAddService} className="mt-4">
                {t('services.addFirst')}
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentService ? 'Editar servicio' : 'Nuevo servicio'}
      >

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              try {
                const serviceData = {
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  price: Number(formData.get('price')),
                  duration: Number(formData.get('duration')),
                  description: formData.get('description') as string,
                };

                let result;
                if (user) {
                  if (currentService) {
                    // Actualizar servicio existente
                    result = await servicesService.updateService(currentService.id, serviceData);
                    if (result) {
                      setServices(prev => prev.map(service => service.id === currentService.id ? result! : service));
                      showNotification({
                        title: t('common.success'),
                        message: t('services.updateSuccess'),
                        type: 'success'
                      });
                    }
                  } else {
                    // Añadir nuevo servicio
                    result = await servicesService.createService(serviceData, user.id);
                    if (result) {
                      setServices(prev => [...prev, result!]);
                      showNotification({
                        title: t('common.success'),
                        message: t('services.createSuccess'),
                        type: 'success'
                      });
                    }
                  }
                } else {
                  throw new Error('Usuario no autenticado');
                }

                if (!result) throw new Error('Error en la operación');
                setShowForm(false);
              } catch (error) {
                console.error('Error al guardar el servicio:', error);
                showNotification({
                  title: t('common.error'),
                  message: currentService ? t('services.updateError') : t('services.createError'),
                  type: 'error'
                });
              }
            }}>
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre del servicio</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentService?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Categoría</label>
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
                  <label className="mb-1 block text-sm font-medium">Precio (€)</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full rounded-lg border border-slate-300 p-2"
                    defaultValue={currentService?.price || ''}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Duración (min)</label>
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
                <label className="mb-1 block text-sm font-medium">Descripción</label>
                <textarea
                  name="description"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  rows={3}
                  defaultValue={currentService?.description || ''}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentService ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
      </Modal>

      {/* Cierre del condicional showForm */}
    </Layout>
  );
}
