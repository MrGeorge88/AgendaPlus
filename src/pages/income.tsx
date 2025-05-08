import { useState } from "react";
import { Layout } from "../components/layout/layout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, DollarSign, TrendingUp, Users, Clock } from "lucide-react";

// Mock data for income metrics
const mockMetrics = {
  today: 320,
  week: 1850,
  month: 7500,
  appointmentsToday: 8,
  appointmentsWeek: 42,
  appointmentsMonth: 180,
  averageTicket: 40,
  topServices: [
    { name: "Masaje relajante", revenue: 1800, margin: 1200, count: 30 },
    { name: "Tinte", revenue: 1500, margin: 750, count: 30 },
    { name: "Corte de cabello", revenue: 1250, margin: 750, count: 50 },
    { name: "Manicura", revenue: 1000, margin: 600, count: 50 },
    { name: "Pedicura", revenue: 900, margin: 540, count: 30 },
  ],
  topStaff: [
    { name: "Elena Martínez", revenue: 5700, appointmentsCount: 95, color: "#10b981" },
    { name: "Ana García", revenue: 3000, appointmentsCount: 120, color: "#4f46e5" },
    { name: "Carlos Rodríguez", revenue: 1700, appointmentsCount: 85, color: "#ec4899" },
  ],
  revenueByDay: [
    { day: "Lunes", revenue: 850 },
    { day: "Martes", revenue: 750 },
    { day: "Miércoles", revenue: 900 },
    { day: "Jueves", revenue: 1200 },
    { day: "Viernes", revenue: 1500 },
    { day: "Sábado", revenue: 1800 },
    { day: "Domingo", revenue: 500 },
  ],
};

export function Income() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  return (
    <Layout title="Ingresos">
      <div className="space-y-6">
        <div className="flex space-x-2">
          <Button
            variant={period === "today" ? "default" : "outline"}
            onClick={() => setPeriod("today")}
          >
            Hoy
          </Button>
          <Button
            variant={period === "week" ? "default" : "outline"}
            onClick={() => setPeriod("week")}
          >
            Esta semana
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            onClick={() => setPeriod("month")}
          >
            Este mes
          </Button>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ingresos</p>
              <p className="text-2xl font-bold">
                {period === "today" && `${mockMetrics.today}€`}
                {period === "week" && `${mockMetrics.week}€`}
                {period === "month" && `${mockMetrics.month}€`}
              </p>
            </div>
          </Card>

          <Card className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Citas</p>
              <p className="text-2xl font-bold">
                {period === "today" && mockMetrics.appointmentsToday}
                {period === "week" && mockMetrics.appointmentsWeek}
                {period === "month" && mockMetrics.appointmentsMonth}
              </p>
            </div>
          </Card>

          <Card className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ticket medio</p>
              <p className="text-2xl font-bold">{mockMetrics.averageTicket}€</p>
            </div>
          </Card>

          <Card className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-orange-100 p-3 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ocupación</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </Card>
        </div>

        {/* Top services and staff */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Top servicios por margen</h3>
            <div className="space-y-4">
              {mockMetrics.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-slate-500">{service.count} citas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{service.margin}€</p>
                    <p className="text-sm text-slate-500">{service.revenue}€ ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Top profesionales</h3>
            <div className="space-y-4">
              {mockMetrics.topStaff.map((staff, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="mr-4 flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: staff.color }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-slate-500">{staff.appointmentsCount} citas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{staff.revenue}€</p>
                    <p className="text-sm text-slate-500">
                      {Math.round(staff.revenue / staff.appointmentsCount)}€ por cita
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Revenue by day */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-bold">Ingresos por día de la semana</h3>
          <div className="h-64">
            <div className="flex h-full items-end space-x-6">
              {mockMetrics.revenueByDay.map((day, index) => {
                const maxRevenue = Math.max(...mockMetrics.revenueByDay.map(d => d.revenue));
                const height = (day.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-lg bg-primary"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium">{day.day}</p>
                      <p className="text-sm font-bold">{day.revenue}€</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
