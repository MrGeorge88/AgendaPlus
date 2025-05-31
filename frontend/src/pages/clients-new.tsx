import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Form, FormGroup, FormActions } from '../components/ui/form';
import { Modal } from '../components/ui/modal';
import { AlertWithIcon } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react';
import { useAppContext } from '../contexts/app-context';
import { useLanguage } from '../lib/translations';
import { useForm } from '../hooks/use-form';
import { email as emailValidator, required, phone as phoneValidator } from '../utils/validation';
import { clientsService } from '../services/clients';

export function Clients() {
  const { state, dispatch } = useAppContext();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    const loadClients = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { key: 'clients', value: true } });

        // Llamada al servicio para obtener los clientes
        const clients = await clientsService.getClients();

        dispatch({ type: 'SET_CLIENTS', payload: clients });
        dispatch({ type: 'SET_LOADING', payload: { key: 'clients', value: false } });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('clients.loadError');
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: { key: 'clients', value: false } });
      }
    };

    loadClients();
  }, [dispatch]);

  // Filtrar clientes según el término de búsqueda
  const filteredClients = state.clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Obtener el cliente actual para edición
  const currentClient = currentClientId
    ? state.clients.find(client => client.id === currentClientId)
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
      name: currentClient?.name || '',
      email: currentClient?.email || '',
      phone: currentClient?.phone || '',
      notes: currentClient?.notes || '',
    },
    validationRules: {
      name: [required()],
      email: [required(), emailValidator()],
      phone: [required(), phoneValidator()],
    },
    onSubmit: async (values) => {
      try {
        if (currentClient) {
          // Actualizar cliente existente
          const updatedClient = await clientsService.updateClient(currentClient.id, {
            name: values.name,
            email: values.email,
            phone: values.phone,
            notes: values.notes,
          });

          // Actualizar el estado global
          dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
        } else {
          // Añadir nuevo cliente
          const newClient = await clientsService.createClient({
            name: values.name,
            email: values.email,
            phone: values.phone,
            notes: values.notes,
            lastVisit: 'Nunca',
            totalSpent: 0,
          });

          // Actualizar el estado global
          dispatch({ type: 'ADD_CLIENT', payload: newClient });
        }

        setShowForm(false);
        resetForm();
      } catch (error) {
        console.error(t('clients.saveError'), error);
        const errorMessage = error instanceof Error ? error.message : t('clients.saveError');
        throw new Error(errorMessage);
      }
    },
  });

  // Actualizar valores del formulario cuando cambia el cliente seleccionado
  useEffect(() => {
    if (currentClient) {
      setFieldValue('name', currentClient.name);
      setFieldValue('email', currentClient.email);
      setFieldValue('phone', currentClient.phone);
      setFieldValue('notes', currentClient.notes || '');
    } else {
      resetForm();
    }
  }, [currentClient, setFieldValue, resetForm]);

  // Manejadores de eventos
  const handleAddClient = () => {
    setCurrentClientId(null);
    setShowForm(true);
  };

  const handleEditClient = (id: number) => {
    setCurrentClientId(id);
    setShowForm(true);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      setDeleteError(null);

      if (window.confirm(t('clients.deleteConfirm'))) {
        // Llamada al servicio para eliminar el cliente
        await clientsService.deleteClient(id);

        // Actualizar el estado global
        dispatch({ type: 'DELETE_CLIENT', payload: id });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('clients.deleteError');
      setDeleteError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    resetForm();
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Nunca') return t('clients.never');

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Layout title={t('clients.title')}>
      {state.error && (
        <AlertWithIcon
          variant="error"
          title={t('common.error')}
          description={state.error}
          className="mb-4"
        />
      )}

      {deleteError && (
        <AlertWithIcon
          variant="error"
          title={t('clients.deleteErrorTitle')}
          description={deleteError}
          className="mb-4"
        />
      )}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder={t('clients.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('clients.newClient')}
        </Button>
      </div>

      {state.isLoading.clients ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="sr-only">{t('common.loading')}</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map(client => (
              <Card key={client.id} className="flex flex-col">
                <div className="flex items-start justify-between p-4">
                  <div>
                    <h3 className="text-lg font-bold">{client.name}</h3>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-slate-500">
                        <Mail className="mr-2 h-4 w-4" /> {client.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="mr-2 h-4 w-4" /> {client.phone}
                      </div>
                      {client.notes && (
                        <div className="mt-2 text-sm text-slate-600">
                          {client.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClient(client.id)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-auto border-t p-4">
                  <div className="flex justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="mr-1 h-3 w-3" /> {formatDate(client.lastVisit)}
                    </div>
                    <Badge variant="success">
                      {client.totalSpent}€
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-slate-500">{t('clients.noResults')}</p>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={currentClient ? t('clients.editClient') : t('clients.newClient')}
      >
        <Form onSubmit={handleSubmit} error={errors.form}>
          <FormGroup>
            <Input
              label={t('clients.name')}
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
            <Input
              label={t('clients.email')}
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label={t('clients.phone')}
              type="tel"
              name="phone"
              id="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              required
            />
          </FormGroup>

          <FormGroup>
            <Textarea
              label={t('clients.notes')}
              name="notes"
              id="notes"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.notes}
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
                : currentClient
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
