import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useLanguage } from '../../contexts/language-context';
import { cn } from '../../lib/utils';

interface StaffData {
  name: string;
  appointments: number;
  revenue: number;
  rating?: number;
  efficiency?: number;
  clientSatisfaction?: number;
}

interface StaffPerformanceChartProps {
  data: StaffData[];
  type?: 'bar' | 'radar';
  metric?: 'appointments' | 'revenue';
  height?: number;
  title?: string;
  loading?: boolean;
  className?: string;
}

const COLORS = ['#4f46e5', '#ec4899', '#22c55e', '#f59e0b', '#8b5cf6'];

export function StaffPerformanceChart({
  data,
  type = 'bar',
  metric = 'revenue',
  height = 300,
  title,
  loading = false,
  className
}: StaffPerformanceChartProps) {
  const { t } = useLanguage();

  // Ordenar datos por la métrica seleccionada
  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);
  
  const chartData = sortedData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
    shortName: item.name.length > 12 ? `${item.name.substring(0, 12)}...` : item.name,
    // Normalizar métricas para radar chart (0-100)
    normalizedAppointments: data.length > 0 ? (item.appointments / Math.max(...data.map(d => d.appointments))) * 100 : 0,
    normalizedRevenue: data.length > 0 ? (item.revenue / Math.max(...data.map(d => d.revenue))) * 100 : 0,
    normalizedRating: (item.rating || 0) * 20, // Convertir de 0-5 a 0-100
    normalizedEfficiency: item.efficiency || 0,
    normalizedSatisfaction: item.clientSatisfaction || 0
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          <p className="text-sm font-medium text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Citas:</span>
              <span className="text-sm font-medium">{data.appointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos:</span>
              <span className="text-sm font-medium">${data.revenue.toLocaleString()}</span>
            </div>
            {data.rating && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Calificación:</span>
                <span className="text-sm font-medium">{data.rating.toFixed(1)}/5</span>
              </div>
            )}
            {data.efficiency && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiencia:</span>
                <span className="text-sm font-medium">{data.efficiency}%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const RadarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{label}:</span>
              <span className="text-sm font-medium">
                {label === 'Citas' && data.appointments}
                {label === 'Ingresos' && `$${data.revenue.toLocaleString()}`}
                {label === 'Calificación' && `${(data.rating || 0).toFixed(1)}/5`}
                {label === 'Eficiencia' && `${data.efficiency || 0}%`}
                {label === 'Satisfacción' && `${data.clientSatisfaction || 0}%`}
              </span>
            </div>
          </div>
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

  if (chartData.length === 0) {
    return (
      <div className={cn("card p-6", className)}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {title || 'Rendimiento del Personal'}
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No hay datos de personal disponibles</p>
            <p className="text-xs mt-1">Los datos aparecerán cuando tengas personal registrado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {title || `Rendimiento por ${metric === 'revenue' ? 'Ingresos' : 'Citas'}`}
        </h3>
        <p className="text-sm text-gray-500">
          {type === 'radar' 
            ? 'Análisis multidimensional del rendimiento'
            : `Personal ordenado por ${metric === 'revenue' ? 'ingresos generados' : 'número de citas'}`
          }
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'radar' ? (
          <RadarChart data={chartData}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis 
              dataKey="shortName" 
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <Radar
              name="Citas"
              dataKey="normalizedAppointments"
              stroke="#4f46e5"
              fill="#4f46e5"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Ingresos"
              dataKey="normalizedRevenue"
              stroke="#ec4899"
              fill="#ec4899"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="shortName" 
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
              tickFormatter={(value) => 
                metric === 'revenue' ? `$${value.toLocaleString()}` : value.toString()
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={metric} 
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
      
      {type === 'bar' && (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {chartData.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-gray-900 font-medium">
                  {metric === 'revenue' 
                    ? `$${item.revenue.toLocaleString()}` 
                    : `${item.appointments} citas`
                  }
                </div>
                {item.rating && (
                  <div className="text-xs text-gray-500">
                    ⭐ {item.rating.toFixed(1)}/5
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
