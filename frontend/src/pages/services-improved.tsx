import React, { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { DataTable, Column } from '../components/ui/data-table';
import { ServiceForm } from '../components/forms/service-form';
import { Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { useServices, useDeleteService } from '../hooks/use-services';
import { useLanguage } from '../contexts/language-context';
import { Service } from '../contexts/app-context';
import { ComponentErrorBoundary, DataErrorFallback } from '../components/ui/error-boundary';
import { EmptyServices } from '../components/ui/empty-state';
import { normalizeQueryState } from '../hooks/useAsyncState';

export function ServicesImproved() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // React Query hooks
  const servicesQuery = useServices();
  const deleteServiceMutation = useDeleteService();

  // Normalizar estado
  const { data: services, loading, error } = normalizeQueryState(servicesQuery);

  // Definir columnas de la tabla
  const columns: Column<Service>[] = [
    {
      key: 'name',
      title: 'Nombre',
      sortable: true,
      filterable: true,
      render: (value, service) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{service.category}</div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Descripción',
      filterable: true,
      render: (value) => (
        <div className="max-w-xs truncate text-slate-600">
          {value || 'Sin descripción'}
        </div>
      )
    },
    {
      key: 'duration',
      title: 'Duración',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-slate-600">
          <Clock className="mr-1 h-4 w-4" />
          {value} min
        </div>
      ),
      className: 'text-center',
      width: '120px'
    },
    {
      key: 'price',
      title: 'Precio',
      sortable: true,
      render: (value) => (
        <div className="flex items-center font-medium text-slate-900">
          <DollarSign className="mr-1 h-4 w-4 text-green-600" />
          {value}
        </div>
      ),
      className: 'text-right',
      width: '100px'
    }
  ];

  // Manejar acciones
  const handleAddService = () => {
    setCurrentService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (service: Service) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.name}"?`)) {
      deleteServiceMutation.mutate(service.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentService(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentService(null);
  };

  // Renderizar acciones para cada fila
  const renderActions = (service: Service) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleEditService(service);
        }}
        disabled={deleteServiceMutation.isPending}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteService(service);
        }}
        disabled={deleteServiceMutation.isPending}
        className="text-red-600 hover:text-red-700 hover:border-red-300"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Layout title={t('services.title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('services.title')}</h1>
            <p className="text-slate-600">
              Gestiona los servicios que ofreces a tus clientes
            </p>
          </div>
          <Button onClick={handleAddService} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('services.new')}
          </Button>
        </div>

        {/* Contenido principal */}
        <ComponentErrorBoundary componentName="Lista de Servicios">
          {error ? (
            <DataErrorFallback
              error={new Error(error)}
              onRetry={() => servicesQuery.refetch()}
              title="Error al cargar servicios"
            />
          ) : !services || services.length === 0 ? (
            <EmptyServices onCreateService={handleAddService} />
          ) : (
            <DataTable
              data={services}
              columns={columns}
              loading={loading}
              actions={renderActions}
              pagination={true}
              sorting={true}
              filtering={true}
              pageSize={10}
              emptyState={<EmptyServices onCreateService={handleAddService} />}
            />
          )}
        </ComponentErrorBoundary>

        {/* Modal del formulario */}
        <Modal
          isOpen={showForm}
          onClose={handleFormCancel}
          title={currentService ? 'Editar Servicio' : 'Nuevo Servicio'}
          size="lg"
        >
          <ServiceForm
            service={currentService}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Modal>
      </div>
    </Layout>
  );
}

export default ServicesImproved;
