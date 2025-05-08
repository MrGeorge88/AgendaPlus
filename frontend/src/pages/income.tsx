import { useState } from 'react';
import { Layout } from '../components/layout/layout';
import { Card } from '../components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';

// Datos de ejemplo para ingresos
const mockIncomeData = {
  totalToday: 350,
  totalWeek: 1850,
  totalMonth: 7500,
  appointmentsToday: 8,
  clientsToday: 6,
  monthlyData: [
    { month: 'Ene', income: 6200 },
    { month: 'Feb', income: 6800 },
    { month: 'Mar', income: 7100 },
    { month: 'Abr', income: 6900 },
    { month: 'May', income: 7500 },
    { month: 'Jun', income: 0 },
    { month: 'Jul', income: 0 },
    { month: 'Ago', income: 0 },
    { month: 'Sep', income: 0 },
    { month: 'Oct', income: 0 },
    { month: 'Nov', income: 0 },
    { month: 'Dic', income: 0 },
  ],
  topServices: [
    { name: 'Corte de cabello', count: 45, income: 1125 },
    { name: 'Tinte', count: 28, income: 1400 },
    { name: 'Manicura', count: 36, income: 720 },
    { name: 'Pedicura', count: 22, income: 550 },
    { name: 'Masaje', count: 18, income: 720 },
  ],
  topStaff: [
    { name: 'Ana García', count: 42, income: 1680 },
    { name: 'Carlos Rodríguez', count: 38, income: 1520 },
    { name: 'Elena Martínez', count: 35, income: 1400 },
    { name: 'David López', count: 30, income: 1200 },
  ],
};

export function Income() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(mockIncomeData);

  // Función para calcular la altura de las barras en el gráfico
  const getBarHeight = (value: number) => {
    const maxValue = Math.max(...data.monthlyData.map(item => item.income));
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  return (
    <Layout title={t('income.title')}>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card flex items-center p-4">
          <div className="mr-4 rounded-full bg-primary/10 p-3 text-primary" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
            <DollarSign className="h-6 w-6" style={{ color: '#4f46e5' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('income.todayIncome')}</p>
            <h3 className="text-2xl font-bold">{data.totalToday}€</h3>
          </div>
        </div>
        <div className="card flex items-center p-4">
          <div className="mr-4 rounded-full p-3" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
            <TrendingUp className="h-6 w-6" style={{ color: '#ec4899' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('income.weekIncome')}</p>
            <h3 className="text-2xl font-bold">{data.totalWeek}€</h3>
          </div>
        </div>
        <div className="card flex items-center p-4">
          <div className="mr-4 rounded-full p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <BarChart3 className="h-6 w-6" style={{ color: '#22c55e' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('income.monthIncome')}</p>
            <h3 className="text-2xl font-bold">{data.totalMonth}€</h3>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card flex items-center p-4">
          <div className="mr-4 rounded-full p-3" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Calendar className="h-6 w-6" style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('income.appointmentsToday')}</p>
            <h3 className="text-2xl font-bold">{data.appointmentsToday}</h3>
          </div>
        </div>
        <div className="card flex items-center p-4">
          <div className="mr-4 rounded-full p-3" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
            <Users className="h-6 w-6" style={{ color: '#a855f7' }} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('income.clientsToday')}</p>
            <h3 className="text-2xl font-bold">{data.clientsToday}</h3>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t('income.monthlyIncome')}</h3>
            <div className="flex rounded-lg border border-slate-200">
              <button
                className={`px-3 py-1 text-sm ${period === 'month' ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
                style={{ backgroundColor: period === 'month' ? '#4f46e5' : 'white', color: period === 'month' ? 'white' : '#64748b' }}
                onClick={() => setPeriod('month')}
              >
                {t('income.month')}
              </button>
              <button
                className={`px-3 py-1 text-sm ${period === 'year' ? 'bg-primary text-white' : 'bg-white text-slate-600'}`}
                style={{ backgroundColor: period === 'year' ? '#4f46e5' : 'white', color: period === 'year' ? 'white' : '#64748b' }}
                onClick={() => setPeriod('year')}
              >
                {t('income.year')}
              </button>
            </div>
          </div>
          <div className="flex h-64 items-end justify-between">
            {data.monthlyData.map((item, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full max-w-[30px] rounded-t"
                  style={{
                    height: `${getBarHeight(item.income)}%`,
                    backgroundColor: '#4f46e5',
                    minHeight: item.income > 0 ? '4px' : '0'
                  }}
                ></div>
                <p className="mt-2 text-xs text-slate-500">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-4">
          <h3 className="mb-4 text-lg font-bold">{t('income.topServices')}</h3>
          <div className="space-y-4">
            {data.topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-slate-500">{service.count} {t('income.appointments')}</p>
                </div>
                <p className="font-bold">{service.income}€</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="mb-4 text-lg font-bold">{t('income.topStaff')}</h3>
          <div className="space-y-4">
            {data.topStaff.map((staff, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-slate-500">{staff.count} {t('income.appointments')}</p>
                </div>
                <p className="font-bold">{staff.income}€</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
