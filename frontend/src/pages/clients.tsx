import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import { useNotification } from '../components/ui/notification';
import { clientsService, Client } from '../services/clients';

export function Clients() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  // Cargar datos de clientes
  useEffect(() => {
    const loadClients = async () => {
      if (user) {
        try {
          setLoading(true);
          const clientsData = await clientsService.getClients(user.id);
          setClients(clientsData);
        } catch (error) {
          console.error('Error al cargar los clientes:', error);
          showNotification({
            title: t('common.error'),
            message: t('clients.errorLoading'),
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadClients();
  }, [user, t, showNotification]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = () => {
    setCurrentClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client: Client) => {
    setCurrentClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm(t('clients.deleteConfirm'))) {
      try {
        const success = await clientsService.deleteClient(id);
        if (success) {
          setClients(prev => prev.filter(client => client.id !== id));
          showNotification({
            title: t('common.success'),
            message: t('clients.deleteSuccess'),
            type: 'success'
          });
        } else {
          throw new Error('Error al eliminar');
        }
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        showNotification({
          title: t('common.error'),
          message: t('clients.deleteError'),
          type: 'error'
        });
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (user) {
        const clientData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          notes: formData.get('notes') as string,
          userId: user.id
        };

        let result;
        if (currentClient) {
          // Actualizar cliente existente
          result = await clientsService.updateClient({
            ...clientData,
            id: currentClient.id,
            lastVisit: currentClient.lastVisit,
            totalSpent: currentClient.totalSpent
          });
          if (result) {
            setClients(prev => prev.map(client => client.id === currentClient.id ? result! : client));
            showNotification({
              title: t('common.success'),
              message: t('clients.updateSuccess'),
              type: 'success'
            });
          }
        } else {
          // Añadir nuevo cliente
          result = await clientsService.createClient(clientData, user.id);
          if (result) {
            setClients(prev => [...prev, result!]);
            showNotification({
              title: t('common.success'),
              message: t('clients.createSuccess'),
              type: 'success'
            });
          }
        }

        if (!result) throw new Error('Error en la operación');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      showNotification({
        title: t('common.error'),
        message: currentClient ? t('clients.updateError') : t('clients.createError'),
        type: 'error'
      });
    }
  };

  return (
    <Layout title="Clientes">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('clients.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('clients.newClient')}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map(client => (
            <Card key={client.id} className="flex flex-col">
              <div className="flex items-start justify-between p-4">
                <div>
                  <h3 className="text-lg font-bold">{client.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-slate-500">
                      <Phone className="mr-2 h-4 w-4" /> {client.phone}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Mail className="mr-2 h-4 w-4" /> {client.email}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClient(client)}
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('clients.lastVisit')}:</span>
                    <span>{client.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('clients.totalSpent')}:</span>
                    <span className="font-medium">{client.totalSpent}€</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredClients.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-slate-500">{t('clients.noResults')}</p>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentClient ? t('clients.editClient') : t('clients.newClient')}
      >
            <form className="space-y-4" onSubmit={handleSubmitForm}>
              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.name')}</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.email')}</label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.email || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentClient?.phone || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('clients.notes')}</label>
                <textarea
                  name="notes"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  rows={4}
                  defaultValue={currentClient?.notes || ''}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {currentClient ? t('common.update') : t('common.save')}
                </Button>
              </div>
            </form>
      </Modal>
    </Layout>
  );
}
