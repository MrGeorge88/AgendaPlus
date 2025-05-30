import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/setup';
import userEvent from '@testing-library/user-event';
import { DataTable, Column } from '../data-table';

interface TestData {
  id: string;
  name: string;
  email: string;
  age: number;
  status: 'active' | 'inactive';
}

const mockData: TestData[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', age: 30, status: 'active' },
  { id: '2', name: 'María García', email: 'maria@example.com', age: 25, status: 'inactive' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', age: 35, status: 'active' },
];

const mockColumns: Column<TestData>[] = [
  {
    key: 'name',
    title: 'Nombre',
    sortable: true,
    filterable: true,
  },
  {
    key: 'email',
    title: 'Email',
    filterable: true,
  },
  {
    key: 'age',
    title: 'Edad',
    sortable: true,
    render: (value) => `${value} años`,
  },
  {
    key: 'status',
    title: 'Estado',
    render: (value) => (
      <span className={value === 'active' ? 'text-green-600' : 'text-red-600'}>
        {value === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Verificar headers
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    
    // Verificar datos
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText('30 años')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading={true} />);
    
    // Verificar que se muestra el skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    const customEmptyState = <div>No hay resultados</div>;
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        emptyState={customEmptyState}
      />
    );
    
    expect(screen.getByText('No hay resultados')).toBeInTheDocument();
  });

  it('handles sorting', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} columns={mockColumns} sorting={true} />);
    
    const nameHeader = screen.getByText('Nombre');
    
    // Click para ordenar ascendente
    await user.click(nameHeader);
    
    // Verificar que el icono de ordenamiento aparece
    expect(nameHeader.closest('th')).toContainHTML('svg');
    
    // Click para ordenar descendente
    await user.click(nameHeader);
    
    // Los datos deberían estar ordenados (verificar orden)
    const rows = screen.getAllByRole('row');
    // Excluir header row
    const dataRows = rows.slice(1);
    expect(dataRows[0]).toHaveTextContent('María García');
  });

  it('handles global search', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} columns={mockColumns} filtering={true} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    
    await user.type(searchInput, 'Juan');
    
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.queryByText('María García')).not.toBeInTheDocument();
    });
  });

  it('handles pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + i,
      status: i % 2 === 0 ? 'active' : 'inactive' as const,
    }));

    render(
      <DataTable 
        data={largeData} 
        columns={mockColumns} 
        pagination={true}
        pageSize={10}
      />
    );
    
    // Verificar que solo se muestran 10 elementos
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(11); // 10 data rows + 1 header row
    
    // Verificar controles de paginación
    expect(screen.getByText('Mostrando 1 a 10 de 25 resultados')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
  });

  it('handles row click', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        onRowClick={onRowClick}
      />
    );
    
    const firstRow = screen.getAllByRole('row')[1]; // Skip header
    await user.click(firstRow);
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders action buttons', () => {
    const actions = (item: TestData) => (
      <button onClick={() => console.log('Edit', item.id)}>
        Editar
      </button>
    );
    
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        actions={actions}
      />
    );
    
    expect(screen.getByText('Acciones')).toBeInTheDocument();
    expect(screen.getAllByText('Editar')).toHaveLength(mockData.length);
  });

  it('disables features when props are false', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        sorting={false}
        filtering={false}
        pagination={false}
      />
    );
    
    // No debería haber input de búsqueda
    expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument();
    
    // No debería haber controles de paginación
    expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
    
    // Los headers no deberían ser clickeables para ordenar
    const nameHeader = screen.getByText('Nombre');
    expect(nameHeader.closest('th')).not.toHaveClass('cursor-pointer');
  });

  it('shows no results message when filtered', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} columns={mockColumns} filtering={true} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    await user.type(searchInput, 'NoExiste');
    
    await waitFor(() => {
      expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
      expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
    });
  });

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<DataTable data={mockData} columns={mockColumns} filtering={true} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar...');
    await user.type(searchInput, 'NoExiste');
    
    await waitFor(() => {
      expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
    });
    
    const clearButton = screen.getByText('Limpiar filtros');
    await user.click(clearButton);
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        className="custom-table"
      />
    );
    
    expect(document.querySelector('.custom-table')).toBeInTheDocument();
  });
});
