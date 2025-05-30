import { Link } from 'react-router-dom';

// Página Landing completamente estática sin dependencias complejas
export function LandingSimple() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">AgendaPlus</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Gestiona tu negocio</span>
                  <span className="block text-indigo-600">con eficiencia</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  La plataforma todo-en-uno para profesionales de belleza, salud y wellness. Agenda, cobros y métricas en un solo lugar.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link 
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-200"
                    >
                      Comenzar gratis
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a 
                      href="#features" 
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition duration-200"
                    >
                      Cómo funciona
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tu negocio
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Herramientas diseñadas para simplificar tu día a día y potenciar tu crecimiento.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <div className="h-6 w-6 text-indigo-600">📅</div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Calendario inteligente</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Gestiona tus citas con un calendario intuitivo y fácil de usar.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                <div className="absolute -top-3 -left-3 p-3 rounded-full bg-indigo-100">
                  <div className="h-6 w-6 text-indigo-600">🔔</div>
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
                  <div className="h-6 w-6 text-indigo-600">📊</div>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Métricas detalladas</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Analiza el rendimiento de tu negocio con reportes completos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">¿Listo para transformar tu negocio?</span>
            <span className="block text-indigo-200">Únete a miles de profesionales que ya confían en AgendaPlus.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link 
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition duration-200"
              >
                Comenzar gratis
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
              <p className="mt-2 text-gray-400">La plataforma todo-en-uno para profesionales.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-200">Características</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Cómo funciona</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-200">Testimonios</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Cuenta</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition duration-200">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition duration-200">Registrarse</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} AgendaPlus. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
