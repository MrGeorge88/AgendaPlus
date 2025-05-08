import { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Modal } from '../components/ui/modal';
import { Plus, Search, Edit, Trash2, Phone, Mail, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

// Datos de ejemplo para el personal
const mockStaff = [
  { id: 1, name: "Ana García", email: "ana@example.com", phone: "123-456-7890", specialty: "Peluquería", color: "#4f46e5", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Carlos Rodríguez", email: "carlos@example.com", phone: "123-456-7891", specialty: "Manicura y Pedicura", color: "#ec4899", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Elena Martínez", email: "elena@example.com", phone: "123-456-7892", specialty: "Masajes", color: "#10b981", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "David López", email: "david@example.com", phone: "123-456-7893", specialty: "Estética", color: "#f59e0b", avatar: "https://i.pravatar.cc/150?img=4" },
];

export function Staff() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState(mockStaff);
  const [showForm, setShowForm] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = () => {
    setCurrentStaff(null);
    setShowForm(true);
  };

  const handleEditStaff = (person: any) => {
    setCurrentStaff(person);
    setShowForm(true);
  };

  const handleDeleteStaff = (id: number) => {
    if (confirm(t('staff.deleteConfirm'))) {
      setStaff(prev => prev.filter(person => person.id !== id));
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map(person => (
          <Card key={person.id} className="flex flex-col">
            <div className="flex items-start justify-between p-4">
              <div className="flex items-center">
                <Avatar className="mr-3 h-12 w-12">
                  <AvatarImage src={person.avatar} alt={person.name} />
                  <AvatarFallback style={{ backgroundColor: person.color, color: "white" }}>
                    {person.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{person.name}</h3>
                  <div className="flex items-center text-sm text-slate-500">
                    <Briefcase className="mr-1 h-3 w-3" /> {person.specialty}
                  </div>
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

      {filteredStaff.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-slate-500">{t('staff.noResults')}</p>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={currentStaff ? t('staff.editStaff') : t('staff.newStaff')}
      >

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);

              const staffData = {
                id: currentStaff?.id || staff.length + 1,
                name: formData.get('name') as string,
                specialty: formData.get('specialty') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                color: formData.get('color') as string,
                avatar: currentStaff?.avatar || `https://i.pravatar.cc/150?img=${staff.length + 1}`
              };

              if (currentStaff) {
                // Update existing staff
                setStaff(prev =>
                  prev.map(person => person.id === currentStaff.id ? staffData : person)
                );
              } else {
                // Add new staff
                setStaff(prev => [...prev, staffData]);
              }

              setShowForm(false);
            }}>
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
                <label className="mb-1 block text-sm font-medium">{t('staff.specialty')}</label>
                <input
                  type="text"
                  name="specialty"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.specialty || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.email')}</label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.email || ''}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t('staff.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-lg border border-slate-300 p-2"
                  defaultValue={currentStaff?.phone || ''}
                  required
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
