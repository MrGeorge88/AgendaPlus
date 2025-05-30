import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '../../contexts/language-context';
import { cn } from '../../lib/utils';

interface AppointmentData {
  date?: string;
  hour?: string;
  count: number;
  status?: string;
  label?: string;
}

interface AppointmentsChartProps {
  data: AppointmentData[];
  type?: 'bar' | 'pie';
  height?: number;
  title?: string;
  loading?: boolean;
  className?: string;
}

const STATUS_COLORS = {
  confirmed: '#22c55e',
  completed: '#4f46e5',
  cancelled: '#ef4444',
  pending: '#f59e0b',
  'no-show': '#6b7280'
};

export function AppointmentsChart({
  data,
  type = 'bar',
  height = 300,
  title,
  loading = false,
  className
}: AppointmentsChartProps) {
  const { language, t } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  // Formatear datos según el tipo de gráfico
  const chartData = data.map(item => ({
    ...item,
    formattedDate: item.date ? format(new Date(item.date), 'MMM dd', { locale }) : item.hour || item.label,
    displayLabel: item.label || (item.date ? format(new Date(item.date), 'dd/MM', { locale }) : item.hour)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-sm text-gray-600">Citas:</span>
            <span className="text-sm font-medium">{payload[0].value}</span>
          </div>
          {data.status && (
            <p className="text-xs text-gray-500 mt-1">
              Estado: {t(`appointments.status.${data.status}`)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm font-medium text-gray-900">
              {data.payload.displayLabel}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {data.value} citas ({((data.value / data.payload.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={cn("card p-6", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Calcular total para el pie chart
  const totalAppointments = chartData.reduce((sum, item) => sum + item.count, 0);
  const pieData = chartData.map(item => ({
    ...item,
    total: totalAppointments
  }));

  return (
    <div className={cn("card p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {title || (type === 'pie' ? 'Distribución de Citas' : 'Citas por Período')}
        </h3>
        <p className="text-sm text-gray-500">
          {type === 'pie' 
            ? 'Distribución por estado o categoría'
            : 'Número de citas programadas'
          }
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#8884d8'} 
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="displayLabel" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
      
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#8884d8' 
                }}
              />
              <span className="text-gray-600 truncate">
                {item.displayLabel}: {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
