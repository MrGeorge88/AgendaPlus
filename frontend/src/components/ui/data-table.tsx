import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  actions?: (item: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination = true,
  sorting = true,
  filtering = true,
  pageSize = 10,
  onRowClick,
  emptyState,
  actions,
  className
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Búsqueda global
      if (searchTerm) {
        const searchableValues = columns
          .filter(col => col.filterable !== false)
          .map(col => String(item[col.key] || '').toLowerCase())
          .join(' ');

        if (!searchableValues.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Filtros específicos por columna
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key] || '').toLowerCase();
        return itemValue.includes(value.toLowerCase());
      });
    });
  }, [data, searchTerm, filters, columns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Manejar ordenamiento
  const handleSort = (key: string) => {
    if (!sorting) return;

    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Manejar filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset a la primera página
  };

  // Componente de icono de ordenamiento
  const SortIcon = ({ column }: { column: string }) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ChevronUp className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return <DataTableSkeleton columns={columns} rows={pageSize} />;
  }

  if (data.length === 0 && !searchTerm && Object.keys(filters).length === 0) {
    return emptyState || <DefaultEmptyState />;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barra de búsqueda y filtros */}
      {filtering && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros por columna */}
          <div className="flex gap-2">
            {columns
              .filter(col => col.filterable)
              .map(col => (
                <div key={String(col.key)} className="relative">
                  <input
                    type="text"
                    placeholder={`Filtrar ${col.title}`}
                    className="w-32 rounded border border-slate-300 px-2 py-1 text-xs"
                    value={filters[String(col.key)] || ''}
                    onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
                      sorting && column.sortable !== false && 'cursor-pointer hover:bg-slate-100 group',
                      column.className
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(String(column.key))}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {sorting && column.sortable !== false && (
                        <SortIcon column={String(column.key)} />
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={cn(
                    'hover:bg-slate-50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map(column => (
                    <td
                      key={String(column.key)}
                      className={cn('px-4 py-3 text-sm text-slate-900', column.className)}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right text-sm">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Estado sin resultados */}
      {filteredData.length === 0 && (searchTerm || Object.keys(filters).length > 0) && (
        <div className="text-center py-8">
          <p className="text-slate-500">No se encontraron resultados</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSearchTerm('');
              setFilters({});
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente de paginación
interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-500">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        {/* Números de página */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + Math.max(1, currentPage - 2);
          if (page > totalPages) return null;

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

// Skeleton para la tabla
const DataTableSkeleton: React.FC<{ columns: Column<any>[]; rows: number }> = ({ columns, rows }) => (
  <div className="space-y-4">
    <div className="h-10 bg-slate-200 rounded animate-pulse" />
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-slate-50 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {columns.map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-t">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {columns.map((_, j) => (
              <div key={j} className="h-4 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Estado vacío por defecto
const DefaultEmptyState: React.FC = () => (
  <div className="text-center py-8">
    <p className="text-slate-500">No hay datos para mostrar</p>
  </div>
);

export { DataTableSkeleton, DataTablePagination };
