import { Layout } from "../components/layout/layout";
import { useLanguage } from "../contexts/language-context";
import {
  MetricCard,
  MetricGrid,
  RevenueChart,
  AppointmentsChart,
  ServicesChart,
  StaffPerformanceChart,
  MetricCardVariants
} from "../components/dashboard";
import { useDashboardMetrics, useTrendMetrics, useTopServices } from "../hooks/use-dashboard-analytics";
import {
  DollarSign,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  Award
} from 'lucide-react';

export function Dashboard() {
  const { t } = useLanguage();

  const {
    incomeStats,
    revenueByPeriod,
    appointmentsByStatus,
    staffPerformance,
    isLoading
  } = useDashboardMetrics();

  const trendMetrics = useTrendMetrics();
  const topServices = useTopServices();

  return (
    <Layout title={t('navigation.overview')}>
      <div className="space-y-6">
        {/* Métricas principales */}
        <MetricGrid columns={4}>
          <MetricCard
            title={t('dashboard.metrics.todayRevenue')}
            value={`$${incomeStats.data?.totalToday || 0}`}
            icon={DollarSign}
            {...MetricCardVariants.revenue}
            trend={trendMetrics.data?.revenue ? {
              value: Math.round(trendMetrics.data.revenue.trend),
              isPositive: trendMetrics.data.revenue.isPositive,
              period: 'mes anterior'
            } : undefined}
            loading={isLoading}
          />

          <MetricCard
            title={t('dashboard.metrics.weekRevenue')}
            value={`$${incomeStats.data?.totalWeek || 0}`}
            icon={TrendingUp}
            {...MetricCardVariants.growth}
            loading={isLoading}
          />

          <MetricCard
            title={t('dashboard.metrics.monthRevenue')}
            value={`$${incomeStats.data?.totalMonth || 0}`}
            icon={BarChart3}
            {...MetricCardVariants.success}
            loading={isLoading}
          />

          <MetricCard
            title={t('dashboard.metrics.todayAppointments')}
            value={incomeStats.data?.appointmentsToday || 0}
            icon={CalendarIcon}
            {...MetricCardVariants.info}
            trend={trendMetrics.data?.appointments ? {
              value: Math.round(trendMetrics.data.appointments.trend),
              isPositive: trendMetrics.data.appointments.isPositive,
              period: 'mes anterior'
            } : undefined}
            loading={isLoading}
          />
        </MetricGrid>

        {/* Métricas secundarias */}
        <MetricGrid columns={3}>
          <MetricCard
            title={t('dashboard.metrics.todayClients')}
            value={incomeStats.data?.clientsToday || 0}
            icon={Users}
            {...MetricCardVariants.purple}
            loading={isLoading}
          />

          <MetricCard
            title="Eficiencia Promedio"
            value="85%"
            icon={Target}
            {...MetricCardVariants.warning}
            subtitle="Basado en tiempo de citas"
            loading={isLoading}
          />

          <MetricCard
            title="Satisfacción Cliente"
            value="4.8/5"
            icon={Award}
            {...MetricCardVariants.success}
            subtitle="Promedio de calificaciones"
            loading={isLoading}
          />
        </MetricGrid>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart
            data={revenueByPeriod.data || []}
            type="area"
            showAppointments={true}
            loading={revenueByPeriod.isLoading}
          />

          <AppointmentsChart
            data={appointmentsByStatus.data || []}
            type="pie"
            title="Estado de Citas"
            loading={appointmentsByStatus.isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServicesChart
            data={topServices.data || []}
            type="bar"
            metric="revenue"
            title="Servicios Más Rentables"
            loading={topServices.isLoading}
          />

          <StaffPerformanceChart
            data={staffPerformance.data || []}
            type="bar"
            metric="revenue"
            title="Rendimiento del Personal"
            loading={staffPerformance.isLoading}
          />
        </div>
      </div>
    </Layout>
  );
}
