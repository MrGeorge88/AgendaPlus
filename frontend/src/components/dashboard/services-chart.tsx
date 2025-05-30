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
import { useLanguage } from '../../contexts/language-context';
import { cn } from '../../lib/utils';

interface ServiceData {
  name: string;
  count: number;
  revenue: number;
  percentage?: number;
}

interface ServicesChartProps {
  data: ServiceData[];
  type?: 'bar' | 'pie';
  metric?: 'count' | 'revenue';
  height?: number;
  title?: string;
  loading?: boolean;
  className?: string;
}

const COLORS = [
  '#4f46e5', '#ec4899', '#22c55e', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'
];

export function ServicesChart({
  data,
  type = 'bar',
  metric = 'revenue',
  height = 300,
  title,
  loading = false,
  className
}: ServicesChartProps) {
  const { t } = useLanguage();

  // Ordenar datos por la métrica seleccionada
  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);
  
  // Calcular porcentajes para pie chart
  const total = sortedData.reduce((sum, item) => sum + item[metric], 0);
  const chartData = sortedData.map((item, index) => ({
    ...item,
    percentage: total > 0 ? (item[metric] / total) * 100 : 0,
    color: COLORS[index % COLORS.length],
    shortName: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name
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
              <span className="text-sm font-medium">{data.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingresos:</span>
              <span className="text-sm font-medium">${data.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Porcentaje:</span>
              <span className="text-sm font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm font-medium text-gray-900">
              {data.name}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              {metric === 'revenue' ? 'Ingresos' : 'Citas'}: {' '}
              <span className="font-medium">
                {metric === 'revenue' 
                  ? `$${data.revenue.toLocaleString()}` 
                  : data.count
                }
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Porcentaje: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </p>
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
            {title || 'Servicios Más Populares'}
          </h3>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-sm">No hay datos de servicios disponibles</p>
            <p className="text-xs mt-1">Los datos aparecerán cuando tengas citas registradas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {title || `Servicios por ${metric === 'revenue' ? 'Ingresos' : 'Popularidad'}`}
        </h3>
        <p className="text-sm text-gray-500">
          {metric === 'revenue' 
            ? 'Servicios que generan más ingresos'
            : 'Servicios más solicitados por los clientes'
          }
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey={metric}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        ) : (
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              type="number"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => 
                metric === 'revenue' ? `$${value.toLocaleString()}` : value.toString()
              }
            />
            <YAxis 
              type="category"
              dataKey="shortName"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={metric} 
              fill="#4f46e5"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
      
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
          {chartData.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 truncate">{item.name}</span>
              </div>
              <span className="text-gray-900 font-medium ml-2">
                {metric === 'revenue' 
                  ? `$${item.revenue.toLocaleString()}` 
                  : item.count
                }
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
