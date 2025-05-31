import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useSimpleTranslation } from '../lib/translations';
import { LanguageSwitcher } from '../components/ui/language-switcher';
import { ArrowRight, Calendar, Bell, BarChart2, CreditCard, ChevronRight, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';

// Imagen del dashboard - usando una imagen más representativa
const AppScreenshot = 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

export function Landing() {
  const { t, ready } = useSimpleTranslation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Moderno y minimalista */}
      <nav className="border-b border-gray-100" style={{ borderBottomWidth: '1px', borderBottomColor: '#f3f4f6' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <div className="flex h-16 items-center justify-between" style={{ display: 'flex', height: '4rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
                <span className="text-xl font-bold text-indigo-600" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4f46e5' }}>AgendaPlus</span>
              </Link>
            </div>
            <div className="hidden md:block" style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
              <div className="ml-10 flex items-center space-x-4" style={{ marginLeft: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200" style={{ color: '#4b5563', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: '500', transition: 'color 0.2s ease' }}>
                  {t('landing.features.title', 'Características')}
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200" style={{ color: '#4b5563', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: '500', transition: 'color 0.2s ease' }}>
                  Cómo funciona
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200" style={{ color: '#4b5563', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: '500', transition: 'color 0.2s ease' }}>
                  Testimonios
                </a>
                <LanguageSwitcher variant="minimal" />
              </div>
            </div>
            <div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200" style={{ color: '#4b5563', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: '500', transition: 'color 0.2s ease' }}>
                {t('auth.login', 'Iniciar sesión')}
              </Link>
              <Link to="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition duration-200" style={{ backgroundColor: '#4f46e5', color: 'white', transition: 'background-color 0.2s ease' }}>
                  {t('auth.register', 'Registrarse')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Configuration Banner - Solo mostrar si Supabase no está configurado */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </span>
                <p className="ml-3 font-medium text-yellow-800">
                  <span className="md:hidden">Configuración pendiente</span>
                  <span className="hidden md:inline">
                    La aplicación está en modo demo. Para funcionalidad completa, configure las variables de entorno de Supabase.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Moderno con ilustración */}
      <section className="relative bg-white overflow-hidden" style={{ position: 'relative', backgroundColor: 'white', overflow: 'hidden' }}>
        <div className="mx-auto max-w-7xl" style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32" style={{ position: 'relative', zIndex: 10, paddingBottom: '2rem', backgroundColor: 'white' }}>
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28" style={{ marginTop: '2.5rem', maxWidth: '80rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <div className="sm:text-center lg:text-left" style={{ '@media (min-width: 640px)': { textAlign: 'center' }, '@media (min-width: 1024px)': { textAlign: 'left' } }}>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl" style={{ fontSize: '2.25rem', lineHeight: '2.5rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.025em' }}>
                  <span className="block" style={{ display: 'block' }}>Gestiona tu negocio</span>
                  <span className="block text-indigo-600" style={{ display: 'block', color: '#4f46e5' }}>con eficiencia</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0" style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#6b7280' }}>
                  La plataforma todo-en-uno para profesionales de belleza, salud y wellness. Agenda, cobros y métricas en un solo lugar.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start" style={{ marginTop: '1.25rem', '@media (min-width: 640px)': { display: 'flex', justifyContent: 'center' }, '@media (min-width: 1024px)': { justifyContent: 'flex-start' } }}>
                  <div className="rounded-md shadow" style={{ borderRadius: '0.375rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                    <Link to="/register">
                      <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-200" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 2rem', border: 'none', fontSize: '1rem', fontWeight: '500', borderRadius: '0.375rem', color: 'white', backgroundColor: '#4f46e5', transition: 'background-color 0.2s ease' }}>
                        Comenzar gratis
                        <ArrowRight className="ml-2 h-5 w-5" style={{ marginLeft: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3" style={{ marginTop: '0.75rem', '@media (min-width: 640px)': { marginTop: 0, marginLeft: '0.75rem' } }}>
                    <a href="#how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition duration-200" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 2rem', border: 'none', fontSize: '1rem', fontWeight: '500', borderRadius: '0.375rem', color: '#4338ca', backgroundColor: '#e0e7ff', transition: 'background-color 0.2s ease' }}>
                      Cómo funciona
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2" style={{ '@media (min-width: 1024px)': { position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%' } }}>
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full shadow-lg rounded-bl-2xl"
            style={{ height: '14rem', width: '100%', objectFit: 'cover', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', borderBottomLeftRadius: '1rem' }}
            src={AppScreenshot}
            alt="AgendaPlus dashboard"
          />
        </div>
      </section>

      {/* Features Section - Diseño moderno con tarjetas elevadas */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {t('landing.features.title')}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Herramientas diseñadas para simplificar tu día a día y potenciar tu crecimiento.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">{t('landing.features.calendar.title')}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('landing.features.calendar.description')}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <Bell className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Recordatorios automáticos</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Reduce cancelaciones con notificaciones por email y SMS a tus clientes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <BarChart2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">{t('landing.features.metrics.title')}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('landing.features.metrics.description')}
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">{t('landing.features.payments.title')}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {t('landing.features.payments.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Cómo funciona</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tres pasos simples para empezar
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comienza a usar AgendaPlus en minutos, sin complicaciones.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="relative flex items-center justify-center h-40">
                  <img
                    className="h-full"
                    src="https://placehold.co/300x200/e2e8f0/475569?text=Paso+1"
                    alt="Paso 1"
                  />
                  <div className="absolute top-0 right-0 -mr-8 -mt-2 flex items-center justify-center rounded-full bg-indigo-600 p-1 w-8 h-8">
                    <span className="text-white font-medium">1</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Crea tu cuenta</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Regístrate en menos de 2 minutos y configura tu perfil profesional.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="relative flex items-center justify-center h-40">
                  <img
                    className="h-full"
                    src="https://placehold.co/300x200/e2e8f0/475569?text=Paso+2"
                    alt="Paso 2"
                  />
                  <div className="absolute top-0 right-0 -mr-8 -mt-2 flex items-center justify-center rounded-full bg-indigo-600 p-1 w-8 h-8">
                    <span className="text-white font-medium">2</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Configura tus servicios</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Añade tus servicios, precios y disponibilidad en el calendario.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="relative flex items-center justify-center h-40">
                  <img
                    className="h-full"
                    src="https://placehold.co/300x200/e2e8f0/475569?text=Paso+3"
                    alt="Paso 3"
                  />
                  <div className="absolute top-0 right-0 -mr-8 -mt-2 flex items-center justify-center rounded-full bg-indigo-600 p-1 w-8 h-8">
                    <span className="text-white font-medium">3</span>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">¡Comienza a gestionar!</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Empieza a recibir citas y gestiona tu negocio de forma eficiente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonios</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Lo que dicen nuestros usuarios
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Profesionales como tú que han transformado su negocio con AgendaPlus.
            </p>
          </div>

          <div className="mt-16">
            <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-lg md:max-w-2xl">
              <div className="md:flex">
                <div className="md:shrink-0">
                  <img
                    className="h-48 w-full object-cover md:h-full md:w-48"
                    src="https://placehold.co/300x300/e2e8f0/475569?text=Testimonio"
                    alt="Testimonio"
                  />
                </div>
                <div className="p-8">
                  <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">María Rodríguez</div>
                  <p className="mt-1 text-slate-500">Estilista</p>
                  <p className="mt-4 text-lg italic text-gray-600">
                    "AgendaPlus ha transformado mi negocio. Ahora gestiono mis citas sin estrés y mis clientes están más satisfechos."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="h-3 w-3 rounded-full bg-indigo-600"></button>
              <button className="h-3 w-3 rounded-full bg-gray-300 hover:bg-indigo-400"></button>
              <button className="h-3 w-3 rounded-full bg-gray-300 hover:bg-indigo-400"></button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">{t('landing.cta.title')}</span>
            <span className="block text-indigo-200">{t('landing.cta.subtitle')}</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition duration-200">
                  {t('landing.cta.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-white">AgendaPlus</div>
              <p className="mt-2 text-gray-400">{t('landing.footer.subtitle')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-200">Características</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition duration-200">Cómo funciona</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-200">Testimonios</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Cuenta</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition duration-200">{t('auth.login')}</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition duration-200">{t('auth.register')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {t('landing.footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
