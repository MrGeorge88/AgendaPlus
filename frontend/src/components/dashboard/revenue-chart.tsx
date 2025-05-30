import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '../../contexts/language-context';
import { cn } from '../../lib/utils';

interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
  period?: string;
}

interface RevenueChartProps {
  data: RevenueData[];
  type?: 'line' | 'area';
  height?: number;
  showAppointments?: boolean;
  loading?: boolean;
  className?: string;
}

export function RevenueChart({
  data,
  type = 'area',
  height = 300,
  showAppointments = false,
  loading = false,
  className
}: RevenueChartProps) {
  const { language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd', { locale }),
    formattedRevenue: `$${item.revenue.toLocaleString()}`
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.dataKey === 'revenue' ? 'Ingresos' : 'Citas'}: 
              </span>
              <span className="text-sm font-medium">
                {entry.dataKey === 'revenue' 
                  ? `$${entry.value.toLocaleString()}` 
                  : entry.value
                }
              </span>
            </div>
          ))}
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

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <div className={cn("card p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Ingresos por Período
        </h3>
        <p className="text-sm text-gray-500">
          Evolución de ingresos {showAppointments && 'y citas'} en el tiempo
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="formattedDate" 
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
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {type === 'area' ? (
            <>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                {showAppointments && (
                  <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                )}
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              {showAppointments && (
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fill="url(#appointmentsGradient)"
                  yAxisId="right"
                />
              )}
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
              />
              {showAppointments && (
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ec4899', strokeWidth: 2 }}
                  yAxisId="right"
                />
              )}
            </>
          )}
          
          {showAppointments && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
