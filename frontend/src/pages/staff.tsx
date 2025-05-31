import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail, Briefcase } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useAuth } from '../contexts/auth-context';
import { staffService, StaffMember } from '../services/staff';
import { useAsyncList } from '../hooks/useAsyncState';
import { useCrudNotifications } from '../hooks/useNotifications';
import { StaffListSkeleton } from '../components/ui/skeleton';
import { ComponentErrorBoundary, DataErrorFallback } from '../components/ui/error-boundary';
import { EmptyStaff, EmptySearchResults, useEmptyState } from '../components/ui/empty-state';

export function Staff() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(null);

  // Usar nuestros hooks personalizados
  const {
    items: staff,
    loading,
    error,
    execute: loadStaff,
    addItem: addStaff,
    updateItem: updateStaff,
    removeItem: removeStaff
  } = useAsyncList<StaffMember>([]);

  const { executeWithNotification } = useCrudNotifications('Miembro del personal');

  // Cargar datos del personal
  useEffect(() => {
    if (user) {
      loadStaff(() => staffService.getStaffMembers(user.id));
    }
  }, [user, loadStaff]);

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.specialty && person.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setShowForm(true);
  };

  const handleEditStaff = (person: StaffMember) => {
    setCurrentStaff(person);
    setShowForm(true);
  };

  const handleDeleteStaff = async (id: string) => {
    const staffMember = staff.find(s => s.id === id);
    if (confirm(t('staff.deleteConfirm'))) {
      try {
        await executeWithNotification(
          () => staffService.deleteStaffMember(id),
          'eliminar',
          staffMember?.name
        );
        removeStaff(id);
      } catch (error) {
        console.error('Error al eliminar el miembro del personal:', error);
      }
    }
  };

  // Determinar qué estado vacío mostrar
  const emptyState = useEmptyState(filteredStaff, loading, error, searchTerm);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      if (user) {
        const staffData = {
          name: formData.get('name') as string,
          color: formData.get('color') as string,
          avatar: currentStaff?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.get('name') as string)}&background=random`,
          userId: user.id,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          specialty: formData.get('specialty') as string
        };

        let result;
        if (currentStaff) {
          // Actualizar miembro existente
          result = await executeWithNotification(
            () => staffService.updateStaffMember({
              ...staffData,
              id: currentStaff.id
            }),
            'actualizar',
            staffData.name
          );
          updateStaff(currentStaff.id, result);
        } else {
          // Añadir nuevo miembro
          result = await executeWithNotification(
            () => staffService.createStaffMember(staffData, user.id),
            'crear',
            staffData.name
          );
          addStaff(result);
        }

        setShowForm(false);
      }
    } catch (error) {
      console.error('Error al guardar el miembro del personal:', error);
      // El error ya se maneja en executeWithNotification
    }
  };

  return (
    <Layout title={t('staff.title')}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('staff.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddStaff} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> {t('staff.newStaff')}
        </Button>
      </div>

      <ComponentErrorBoundary componentName="Lista de Personal">
        {loading ? (
          <StaffListSkeleton count={4} />
        ) : error ? (
          <DataErrorFallback
            error={new Error(error)}
            onRetry={() => user && loadStaff(() => staffService.getStaffMembers(user.id))}
            title="Error al cargar personal"
          />
        ) : emptyState === 'empty' ? (
          <EmptyStaff onAddStaff={handleAddStaff} />
        ) : emptyState === 'search' ? (
          <EmptySearchResults
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm('')}
            onCreateNew={handleAddStaff}
            entityName="miembro del personal"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map(person => (
              <Card key={person.id} className="flex flex-col">
                <div className="flex items-start justify-between p-4">
                  <div className="flex items-center">
                    <Avatar className="mr-3 h-10 w-10">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback style={{ backgroundColor: person.color, color: "white" }}>
                        {person.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">{person.name}</h3>
                      {person.specialty && (
                        <div className="flex items-center text-sm text-slate-500">
                          <Briefcase className="mr-1 h-3 w-3" /> {person.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditStaff(person)}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(person.id)}
                      className="rounded-full p-1 text-slate-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-auto border-t p-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-slate-500">
                      <Phone className="mr-2 h-4 w-4" /> {person.phone}
                    </div>
                    <div className="flex items-center text-slate-500">
                      <Mail className="mr-2 h-4 w-4" /> {person.email}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ComponentErrorBoundary>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentStaff ? t('staff.editStaff') : t('staff.newStaff')}
      >
            <form className="space-y-4" onSubmit={handleSubmitForm}>
              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.name')}</label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.name || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.specialty')} ({t('common.optional')})</label>
                <input
                  type="text"
                  name="specialty"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.specialty || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.email')} ({t('common.optional')})</label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.email || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.phone')} ({t('common.optional')})</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.phone || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.color')}</label>
                <input
                  type="color"
                  name="color"
                  className="h-10 w-full rounded-lg border border-slate-300"
                  defaultValue={currentStaff?.color || '#4f46e5'}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {currentStaff ? t('common.update') : t('common.save')}
                </Button>
              </div>
            </form>
      </Modal>

      {/* Cierre del condicional showForm */}
    </Layout>
  );
}
