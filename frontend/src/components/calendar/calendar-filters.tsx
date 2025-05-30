import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Filter, X, Calendar, Clock, DollarSign, User } from 'lucide-react';
import { useLanguage } from '../../contexts/language-context';

interface CalendarFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  staffMembers: Array<{ id: string; name: string; color: string }>;
}

export interface FilterState {
  status: string[];
  paymentStatus: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  staff: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

const initialFilters: FilterState = {
  status: [],
  paymentStatus: [],
  dateRange: { start: null, end: null },
  staff: [],
  priceRange: { min: null, max: null },
};

export function CalendarFilters({ onFiltersChange, staffMembers }: CalendarFiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'confirmed', label: t('appointments.status.confirmed'), color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: t('appointments.status.completed'), color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: t('appointments.status.cancelled'), color: 'bg-red-100 text-red-800' },
    { value: 'no-show', label: t('appointments.status.noShow'), color: 'bg-orange-100 text-orange-800' },
    { value: 'pending', label: t('appointments.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
  ];

  const paymentStatusOptions = [
    { value: 'paid', label: t('calendar.paid'), color: 'bg-green-100 text-green-800' },
    { value: 'partial', label: t('calendar.partial'), color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending', label: t('calendar.pending'), color: 'bg-gray-100 text-gray-800' },
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleArrayFilter = (category: keyof FilterState, value: string) => {
    const currentArray = filters[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [category]: newArray });
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.status.length > 0 ||
      filters.paymentStatus.length > 0 ||
      filters.staff.length > 0 ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">{t('calendar.filters')}</span>
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-2">
              {filters.status.length + filters.paymentStatus.length + filters.staff.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              {t('common.clear')}
            </Button>
          )}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
          >
            {isExpanded ? t('common.collapse') : t('common.expand')}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Filtro por estado */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t('calendar.status')}
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.status.includes(option.value) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.status.includes(option.value) ? option.color : ''
                  }`}
                  onClick={() => toggleArrayFilter('status', option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filtro por estado de pago */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {t('calendar.paymentStatus')}
            </label>
            <div className="flex flex-wrap gap-2">
              {paymentStatusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.paymentStatus.includes(option.value) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.paymentStatus.includes(option.value) ? option.color : ''
                  }`}
                  onClick={() => toggleArrayFilter('paymentStatus', option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filtro por personal */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <User className="h-3 w-3" />
              {t('calendar.staff')}
            </label>
            <div className="flex flex-wrap gap-2">
              {staffMembers.map((staff) => (
                <Badge
                  key={staff.id}
                  variant={filters.staff.includes(staff.id) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  style={{
                    backgroundColor: filters.staff.includes(staff.id) ? staff.color : 'transparent',
                    color: filters.staff.includes(staff.id) ? 'white' : 'inherit',
                    borderColor: staff.color,
                  }}
                  onClick={() => toggleArrayFilter('staff', staff.id)}
                >
                  {staff.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rango de fechas */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t('calendar.dateRange')}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  updateFilters({
                    dateRange: { ...filters.dateRange, start: date }
                  });
                }}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder={t('calendar.startDate')}
              />
              <input
                type="date"
                value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  updateFilters({
                    dateRange: { ...filters.dateRange, end: date }
                  });
                }}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder={t('calendar.endDate')}
              />
            </div>
          </div>

          {/* Rango de precios */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {t('calendar.priceRange')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.priceRange.min || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  updateFilters({
                    priceRange: { ...filters.priceRange, min: value }
                  });
                }}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder={t('calendar.minPrice')}
                min="0"
              />
              <input
                type="number"
                value={filters.priceRange.max || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  updateFilters({
                    priceRange: { ...filters.priceRange, max: value }
                  });
                }}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder={t('calendar.maxPrice')}
                min="0"
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
