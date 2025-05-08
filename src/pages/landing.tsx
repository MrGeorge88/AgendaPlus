import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Calendar, Users, CreditCard, BarChart3 } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between p-4 text-white">
        <div className="text-2xl font-bold">AgendaPlus</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#features" className="hover:underline">Características</a>
            </li>
            <li>
              <a href="#pricing" className="hover:underline">Precios</a>
            </li>
            <li>
              <Link to="/dashboard">
                <Button variant="secondary">Iniciar sesión</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Gestiona tu negocio con la mínima fricción
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl">
          La plataforma todo-en-uno para profesionales de belleza, salud y wellness.
          Agenda, cobros y métricas en un solo lugar.
        </p>
        <Link to="/dashboard">
          <Button size="lg" variant="secondary" className="text-lg">
            Probar demo
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Características principales</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="card flex flex-col items-center p-6 text-center">
              <Calendar className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Agenda inteligente</h3>
              <p className="text-slate-600">
                Gestiona citas con drag-and-drop, filtra por profesional o sucursal.
              </p>
            </div>
            <div className="card flex flex-col items-center p-6 text-center">
              <Users className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Gestión de clientes</h3>
              <p className="text-slate-600">
                Ficha completa con historial de citas y pagos para fidelizar clientes.
              </p>
            </div>
            <div className="card flex flex-col items-center p-6 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Pagos integrados</h3>
              <p className="text-slate-600">
                Cobra depósitos o pagos completos con Stripe o MercadoPago.
              </p>
            </div>
            <div className="card flex flex-col items-center p-6 text-center">
              <BarChart3 className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Métricas de negocio</h3>
              <p className="text-slate-600">
                Analiza ingresos y descubre qué servicios generan mayor margen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Planes simples y transparentes</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card p-6">
              <h3 className="mb-2 text-xl font-bold">Básico</h3>
              <p className="mb-4 text-3xl font-bold">€29<span className="text-sm text-slate-500">/mes</span></p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> 1 profesional
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Agenda ilimitada
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Clientes ilimitados
                </li>
              </ul>
              <Button variant="outline" className="w-full">Elegir plan</Button>
            </div>
            <div className="card border-2 border-primary p-6">
              <div className="mb-4 -mt-10 rounded-full bg-primary px-4 py-1 text-center text-sm text-white">
                Más popular
              </div>
              <h3 className="mb-2 text-xl font-bold">Profesional</h3>
              <p className="mb-4 text-3xl font-bold">€49<span className="text-sm text-slate-500">/mes</span></p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Hasta 5 profesionales
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Agenda ilimitada
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Clientes ilimitados
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Recordatorios automáticos
                </li>
              </ul>
              <Button className="w-full">Elegir plan</Button>
            </div>
            <div className="card p-6">
              <h3 className="mb-2 text-xl font-bold">Empresarial</h3>
              <p className="mb-4 text-3xl font-bold">€99<span className="text-sm text-slate-500">/mes</span></p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Profesionales ilimitados
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Múltiples sucursales
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Análisis avanzado
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span> Soporte prioritario
                </li>
              </ul>
              <Button variant="outline" className="w-full">Elegir plan</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold">¿Listo para transformar tu negocio?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Únete a miles de profesionales que ya optimizan su tiempo y aumentan sus ingresos con AgendaPlus.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg">
              Comenzar ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 text-center text-white">
        <div className="container mx-auto px-4">
          <p>© 2023 AgendaPlus. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
